/**
 * Audio Transcription Server
 * 
 * @module server
 * @description A Node.js server that handles real-time audio transcription using Socket.io and OpenAI's Whisper API.
 * The server receives audio chunks from clients, processes them using FFmpeg, and sends them to OpenAI for transcription.
 */

import express from "express";
import http from "http";
import { Server } from "socket.io";
import { spawn } from "child_process";
import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";
// loads variable from .env file into process.env
dotenv.config();
import { File } from "node:buffer";
globalThis.File = File;

/**
 * Express application instance
 * 
 * @type {express.Application}
 * @description The main Express application object that handles HTTP requests
 */
const app = express();

/**
 * HTTP server instance
 * 
 * @type {http.Server}
 * @description HTTP server created from the Express application
 */
const server = http.createServer(app);

/**
 * Socket.io server instance
 * 
 * @type {Server}
 * @description Socket.io server bound to the HTTP server with CORS enabled
 */
const io = new Server(server, {
  cors: { origin: "*" },
});

/**
 * Current file path
 * 
 * @type {string}
 * @description Absolute path to the current module file
 */
const __filename = fileURLToPath(import.meta.url);

/**
 * Current directory path
 * 
 * @type {string}
 * @description Absolute path to the directory containing the current module
 */
const __dirname = path.dirname(__filename);

/**
 * Temporary files directory
 * 
 * @type {string}
 * @description Path to the temporary files directory
 */
const tempDir = path.join(__dirname, 'temp');

/**
 * Ensure temp directory exists
 * 
 * @description Creates the temp directory if it doesn't exist
 */
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('Created temp directory:', tempDir);
}

/**
 * Configure Express to serve static files
 * 
 * @description Sets up middleware to serve static files from the current directory
 */
app.use(express.static(__dirname));

/**
 * Configure Express to parse JSON bodies
 * 
 * @description Sets up middleware to parse JSON request bodies
 */
app.use(express.json());

/**
 * Configure CORS for API endpoints
 * 
 * @description Sets up CORS headers to allow frontend requests
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

/**
 * OpenAI API client
 * 
 * @type {OpenAI}
 * @description Initialized OpenAI client with API key from environment variables
 * @throws {Error} If OPENAI_API_KEY is not defined in environment variables
 */
if (!process.env.OPENAI_API_KEY) {
  console.error(" Missing OPENAI_API_KEY in environment");
  process.exit(1);
}
console.log("API key loaded? Yes");
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  // Enable beta features for assistants API
  defaultQuery: { 'api-version': '2024-02-15-preview' }
});

/**
 * Load words from words.json file
 * 
 * @type {Object}
 * @description Contains the list of all available tiles/words
 */
let wordsData = null;
let vectorStoreId = null;

try {
  const wordsPath = path.join(__dirname, 'resources', 'words.json');
  const wordsFile = fs.readFileSync(wordsPath, 'utf8');
  wordsData = JSON.parse(wordsFile);
  console.log(`Loaded ${wordsData.tiles.length} words from words.json`);
} catch (error) {
  console.error("Error loading words.json:", error);
  process.exit(1);
}

/**
 * Create vector store with words data
 * 
 * @function createVectorStore
 * @description Creates a vector store and uploads words.json for semantic search
 * @async
 */
