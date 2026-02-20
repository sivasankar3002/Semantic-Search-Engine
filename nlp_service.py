"""
Python NLP Microservice
Standalone Flask service for embedding generation.
Runs on port 5001 and is called by the Express.js API.
"""
import sys
import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# ── Load embedding model at startup ──────────────────────────
MODEL_NAME = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

logger.info(f"Loading embedding model: {MODEL_NAME} ...")
from sentence_transformers import SentenceTransformer
model = SentenceTransformer(MODEL_NAME)
EMBEDDING_DIM = len(model.encode("test"))
logger.info(f"Model loaded. Embedding dimension: {EMBEDDING_DIM}")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model": MODEL_NAME,
        "embedding_dim": EMBEDDING_DIM
    }), 200


@app.route("/embed", methods=["POST"])
def embed():
    """Generate embedding for a single text."""
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data["text"]
    if not text or not isinstance(text, str):
        return jsonify({"error": "'text' must be a non-empty string"}), 400

    embedding = model.encode(text, convert_to_tensor=False).tolist()
    return jsonify({"embedding": embedding, "dimension": len(embedding)}), 200


@app.route("/embed-batch", methods=["POST"])
def embed_batch():
    """Generate embeddings for multiple texts."""
    data = request.get_json()
    if not data or "texts" not in data:
        return jsonify({"error": "Missing 'texts' field"}), 400

    texts = data["texts"]
    if not isinstance(texts, list) or len(texts) == 0:
        return jsonify({"error": "'texts' must be a non-empty array"}), 400

    embeddings = model.encode(texts, convert_to_tensor=False, batch_size=32)
    result = [emb.tolist() for emb in embeddings]
    return jsonify({
        "embeddings": result,
        "count": len(result),
        "dimension": EMBEDDING_DIM
    }), 200


if __name__ == "__main__":
    port = int(os.getenv("NLP_SERVICE_PORT", 5001))
    logger.info(f"NLP Microservice starting on port {port}")
    app.run(host="0.0.0.0", port=port, debug=False)
