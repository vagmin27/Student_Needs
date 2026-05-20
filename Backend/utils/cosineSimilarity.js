/**
 * Calculates the cosine similarity between two vectors.
 * Returns a score between -1.0 and 1.0 (1.0 means perfectly identical directions).
 * 
 * @param {number[]} vecA 
 * @param {number[]} vecB 
 * @returns {number} 
 */
export const cosineSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
    if (vecA.length !== vecB.length) return 0; // Vectors must be of same dimension

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};