const createVectorStore = async () => {
  try {
    console.log('Creating vector store...');
    // console.log('OpenAI client methods:', Object.keys(openai));
    // console.log('Vector stores API available:', !!openai.vectorStores);
    
    // Create vector store using the correct API
    const vectorStore = await openai.vectorStores.create({
      name: "AAC Words Vector Store",
      description: "Vector store containing AAC communication tiles/words for searching."
    });
    
    vectorStoreId = vectorStore.id;
    console.log('Vector store created with ID:', vectorStoreId);
    
    // Create a file with words data
    const wordsFilePath = path.join(tempDir, 'words_for_vector_store.json');
    const wordsForVectorStore = {
      words: wordsData.tiles.map((word, index) => ({
        id: index,
        word: word,
        category: categorizeWord(word),
        description: getWordDescription(word)
      }))
    };
    
    fs.writeFileSync(wordsFilePath, JSON.stringify(wordsForVectorStore, null, 2));
    
    // First upload the file
    const file = await openai.files.create({
      file: fs.createReadStream(wordsFilePath),
      purpose: 'assistants'
    });
    
    // Then add it to the vector store
    await openai.vectorStores.files.create(vectorStore.id, {
      file_id: file.id
    });
    
    // Clean up temp file
    fs.unlinkSync(wordsFilePath);
    
    console.log('Words uploaded to vector store successfully');
    
  } catch (error) {
    console.error('Error creating vector store:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    // Fallback to simple text matching if vector store fails
    console.log('Falling back to simple text matching');
    vectorStoreId = null;
  }
};

/**
 * Categorize word for better semantic understanding
 * 
 * @function categorizeWord
 * @param {string} word - The word to categorize
 * @returns {string} Category of the word
 */
const categorizeWord = (word) => {
  const categories = {
    greeting: ['hello', 'goodbye', 'hi', 'bye'],
    emotion: ['happy', 'sad', 'angry', 'excited', 'nervous', 'scared', 'tired'],
    action: ['go', 'come', 'stop', 'start', 'play', 'eat', 'drink', 'sleep'],
    question: ['what', 'where', 'when', 'why', 'how', 'who'],
    response: ['yes', 'no', 'maybe', 'okay', 'sure', 'definitely'],
    family: ['mother', 'father', 'sister', 'brother', 'grandma', 'grandpa'],
    body: ['head', 'hand', 'foot', 'eye', 'mouth', 'arm', 'leg'],
    color: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple'],
    time: ['today', 'tomorrow', 'yesterday', 'morning', 'afternoon', 'evening'],
    place: ['home', 'school', 'hospital', 'store', 'park', 'restaurant']
  };
  
  for (const [category, words] of Object.entries(categories)) {
    if (words.includes(word.toLowerCase())) {
      return category;
    }
  }
  return 'general';
};

/**
 * Get description for word to improve semantic search
 * 
 * @function getWordDescription
 * @param {string} word - The word to describe
 * @returns {string} Description of the word
 */
const getWordDescription = (word) => {
  const descriptions = {
    'hello': 'greeting used to say hi or start a conversation',
    'goodbye': 'farewell greeting used when leaving',
    'yes': 'positive response or agreement',
    'no': 'negative response or disagreement',
    'please': 'polite request word',
    'thankyou': 'expression of gratitude',
    'sorry': 'apology or expression of regret',
    'help': 'request for assistance or support',
    'more': 'request for additional quantity',
    'again': 'request to repeat or do something once more',
    'stop': 'command to halt or cease an action',
    'go': 'command to move or proceed',
    'come': 'command to approach or move closer',
    'eat': 'action of consuming food',
    'drink': 'action of consuming liquid',
    'sleep': 'rest state for the body',
    'play': 'engaging in fun activities',
    'work': 'engaging in productive activities',
    'home': 'place where one lives',
    'school': 'educational institution',
    'hospital': 'medical facility for treatment',
    'store': 'place to buy goods',
    'happy': 'feeling of joy or contentment',
    'sad': 'feeling of sorrow or unhappiness',
    'angry': 'feeling of strong displeasure',
    'tired': 'feeling of exhaustion or fatigue',
    'hungry': 'feeling of need for food',
    'thirsty': 'feeling of need for liquid'
  };
  
  return descriptions[word.toLowerCase()] || `AAC communication tile for the word "${word}"`;
};

/**
 * Next Tile Prediction endpoint
 * 
 * @route POST /api/nextTilePred
 * @description Uses OpenAI file search to predict next tiles based on transcript context
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing transcript text
 * @param {string} req.body.transcript - The transcript text to analyze
 * @param {Object} res - Express response object
 * 
 * @returns {Object} JSON response with predicted tiles
 * @returns {string[]} predictedTiles - Array of suggested next tiles
 * @returns {string} status - Success or error status
 */
app.post('/api/nextTilePred', async (req, res) => {
  try {
    const { transcript } = req.body;
    
    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ 
        error: 'Transcript text is required',
        status: 'error'
      });
    }

    // Get the last few lines of the transcript for context
    const lines = transcript.trim().split('\n').filter(line => line.trim());
    const contextLines = lines.slice(-2).join(' '); // Last 2 lines as context
    
    if (!contextLines.trim()) {
      return res.status(400).json({ 
        error: 'No valid context found in transcript',
        status: 'error'
      });
    }

    try {
      let relevantWords = [];
      
      if (vectorStoreId) {
        // Use vector store for semantic search
        console.log('Using vector store for semantic search...');
        // console.log('Vector store ID:', vectorStoreId);
        // console.log('OpenAI client methods:', Object.keys(openai));
        // console.log('Assistants API available:', !!openai.assistants);
        // console.log('Beta API available:', !!openai.beta);
        // console.log('Beta assistants available:', !!openai.beta?.assistants);
        
        try {
          // Use Responses API with file search (correct structure)
          console.log('Using Responses API with file search...');
          // console.log('Responses API available:', !!openai.responses);
          
          // Create a response with vector store using correct Responses API structure
          const response = await openai.responses.create({
            input: `Based on this conversation context: "${contextLines}"

Find the most relevant words that would be good next tiles to suggest for an AAC user. Use the file search to find contextually relevant words from the available tiles.

CRITICAL: Return ONLY a simple list of 5-8 words, one per line, with no explanations, numbers, or formatting. Example:
eat
taco
happy
please
thankyou

PRIORITIZE: Action words (eat, drink, sleep, walk, play, work, help), emotional words (happy, sad, tired, sick), essential communication (yes, no, please, thank you), contextually relevant nouns (home, school, work, food, family), and descriptive words (good, bad, new, old).

AVOID: Pronouns, prepositions, conjunctions, generic words like 'bottom', 'top', 'side', 'ai', 'animal', 'chair', 'bridge', 'thing', 'stuff', 'place', 'way', 'time', and auxiliary verbs.

Return ONLY the words, nothing else.`,
            model: "gpt-4o-mini",
            tools: [{
              "type": "file_search",
              "vector_store_ids": [vectorStoreId]
            }]
          });
          
          // console.log('Response created:', response);
          // console.log('Response ID:', response.id);

          if (response.output_text) {
            const responseText = response.output_text;
            // console.log('AI Response:', responseText);
            
            // Extract words from the response - improved parsing
            const words = responseText
              .split('\n')  // Split by lines first
              .map(line => line.trim())  // Remove whitespace
              .filter(line => {
                // Remove empty lines and lines that look like explanations
                if (!line) return false;
                if (line.match(/^\d+\./)) return false;  // Remove numbered lines like "1. taco"
                if (line.toLowerCase().includes('here are')) return false;
                if (line.toLowerCase().includes('most relevant')) return false;
                if (line.toLowerCase().includes('based on')) return false;
                if (line.toLowerCase().includes('conversation context')) return false;
                if (line.toLowerCase().includes('suggested words')) return false;
                if (line.toLowerCase().includes('available tiles')) return false;
                if (line.toLowerCase().includes('all the')) return false;
                return true;
              })
              .map(line => {
                // Extract just the word from each line
                const word = line.replace(/^\d+\.\s*/, '').trim().toLowerCase();
                return word;
              })
              .filter(word => {
                // Basic filters
                if (word.length <= 1) return false;
                
                // Exclude pronouns and prepositions
                const excludedWords = [
                  'and', 'or', 'but', 'because', 'if', 'when', 'where', 'what', 'who', 'how',
                  'at', 'by', 'for', 'from', 'in', 'of', 'on', 'to', 'with', 'up', 'down',
                  'he', 'she', 'it', 'they', 'we', 'you', 'him', 'her', 'his', 'hers', 'theirs',
                  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
                  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
                  'again', 'also', 'still', 'very', 'really', 'maybe', 'definitely',
                  'here', 'the', 'a', 'an', 'this', 'that', 'these', 'those'
                ];
                
                if (excludedWords.includes(word)) return false;
                
                // Exclude words that are too generic
                const lowValueWords = [
                  'bottom', 'top', 'side', 'middle', 'front', 'back', 'left', 'right',
                  'ai', 'animal', 'chair', 'bad', 'bridge', 'bring', 'thing', 'stuff',
                  'place', 'way', 'time', 'day', 'night', 'year', 'month', 'week'
                ];
                
                if (lowValueWords.includes(word)) return false;
                
                // Check if word exists in tiles (handle variations like "thank you" vs "thankyou")
                const wordExists = wordsData.tiles.includes(word) || 
                                 wordsData.tiles.includes(word.replace(/\s+/g, '')) ||
                                 wordsData.tiles.some(tile => tile.toLowerCase().includes(word));
                
                if (!wordExists) {
                  //console.log(`Filtered out word not in tiles: "${word}"`);
                  return false;
                }
                
                return true;
              });
            
            // Score words by relevance to context
            const contextLower = contextLines.toLowerCase();
            const contextWords = contextLower.split(/\s+/);
            
            const scoredWords = words.map(word => {
              let score = 0;
              
              // Higher score for words that appear in context
              if (contextWords.includes(word)) score += 10;
              
              // Higher score for common follow-up words
              const commonFollowUps = [
                'yes', 'no', 'please', 'thankyou', 'hello', 'goodbye', 'okay',
                'more', 'new', 'good', 'bad', 'happy', 'sad', 'tired', 'sick',
                'home', 'school', 'work', 'play', 'eat', 'drink', 'sleep', 'walk',
                'help', 'stop', 'start', 'finish', 'ready', 'sorry', 'excuseMe'
              ];
              
              if (commonFollowUps.includes(word)) score += 5;
              
              // Higher score for action words
              const actionWords = [
                'eat', 'drink', 'sleep', 'walk', 'run', 'jump', 'sit', 'stand',
                'help', 'stop', 'start', 'finish', 'play', 'work', 'learn', 'teach',
                'give', 'take', 'buy', 'sell', 'cook', 'clean', 'wash', 'fix'
              ];
              
              if (actionWords.includes(word)) score += 3;
              
              return { word, score };
            });
            
            // Sort by score and take top words
            const sortedWords = scoredWords
              .sort((a, b) => b.score - a.score)
              .slice(0, 8)
              .map(item => item.word);
            
            relevantWords = sortedWords;
            // console.log('Selected words:', relevantWords);
          }
          
        } catch (responseError) {
          console.error('Responses API error:', responseError);
          console.log('Falling back to text matching due to Responses API error');
          relevantWords = findRelevantWords(contextLines, wordsData.tiles);
        }
        
      } else {
        // Fallback to simple text matching
        console.log('Using fallback text matching...');
        relevantWords = findRelevantWords(contextLines, wordsData.tiles);
      }
      
      res.json({
        predictedTiles: relevantWords,
        status: 'success',
        context: contextLines
      });

    } catch (error) {
      console.error('Vector store search error:', error);
      
      // Fallback to simple text matching
      const relevantWords = findRelevantWords(contextLines, wordsData.tiles);
      
      res.json({
        predictedTiles: relevantWords,
        status: 'success',
        context: contextLines
      });
    }

  } catch (error) {
    console.error('NextTilePred error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      status: 'error'
    });
  }
});




