import crypto from 'crypto';

// Ensure constant vector dimension, e.g. 1536 for OpenAI's text-embedding-ada-002 equivalent
const VECTOR_DIMENSION = 384; 

class EmbeddingService {
    constructor() {
        this.provider = process.env.EMBEDDING_PROVIDER || 'mock'; // 'openai', 'huggingface', 'mock'
    }

    /**
     * Generate an embedding vector for a given text string.
     * @param {string} text 
     * @returns {Promise<number[]>}
     */
    async generateEmbedding(text) {
        if (!text) return new Array(VECTOR_DIMENSION).fill(0);

        if (this.provider === 'openai') {
            return this._generateOpenAIEmbedding(text);
        } else if (this.provider === 'huggingface') {
            return this._generateHuggingFaceEmbedding(text);
        } else {
            return this._generateMockEmbedding(text);
        }
    }

    /**
     * Fallback mock embedding using SHA-256 hash to create a deterministic numeric vector.
     * This allows cosine similarity to actually return higher matches for similar text strings.
     * @param {string} text 
     * @returns {number[]}
     */
    _generateMockEmbedding(text) {
        // Clean text to normalize slight variations
        const cleanText = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
        
        const hash = crypto.createHash('sha256').update(cleanText).digest('hex');
        const vector = new Array(VECTOR_DIMENSION).fill(0);
        
        // Use chunks of the hash to seed the vector deterministically
        for (let i = 0; i < hash.length; i++) {
            const charCode = hash.charCodeAt(i);
            for (let j = 0; j < VECTOR_DIMENSION; j++) {
                // A pseudo-random spread algorithm
                vector[j] += Math.sin(charCode * (j + 1)) * 0.1;
            }
        }
        
        // Normalize the vector
        let magnitude = 0;
        for (let i = 0; i < VECTOR_DIMENSION; i++) {
            magnitude += vector[i] * vector[i];
        }
        magnitude = Math.sqrt(magnitude);

        if (magnitude > 0) {
            for (let i = 0; i < VECTOR_DIMENSION; i++) {
                vector[i] = vector[i] / magnitude;
            }
        }
        
        return vector;
    }

    async _generateOpenAIEmbedding(text) {
        // Future Implementation:
        // const response = await openai.embeddings.create({ model: "text-embedding-3-small", input: text });
        // return response.data[0].embedding;
        throw new Error("OpenAI provider not fully configured yet.");
    }

    async _generateHuggingFaceEmbedding(text) {
        // Future Implementation for local/free models
        throw new Error("HuggingFace provider not fully configured yet.");
    }
}

export const embeddingService = new EmbeddingService();
