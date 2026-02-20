/**
 * Document Routes
 * CRUD operations for documents
 */
const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { generateEmbedding } = require("../services/nlpService");

const COLL = () => {
    const db = getDB();
    return db.collection(process.env.MONGODB_COLLECTION_NAME || "documents");
};

/**
 * GET /api/documents — list all documents
 */
router.get("/", async (req, res) => {
    try {
        const docs = await COLL()
            .find({}, { projection: { embedding: 0 } })
            .toArray();
        docs.forEach((d) => { d._id = d._id.toString(); });
        res.json({ success: true, count: docs.length, documents: docs });
    } catch (error) {
        console.error("Get documents error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/documents — add a new document
 */
router.post("/", async (req, res) => {
    try {
        const { title, content, metadata } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, error: "Title and content are required" });
        }

        const embedding = await generateEmbedding(content);

        const document = {
            title,
            content,
            embedding,
            metadata: metadata || {},
            created_at: new Date(),
            updated_at: new Date(),
        };

        const result = await COLL().insertOne(document);
        res.status(201).json({
            success: true,
            message: "Document added successfully",
            document_id: result.insertedId.toString(),
        });
    } catch (error) {
        console.error("Add document error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/documents/:id — delete a document
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await COLL().deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: "Document not found" });
        }

        res.json({ success: true, message: "Document deleted successfully" });
    } catch (error) {
        console.error("Delete document error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
