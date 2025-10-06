import { Point, Points } from "@/util/types/typing";
import { browser, image, scalar, tidy, Rank } from "@tensorflow/tfjs";
import { LayersModel, Tensor } from "@tensorflow/tfjs";

/**
 * Represents a bounding box with minimum and maximum points.
 */
type BoundingBox = {
    min: Point;
    max: Point;
};

/**
 * Represents inference data with a class name and probability.
 */
export type InferenceData = { name: string; prob: number };

/**
 * Calculates the bounding box for a set of coordinates.
 * 
 * @param coords - Array of points representing drawing coordinates
 * @returns A bounding box containing the minimum and maximum coordinates
 */
function getBoundingBox(coords: Point[]): BoundingBox {
    // Get coordinate arrays
    const coorX = coords.map((p) => p.x);
    const coorY = coords.map((p) => p.y);
    // Find top left and bottom right corners
    const min_coords: Point = {
        x: Math.min(...coorX),
        y: Math.min(...coorY),
    };
    const max_coords: Point = {
        x: Math.max(...coorX),
        y: Math.max(...coorY),
    };
    // Return as struct
    return {
        min: min_coords,
        max: max_coords,
    };
}

/**
 * Extracts image data from a canvas based on a bounding box.
 * 
 * @param bb - The bounding box defining the area to extract
 * @param canvas - The HTML canvas element containing the drawing
 * @returns The image data within the bounding box or null if dimensions are invalid
 * @throws Error if the canvas rendering context is not available
 */
function getImageData(bb: BoundingBox, canvas: HTMLCanvasElement): ImageData | null {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("CanvasRenderingContext2D is not available");
    }
    // Calculate the coordinates and size respecting the DPI
    const x = bb.min.x; 
    const y = bb.min.y; 
    const width = (bb.max.x - bb.min.x); 
    const height = (bb.max.y - bb.min.y); 
    
    if (width == 0 || height == 0) {
        return null;
    }

    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
        console.error("Invalid canvas dimensions", { x, y, width, height });
    }

    if (width <= 0 || height <= 0) {
        console.error("Canvas dimensions must be positive", { width, height });
    }
    // Get the image data from the context
    const imgData = ctx.getImageData(x, y, width, height);
    return imgData;
}

/**
 * Preprocesses image data for model inference.
 * Converts image data to a tensor, resizes to 28x28, normalizes values,
 * and adds a batch dimension.
 * 
 * @param imgData - The image data to preprocess
 * @returns A tensor ready for model inference
 */
function preprocess(imgData: ImageData) {
    return tidy(() => {
        // Convert to a tensor
        let tensor = browser.fromPixels(imgData, 1);
        // Resize
        const resized = image.resizeBilinear(tensor, [28, 28]).toFloat();

        // Normalize
        const offset = scalar(255.0);

        const normalized = scalar(1.0).sub(resized.div(offset));

        // We add a dimension to get a batch shape
        const batched = normalized.expandDims(0);

        return batched;
    });
}

/**
 * Performs inference using a TensorFlow.js model.
 * 
 * @param model - The TensorFlow.js model to use for inference
 * @param processedData - The preprocessed tensor data to run inference on
 * @returns The model's prediction tensor
 */
function performInference(model: LayersModel, processedData: Tensor) {
    const pred = model.predict(processedData);
    return pred;
}

/**
 * Converts model inference results to a structured format.
 * Extracts probabilities from the tensor, maps them to class names,
 * sorts by probability, and returns the top 5 results.
 * 
 * @param wordDict - Array of class names corresponding to model output indices
 * @param inferenceResult - Tensor containing model prediction probabilities
 * @returns Array of InferenceData objects with class names and rounded probabilities
 */
function getInferenceData(wordDict: string[], inferenceResult: Tensor<Rank>): InferenceData[] {
    // Convert the inference tensor into an array
    const probabilities = Array.from(inferenceResult.dataSync() as Float32Array);

    // Map each probability to an object with its value and class name
    const inferenceDataWithProb = probabilities.map((prob, index) => ({
        name: wordDict[index],
        prob: prob,
    }));
    // Sort the array by probability in descending order
    const sortedInferenceData = inferenceDataWithProb.sort((a, b) => b.prob - a.prob);

    // Slice the array to get the top 5
    const top5InferenceData = sortedInferenceData.slice(0, 5);

    // Return the top 5 inference data
    return top5InferenceData.map((data) => ({ name: data.name, prob: Math.round(data.prob * 100) / 100 }));
}

/**
 * Flattens an array of point arrays into a single array of points.
 * 
 * @param coords - Array of point arrays to flatten
 * @returns A single array containing all points from the input arrays
 */
function convertCoords(coords: Points[]): Points {
    const allPoints: Point[] = [];
    coords.forEach((points) => {
        allPoints.push(...points);
    });
    return allPoints;
}

/**
 * Draws a bounding box on a canvas context.
 * 
 * @param ctx - The canvas rendering context to draw on
 * @param bb - The bounding box to draw
 * @returns void
 */
function drawBoundingBox(ctx: CanvasRenderingContext2D, bb: BoundingBox) {
    if (!ctx) return;

    ctx.strokeStyle = "red"; // Set the color for the bounding box
    ctx.lineWidth = 2; // Set the line width for the bounding box

    // Draw a rectangle using the bounding box coordinates
    ctx.strokeRect(bb.min.x, bb.min.y, bb.max.x - bb.min.x, bb.max.y - bb.min.y);
}

/**
 * Processes a drawing from coordinates and canvas to generate predictions.
 * Takes drawing coordinates and a canvas element, extracts the drawing area,
 * preprocesses the image data, runs inference through the model, and returns
 * the top predictions with their probabilities.
 * 
 * @param model - The TensorFlow.js model to use for inference
 * @param wordDict - Array of class names corresponding to model output indices
 * @param coords - Array of point arrays representing the drawing strokes
 * @param canvas - The HTML canvas element containing the drawing
 * @returns Promise resolving to an array of InferenceData objects with class names and probabilities,
 *          or an empty array if the drawing area is invalid
 */
export async function processDrawing(model: LayersModel, wordDict: string[], coords: Points[], canvas: HTMLCanvasElement): Promise<InferenceData[]> {
    // Get minimum bounding box from coordinate array.
    const flat_coords = convertCoords(coords);
    const bb = getBoundingBox(flat_coords);
    // Get image data from minimum bounding box and canvas element.
    const imgData = getImageData(bb, canvas);

    if (!imgData) {
        return Promise.resolve([]);
    }
    // Preprocess data for model inference.
    const processedData = preprocess(imgData);
    // Rest of the function remains the same...

    // Perform inference with processed data.
    const inferenceResult = performInference(model, processedData);

    // Return inference data
    const infData = getInferenceData(wordDict, inferenceResult as Tensor<Rank>);

    return infData;
}
