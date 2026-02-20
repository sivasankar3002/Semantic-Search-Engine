/**
 * NLP Service Client
 * HTTP client for communicating with the Python NLP microservice
 */
const axios = require("axios");

const NLP_URL = process.env.NLP_SERVICE_URL || "http://localhost:5001";

/**
 * Generate embedding for a single text
 */
async function generateEmbedding(text) {
    try {
        const response = await axios.post(
            `${NLP_URL}/embed`,
            { text },
            { timeout: 30000 }
        );
        return response.data.embedding;
    } catch (error) {
        console.error("NLP Service embed error:", error.message);
        throw new Error("Failed to generate embedding from NLP service");
    }
}

/**
 * Generate embeddings for multiple texts
 */
async function generateEmbeddingsBatch(texts) {
    try {
        const response = await axios.post(
            `${NLP_URL}/embed-batch`,
            { texts },
            { timeout: 60000 }
        );
        return response.data.embeddings;
    } catch (error) {
        console.error("NLP Service batch embed error:", error.message);
        throw new Error("Failed to generate batch embeddings from NLP service");
    }
}

/**
 * Check NLP service health
 */
async function checkHealth() {
    try {
        const response = await axios.get(`${NLP_URL}/health`, { timeout: 5000 });
        return response.data;
    } catch (error) {
        return { status: "unreachable", error: error.message };
    }
}

module.exports = { generateEmbedding, generateEmbeddingsBatch, checkHealth };
