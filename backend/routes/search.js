/**
 * Search Routes
 * Handles semantic search using MongoDB Atlas Vector Search
 */
const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");
const { generateEmbedding } = require("../services/nlpService");

/**
 * Cosine similarity between two vectors (fallback search)
 */
function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    return normA && normB ? dot / (normA * normB) : 0;
}

/**
 * POST /api/search
 * Semantic search — tries Atlas Vector Search first, falls back to in-memory
 */
router.post("/", async (req, res) => {
    try {
        const { query, top_k, threshold } = req.body;
        if (!query) {
            return res.status(400).json({ success: false, error: "Search query is required" });
        }

        const limit = top_k || parseInt(process.env.VECTOR_LIMIT) || 5;
        const minThreshold = threshold ?? (parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.3);
        const numCandidates = parseInt(process.env.VECTOR_NUM_CANDIDATES) || 100;
        const collName = process.env.MONGODB_COLLECTION_NAME || "documents";
        const indexName = process.env.VECTOR_INDEX_NAME || "vector_index";

        // Generate query embedding via Python NLP service
        const queryEmbedding = await generateEmbedding(query);
        let searchMethod = "atlas_vector";
        let results = [];

        // Try Atlas Vector Search
        try {
            const db = getDB();
            const pipeline = [
                {
                    $vectorSearch: {
                        index: indexName,
                        path: "embedding",
                        queryVector: queryEmbedding,
                        numCandidates: numCandidates,
                        limit: limit,
                    },
                },
                { $addFields: { similarity_score: { $meta: "vectorSearchScore" } } },
                { $match: { similarity_score: { $gte: minThreshold } } },
                {
                    $project: {
                        embedding: 0,
                        title: 1,
                        content: 1,
                        category: 1,
                        metadata: 1,
                        similarity_score: 1,
                        created_at: 1,
                        updated_at: 1,
                    },
                },
            ];
            results = await db.collection(collName).aggregate(pipeline).toArray();
        } catch (err) {
            console.warn("Atlas Vector Search failed, using fallback:", err.message);
        }

        // Fallback: in-memory cosine similarity
        if (results.length === 0) {
            searchMethod = "fallback_cosine";
            const db = getDB();
            const docs = await db
                .collection(collName)
                .find({ embedding: { $exists: true, $ne: [] } })
                .toArray();

            const scored = docs
                .map((doc) => ({
                    ...doc,
                    similarity_score: cosineSimilarity(queryEmbedding, doc.embedding),
                }))
                .filter((d) => d.similarity_score >= minThreshold)
                .sort((a, b) => b.similarity_score - a.similarity_score)
                .slice(0, limit);

            results = scored.map(({ embedding, ...rest }) => ({
                ...rest,
                similarity_score: parseFloat(rest.similarity_score.toFixed(4)),
            }));
        }

        // Convert _id to string
        results.forEach((r) => { r._id = r._id.toString(); });

        res.json({
            success: true,
            query,
            results,
            count: results.length,
            search_method: searchMethod,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/search/multi
 * Multi-query search
 */
router.post("/multi", async (req, res) => {
    try {
        const { queries, top_k, threshold } = req.body;
        if (!queries || !Array.isArray(queries)) {
            return res.status(400).json({ success: false, error: "Queries array is required" });
        }

        const limit = top_k || parseInt(process.env.VECTOR_LIMIT) || 5;
        const minThreshold = threshold ?? (parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.3);
        const numCandidates = parseInt(process.env.VECTOR_NUM_CANDIDATES) || 100;
        const collName = process.env.MONGODB_COLLECTION_NAME || "documents";
        const indexName = process.env.VECTOR_INDEX_NAME || "vector_index";
        const db = getDB();

        const allResults = {};

        for (const query of queries) {
            const queryEmbedding = await generateEmbedding(query);
            let results = [];

            try {
                const pipeline = [
                    {
                        $vectorSearch: {
                            index: indexName,
                            path: "embedding",
                            queryVector: queryEmbedding,
                            numCandidates: numCandidates,
                            limit: limit,
                        },
                    },
                    { $addFields: { similarity_score: { $meta: "vectorSearchScore" } } },
                    { $match: { similarity_score: { $gte: minThreshold } } },
                    { $project: { embedding: 0, title: 1, content: 1, category: 1, metadata: 1, similarity_score: 1, created_at: 1 } },
                ];
                results = await db.collection(collName).aggregate(pipeline).toArray();
            } catch (_) {
                // fallback
            }

            if (results.length === 0) {
                const docs = await db.collection(collName).find({ embedding: { $exists: true, $ne: [] } }).toArray();
                results = docs
                    .map((doc) => ({ ...doc, similarity_score: cosineSimilarity(queryEmbedding, doc.embedding) }))
                    .filter((d) => d.similarity_score >= minThreshold)
                    .sort((a, b) => b.similarity_score - a.similarity_score)
                    .slice(0, limit)
                    .map(({ embedding, ...rest }) => ({ ...rest, similarity_score: parseFloat(rest.similarity_score.toFixed(4)) }));
            }

            results.forEach((r) => { r._id = r._id.toString(); });
            allResults[query] = results;
        }

        res.json({
            success: true,
            query_count: queries.length,
            results: allResults,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Multi-search error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