/**
 * Simple word relevance matching function
 * 
 * @function findRelevantWords
 * @description Finds relevant words based on context using simple text matching
 * 
 * @param {string} context - The conversation context
 * @param {string[]} words - Array of available words
 * @returns {string[]} Array of relevant words (max 8)
 */
function findRelevantWords(context, words) {
  const contextLower = context.toLowerCase();
  const contextWords = contextLower.split(/\s+/);
  
  // Comprehensive exclusion list
  const excludedWords = [
    // Pronouns
    'he', 'she', 'it', 'they', 'we', 'you', 'him', 'her', 'his', 'hers', 'theirs', 'mine', 'yours', 'ours',
    // Prepositions/conjunctions
    'and', 'or', 'but', 'because', 'if', 'when', 'where', 'what', 'who', 'how', 'why',
    'at', 'by', 'for', 'from', 'in', 'of', 'on', 'to', 'with', 'up', 'down', 'over', 'under', 'through',
    // Auxiliary verbs
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must',
    // Filler words
    'again', 'also', 'still', 'very', 'really', 'maybe', 'definitely', 'almost', 'even', 'just', 'only',
    // Generic/low-value words
    'bottom', 'top', 'side', 'middle', 'front', 'back', 'left', 'right', 'center',
    'ai', 'animal', 'chair', 'bad', 'bridge', 'bring', 'thing', 'stuff', 'place', 'way', 'time',
    'day', 'night', 'year', 'month', 'week', 'hour', 'minute', 'second',
    'about', 'around', 'somewhere', 'anywhere', 'everywhere', 'nowhere',
    'awesome', 'cool', 'nice', 'good', 'great', 'wonderful', 'amazing', 'fantastic'
  ];
  
  // High-value words prioritized by category
  const highValueWords = {
    // Essential communication (highest priority)
    essential: ['yes', 'no', 'please', 'thankyou', 'hello', 'goodbye', 'okay', 'sorry', 'excuseMe'],
    
    // Action words (high priority)
    actions: ['eat', 'drink', 'sleep', 'walk', 'run', 'jump', 'sit', 'stand', 'play', 'work',
              'help', 'stop', 'start', 'finish', 'learn', 'teach', 'give', 'take', 'buy', 'sell',
              'cook', 'clean', 'wash', 'fix', 'open', 'close', 'push', 'pull', 'cut', 'break',
              'drive', 'ride', 'fly', 'swim', 'dance', 'sing', 'read', 'write', 'draw', 'paint'],
    
    // Emotional words (high priority)
    emotions: ['happy', 'sad', 'tired', 'sick', 'excited', 'scared', 'angry', 'confused', 'frustrated',
               'nervous', 'shy', 'smart', 'pretty', 'handsome', 'hungry', 'thirsty', 'hot', 'cold'],
    
    // Important nouns (medium-high priority)
    nouns: ['home', 'school', 'work', 'food', 'family', 'friend', 'mother', 'father', 'brother',
            'sister', 'grandma', 'grandpa', 'baby', 'boy', 'girl', 'man', 'woman', 'people',
            'water', 'milk', 'bread', 'pizza', 'hamburger', 'carrot', 'apple', 'orange',
            'car', 'bus', 'house', 'room', 'bed', 'table', 'door', 'window',
            'book', 'toy', 'game', 'music', 'song', 'tv', 'phone', 'computer'],
    
    // Descriptive words (medium priority)
    descriptive: ['big', 'small', 'new', 'old', 'fast', 'slow', 'loud', 'quiet',
                  'hard', 'soft', 'sharp', 'dull', 'clean', 'dirty', 'wet', 'dry', 'full', 'empty'],
    
    // Quantity/time words (lower priority)
    quantity: ['more', 'less', 'all', 'some', 'many', 'few', 'first', 'last', 'next', 'ready']
  };
  
  // Score words based on context relevance and category priority
  const scoredWords = words.map(word => {
    const wordLower = word.toLowerCase();
    
    // Skip excluded words
    if (excludedWords.includes(wordLower)) {
      return { word, score: -100 };
    }
    
    let score = 0;
    
    // High score for words that appear in context
    if (contextWords.includes(wordLower)) {
      score += 20;
    }
    
    // Score by category priority
    for (const [category, wordList] of Object.entries(highValueWords)) {
      if (wordList.includes(wordLower)) {
        switch (category) {
          case 'essential': score += 15; break;
          case 'actions': score += 12; break;
          case 'emotions': score += 10; break;
          case 'nouns': score += 8; break;
          case 'descriptive': score += 5; break;
          case 'quantity': score += 3; break;
        }
        break;
      }
    }
    
    // Common follow-up patterns
    const commonPatterns = [
      'yes', 'no', 'please', 'thankyou', 'hello', 'goodbye', 'okay', 'sorry',
      'more', 'help', 'stop', 'start', 'finish', 'ready'
    ];
    
    if (commonPatterns.includes(wordLower)) {
      score += 5;
    }
    
    return { word, score };
  });
  
  // Filter out negative scores and sort by score
  const relevantWords = scoredWords
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(item => item.word);
  
  // If we don't have enough words, add some fallback words
  if (relevantWords.length < 5) {
    const fallbackWords = [
      'yes', 'no', 'please', 'thankyou', 'hello', 'goodbye', 'okay',
      'more', 'help', 'stop', 'start', 'finish', 'ready', 'sorry'
    ];
    
    const additionalWords = fallbackWords.filter(word => 
      !relevantWords.includes(word) && 
      words.includes(word) && 
      !excludedWords.includes(word)
    );
    
    relevantWords.push(...additionalWords.slice(0, 8 - relevantWords.length));
  }
  
  return relevantWords.slice(0, 8);
}



