export function findRelevantWords(context: string, words: string[]): string[];
export function calculateRMSEnergy(audioData: Float32Array): number;
export function wavToFloat32Array(wavBuffer: Buffer): Float32Array;
export function validateTranscription(text: string, rmsEnergy: number): boolean;
export function createWavFile(pcmData: Buffer): Buffer;
export function calculateSimilarity(text1: string, text2: string): number;
export function cleanTranscription(text: string): string;
