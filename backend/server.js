/**
 * Express.js Server — Semantic Search Engine API
 * Main entry point for the Node.js backend
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, closeDB } = require("./config/db");

const searchRoutes = require("./routes/search");
const documentRoutes = require("./routes/documents");
const dataRoutes = require("./routes/data");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ── Routes ──────────────────────────────────────────────────
app.use("/api/search", searchRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api", dataRoutes); // /api/sample-data, /api/clear, /api/stats

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Semantic Search Engine API is running",
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
});

// ── Start Server ────────────────────────────────────────────
async function start() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`\n🚀 Express.js API running on http://localhost:${PORT}`);
            console.log(`   NLP Service expected at ${process.env.NLP_SERVICE_URL || "http://localhost:5001"}`);
            console.log(`   MongoDB: ${process.env.MONGODB_DB_NAME}\n`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on("SIGINT", async () => {
    await closeDB();
    process.exit(0);
});

start();