/**
 * Cleanup function to remove old temporary files
 * 
 * @function cleanupTempFiles
 * @description Removes temporary files older than 1 hour
 */
const cleanupTempFiles = () => {
  try {
    const files = fs.readdirSync(tempDir);
    const oneHourAgo = Date.now() - (60 * 60 * 1000); // 1 hour ago
    
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime.getTime() < oneHourAgo) {
        fs.unlinkSync(filePath);
        // console.log(`Cleaned up old temp file: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
  }
};


/**
 * Graceful shutdown handler
 * 
 * @function gracefulShutdown
 * @description Handles server shutdown and cleanup
 */
const gracefulShutdown = async () => {
  console.log('Shutting down server...');
  
  // Clean up vector store if it exists
  if (vectorStoreId) {
    try {
      await openai.vectorStores.delete(vectorStoreId);
      console.log('Vector store cleaned up');
    } catch (error) {
      console.error('Error cleaning up vector store:', error);
    }
  }
  
  // Clean up all temp files on shutdown
  try {
    const files = fs.readdirSync(tempDir);
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      fs.unlinkSync(filePath);
      // console.log(`Cleaned up temp file: ${file}`);
    });
  } catch (error) {
    console.error('Error cleaning up temp files on shutdown:', error);
  }
  
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

