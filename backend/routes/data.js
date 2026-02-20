/**
 * Data Routes
 * Sample data, clear, and statistics
 */
const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");
const { generateEmbeddingsBatch, checkHealth } = require("../services/nlpService");

const COLL = () => {
    const db = getDB();
    return db.collection(process.env.MONGODB_COLLECTION_NAME || "documents");
};

/**
 * POST /api/sample-data — load sample documents
 */
router.post("/sample-data", async (req, res) => {
    try {
        const count = await COLL().countDocuments();
        if (count > 0) {
            return res.status(400).json({
                success: false,
                error: "Sample data already exists. Clear it first if you want to reload.",
            });
        }

        const sampleDocs = [
            { title: "Machine Learning Basics", content: "Machine learning is a subset of artificial intelligence that focuses on training models to learn from data without explicit programming.", metadata: { category: "AI", difficulty: "beginner" } },
            { title: "Deep Learning and Neural Networks", content: "Deep learning uses neural networks with multiple layers to extract and learn complex patterns from large amounts of data.", metadata: { category: "AI", difficulty: "advanced" } },
            { title: "Natural Language Processing", content: "NLP is a branch of AI that helps computers understand, interpret, and generate human language in a meaningful way.", metadata: { category: "AI", difficulty: "advanced" } },
            { title: "Data Science and Analytics", content: "Data science combines statistics, programming, and domain expertise to extract insights and knowledge from data.", metadata: { category: "Data", difficulty: "intermediate" } },
            { title: "Computer Vision Applications", content: "Computer vision enables machines to interpret and understand the visual world using cameras and images.", metadata: { category: "AI", difficulty: "advanced" } },
            { title: "Cloud Computing Infrastructure", content: "Cloud computing provides on-demand access to computing resources over the internet for flexible and scalable solutions.", metadata: { category: "Infrastructure", difficulty: "intermediate" } },
            { title: "Database Design and Optimization", content: "Effective database design involves normalization, indexing, and query optimization for performance.", metadata: { category: "Databases", difficulty: "intermediate" } },
            { title: "Web Development Frameworks", content: "Modern web development uses frameworks like React, Vue, and Flask to build scalable and maintainable applications.", metadata: { category: "Web Dev", difficulty: "beginner" } },
        ];

        const contents = sampleDocs.map((d) => d.content);
        const embeddings = await generateEmbeddingsBatch(contents);

        const docsToInsert = sampleDocs.map((doc, i) => ({
            ...doc,
            embedding: embeddings[i],
            created_at: new Date(),
            updated_at: new Date(),
        }));

        const result = await COLL().insertMany(docsToInsert);

        res.status(201).json({
            success: true,
            message: `${result.insertedCount} sample documents added`,
            document_ids: Object.values(result.insertedIds).map((id) => id.toString()),
        });
    } catch (error) {
        console.error("Sample data error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/clear — clear all documents
 */
router.post("/clear", async (req, res) => {
    try {
        await COLL().deleteMany({});
        res.json({ success: true, message: "All documents cleared" });
    } catch (error) {
        console.error("Clear error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/stats — engine statistics
 */
router.get("/stats", async (req, res) => {
    try {
        const docCount = await COLL().countDocuments();
        const nlpHealth = await checkHealth();

        res.json({
            success: true,
            statistics: {
                total_documents: docCount,
                embedding_model: nlpHealth.model || "sentence-transformers/all-MiniLM-L6-v2",
                similarity_threshold: parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.3,
                nlp_service_status: nlpHealth.status,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