// Set up cleanup interval (every 30 minutes)
setInterval(cleanupTempFiles, 10 * 60 * 1000);

// Handle graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

/**
 * Start the HTTP server
 * 
 * @function listen
 * @description Starts the server on port 5000
 * 
 * @postcondition Server is running and listening for connections on port 5000
 */
server.listen(5000, async () => {
  console.log("Server running on http://localhost:5000");
  console.log("Temp directory:", tempDir);
  
  // Initialize vector store
  await createVectorStore();
});

/**
 * Socket.io connection event handler
 * 
 * @event connection
 * @description Handles new client connections and sets up audio processing for each client
 * 
 * @param {Socket} socket - The Socket.io socket object for the connected client
 */
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  /**
   * FFmpeg child process
   * 
   * @type {ChildProcess}
   * @description Child process running FFmpeg for audio conversion
   */
  let ffmpeg;
  
  /**
   * Audio buffer for storing processed audio chunks
   * 
   * @type {Buffer}
   * @description Buffer that accumulates audio data from FFmpeg for processing
   */
  let audioBuffer = Buffer.alloc(0);
  
  /**
   * Flag to prevent concurrent audio processing
   * 
   * @type {boolean}
   * @description When true, indicates that audio processing is in progress
   */
  let isProcessing = false;
  
  /**
   * Counter for generating unique temporary filenames
   * 
   * @type {number}
   * @description Incremented for each processed audio chunk to ensure unique filenames
   */
  let fileCounter = 0;
  
  /**
   * Counter for tracking consecutive empty audio inputs
   * 
   * @type {number}
   * @description Tracks how many consecutive times the audio buffer was too small to process
   */
  let silenceCounter = 0;
  
  /**
   * Duration in milliseconds between audio processing attempts
   * 
   * @type {number}
   * @description Defines how frequently the audio buffer is processed (4 seconds)
   */
  const CHUNK_DURATION = 4000; 

  /**
   * Initializes the FFmpeg process for audio conversion
   * 
   * @function initializeFFmpeg
   * @description Creates a new FFmpeg child process configured to convert WebM audio to raw PCM format
   * 
   * @precondition FFmpeg must be installed on the system
   * @postcondition ffmpeg variable contains a running FFmpeg process ready to receive audio data
   * 
   * @throws {Error} If FFmpeg is not installed or encounters an error during initialization
   */
  const initializeFFmpeg = () => {
    ffmpeg = spawn(ffmpegPath, [
      "-f", "webm", // input format : webm
      "-i", "pipe:0", // input goes into stdin
      "-ar", "16000",
      "-ac", "1",
      "-acodec", "pcm_s16le",
      "-f", "s16le", // output format raw PCM(what whisper takes in)
      "pipe:1", //writes output to stdout
    ]);

    /**
     * FFmpeg stderr data event handler
     * 
     * @event stderr.data
     * @description Logs FFmpeg error output for debugging
     * 
     * @param {Buffer} data - The error data from FFmpeg
     */
    ffmpeg.stderr.on("data", (data) => {
      // console.log("ffmpeg:", data.toString());
    });

    /**
     * FFmpeg close event handler
     * 
     * @event close
     * @description Logs when the FFmpeg process closes
     * 
     * @param {number} code - The exit code from the FFmpeg process
     */
    ffmpeg.on("close", (code) => {
      console.log("ffmpeg closed with code", code);
    });

    /**
     * FFmpeg error event handler
     * 
     * @event error
     * @description Handles errors from the FFmpeg process
     * 
     * @param {Error} err - The error object
     */
    ffmpeg.on("error", (err) => {
      console.error("FFmpeg error:", err);
    });
  };
  
  // Initialize ffmpeg process 
  initializeFFmpeg();

  /**
   * FFmpeg stdout data event handler
   * 
   * @event stdout.data
   * @description Collects converted PCM audio data from FFmpeg
   * 
   * @param {Buffer} chunk - A chunk of PCM audio data
   * @postcondition Audio data is appended to the audioBuffer
   */
  ffmpeg.stdout.on("data", (chunk) => {
    audioBuffer = Buffer.concat([audioBuffer, chunk]);
  });

  /**
   * Creates a WAV file from raw PCM data
   * 
   * @function createWavFile
   * @description Manually constructs a WAV file by adding a WAV header to PCM data
   * 
   * @param {Buffer} pcmData - The raw PCM audio data
   * @returns {Buffer} A complete WAV file as a buffer
   */
  const createWavFile = (pcmData) => {
    const wavHeader = Buffer.alloc(44);
    const dataSize = pcmData.length;
    
    // RIFF header
    wavHeader.write('RIFF', 0);
    wavHeader.writeUInt32LE(36 + dataSize, 4);
    wavHeader.write('WAVE', 8);
    
    // fmt chunk
    wavHeader.write('fmt ', 12);
    wavHeader.writeUInt32LE(16, 16); // chunk size
    wavHeader.writeUInt16LE(1, 20); // PCM format
    wavHeader.writeUInt16LE(1, 22); // mono
    wavHeader.writeUInt32LE(16000, 24); // sample rate
    wavHeader.writeUInt32LE(16000 * 2, 28); // byte rate
    wavHeader.writeUInt16LE(2, 32); // block align
    wavHeader.writeUInt16LE(16, 34); // bits per sample
    
    // data chunk
    wavHeader.write('data', 36);
    wavHeader.writeUInt32LE(dataSize, 40);
    
    return Buffer.concat([wavHeader, pcmData]);
  };

  /**
   * Processes audio data and sends it for transcription
   * 
   * @function processAudio
   * @description Takes a chunk of audio from the buffer, converts it to WAV, and sends it to OpenAI for transcription
   * 
   * @precondition Sufficient audio data must be available in the buffer
   * @postcondition Transcription results are emitted to the client if successful
   * 
   * @throws {Error} If there are issues with file operations or the OpenAI API
   * @async
   */
  const processAudio = async () => {
    // Skip processing if already busy or audio buffer is too small
    if (isProcessing || audioBuffer.length < 32000) { // Need at least 1 second of audio
      silenceCounter++;
      if (silenceCounter > 3) {
        // Reset buffer if too much silence to prevent memory buildup
        audioBuffer = Buffer.alloc(0);
        silenceCounter = 0;
      }
      return;
    }
    // lock processing
    isProcessing = true;
    silenceCounter = 0;
    
    // Take a chunk of audio (4 seconds worth = 16000 samples/sec * 2 bytes/sample * 4 sec = 128000 bytes)
    const chunkSize = Math.min(audioBuffer.length, 128000);
    // new buffer that crops referenced buffer(audio buffer) to only 4 seconds of audio
    const pcmChunk = audioBuffer.slice(0, chunkSize);
    
    // Keep the remaining audio for next chunk
    audioBuffer = audioBuffer.slice(chunkSize);
    
    // Generate a unique filename per chunk
    const filename = `temp_${socket.id}_${Date.now()}_${fileCounter++}.wav`;
    
    // try creating the wavefile
    try {
      const wavData = createWavFile(pcmChunk);
      fs.writeFileSync(filename, wavData);
      // console.log(`Saved ${wavData.length} bytes → ${filename}`);
      // call whisper ai 
      const transcription = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: fs.createReadStream(filename), // upload the wav file via stream
        language: "en",
        response_format: "json"
      });
      
      // console.log("Transcript:", transcription.text);
      socket.emit("transcript", transcription.text);
      // error handling
    } catch (err) {
      console.error("Transcription error:", err);
      if (err.status === 400) {
        console.error("Bad request - audio format issue");
        // If there's a format issue, try with a different approach
        if (audioBuffer.length > 128000) {
          // If we have enough data, try skipping the problematic chunk
          audioBuffer = audioBuffer.slice(128000);
        }
      }
    } finally {
      // Clean up temp file
      try {
        //delete temp file
        fs.unlinkSync(filename);
      } catch (cleanupErr) {
        console.error("Error cleaning up file:", cleanupErr);
      }
      //reset isProcessing
      isProcessing = false;
    }
  };

  /**
   * Interval for regular audio processing
   * 
   * @type {NodeJS.Timeout}
   * @description Timer that triggers audio processing at regular intervals
   */
  const interval = setInterval(processAudio, CHUNK_DURATION);

  /**
   * Audio chunk event handler
   * 
   * @event audio-chunk
   * @description Receives audio chunks from the client and passes them to FFmpeg
   * 
   * @param {ArrayBuffer} data - The audio data chunk from the client
   * @throws {Error} If there are issues writing to the FFmpeg process
   */
  socket.on("audio-chunk", (data) => {
    try {
      if (ffmpeg && ffmpeg.stdin.writable) {
        ffmpeg.stdin.write(Buffer.from(data));
      }
    } catch (err) {
      console.error("stdin write error:", err);
      // Reinitialize FFmpeg if there's an error
      if (ffmpeg) {
        ffmpeg.kill();
      }
      initializeFFmpeg();
    }
  });

  /**
   * Socket disconnect event handler
   * 
   * @event disconnect
   * @description Cleans up resources when a client disconnects
   * 
   * @postcondition FFmpeg process is terminated, interval is cleared, and buffer is reset
   */
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    clearInterval(interval);
    if (ffmpeg) {
      ffmpeg.stdin.end();
      ffmpeg.kill();
    }
    audioBuffer = Buffer.alloc(0);
  });
});