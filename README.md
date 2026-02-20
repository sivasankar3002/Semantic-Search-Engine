<div align="center">

# 🔍 Semantic Search Engine

### AI-Powered Context-Aware Document Search for MongoDB

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-00ED64?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)

<br/>

*Search documents by **meaning**, not just keywords. Powered by NLP embeddings and MongoDB Atlas Vector Search.*

<br/>

---

</div>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **Context-Aware Search** | Understands meaning and intent — "How does AI learn?" matches "Machine Learning Basics" |
| 💬 **Natural Language Queries** | Type plain English — no database knowledge needed |
| 🎯 **AI Relevance Matching** | Sentence Transformers generate 384-dim embeddings for precise similarity scoring |
| 🔗 **Data Discoverability** | Uncovers hidden connections across 6 topic categories |
| ⚡ **Fast & Scalable** | Atlas Vector Search with ANN indexing + microservice architecture |
| 🔄 **Multi-Query Search** | Search multiple topics simultaneously |

---

## 🏗️ Architecture

```
┌──────────────┐     HTTP      ┌──────────────────┐     MongoDB      ┌─────────────────┐
│  React.js    │ ──────────▶  │  Express.js API  │ ──────────────▶ │  MongoDB Atlas  │
│  Frontend    │              │  Backend         │                 │  Vector Search  │
│  :3000       │  ◀──────────  │  :5000           │  ◀────────────  │                 │
└──────────────┘     JSON      └────────┬─────────┘     Results     └─────────────────┘
                                        │
                                        │ HTTP
                                        ▼
                               ┌──────────────────┐
                               │  Python Flask    │
                               │  NLP Service     │
                               │  :5001           │
                               │                  │
                               │  Sentence        │
                               │  Transformers    │
                               │  all-MiniLM-L6-v2│
                               └──────────────────┘
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="25%"><b>Frontend</b></td>
<td align="center" width="25%"><b>Backend API</b></td>
<td align="center" width="25%"><b>AI/NLP Engine</b></td>
<td align="center" width="25%"><b>Database</b></td>
</tr>
<tr>
<td>React.js 18<br/>Vite<br/>Axios<br/>CSS3 (Glassmorphism)</td>
<td>Node.js<br/>Express.js<br/>MongoDB Driver<br/>CORS</td>
<td>Python 3.13<br/>Flask<br/>Sentence Transformers<br/>PyTorch</td>
<td>MongoDB Atlas<br/>Vector Search Index<br/>Cosine Similarity<br/>ANN Indexing</td>
</tr>
</table>

---

## 📁 Project Structure

```
semantic-search-engine/
│
├── 🐍 nlp_service.py            # Python NLP microservice (port 5001)
├── 🌱 seed.py                   # Database seeder (35 documents)
├── ✅ verify_setup.py            # Infrastructure verification
├── 🔍 check_embeddings.py       # Embedding diagnostic tool
├── 🔌 test_connection.py        # MongoDB connection test
├── 🚀 start_all.bat             # Launch all services
├── 📋 requirements.txt          # Python dependencies
├── 🔐 .env                      # Environment configuration
│
├── backend/                      # Express.js API
│   ├── server.js                 #   Entry point
│   ├── config/db.js              #   MongoDB connection
│   ├── routes/
│   │   ├── search.js             #   Semantic search endpoints
│   │   ├── documents.js          #   Document CRUD
│   │   └── data.js               #   Sample data & statistics
│   └── services/
│       └── nlpService.js         #   Python NLP HTTP client
│
└── frontend/                     # React.js UI
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx               #   Main app with tab navigation
        ├── index.css             #   Dark theme + glassmorphism
        ├── api/searchApi.js      #   API client
        └── components/
            ├── Header.jsx        #   Logo + API status
            ├── SearchBar.jsx     #   Search input + controls
            ├── SearchResults.jsx #   Ranked result cards
            ├── DocumentManager.jsx # Document CRUD UI
            └── Statistics.jsx    #   Dashboard
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x and **npm**
- **Python** ≥ 3.9 with **pip**
- **MongoDB Atlas** account with Vector Search Index

### 1️⃣ Clone & Install

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Express.js backend dependencies
cd backend && npm install && cd ..

# Install React frontend dependencies
cd frontend && npm install && cd ..
```

### 2️⃣ Configure Environment

Create `.env` in the project root:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB_NAME=semantic_search_db
MONGODB_COLLECTION_NAME=documents
MONGODB_VECTOR_INDEX_NAME=vector_index
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

### 3️⃣ Create Atlas Vector Search Index

In MongoDB Atlas UI → **Database** → **Search** → **Create Index**:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    }
  ]
}
```
> Index name must be `vector_index`

### 4️⃣ Seed the Database

```bash
python seed.py
```
> Inserts 35 documents across 6 categories with pre-computed embeddings

### 5️⃣ Launch All Services

**Option A** — One-click:
```bash
start_all.bat
```

**Option B** — Manual (3 terminals):
```bash
# Terminal 1: Python NLP Service
python nlp_service.py

# Terminal 2: Express.js API
cd backend && node server.js

# Terminal 3: React Frontend
cd frontend && npx vite --port 3000
```

### 6️⃣ Open the App

Navigate to **http://localhost:3000** 🎉

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/search` | Semantic search `{ query, top_k, threshold }` |
| `POST` | `/api/search/multi` | Multi-query search `{ queries, top_k, threshold }` |
| `GET` | `/api/documents` | List all documents |
| `POST` | `/api/documents` | Add document `{ title, content, metadata }` |
| `DELETE` | `/api/documents/:id` | Delete document |
| `POST` | `/api/sample-data` | Load sample documents |
| `POST` | `/api/clear` | Clear all documents |
| `GET` | `/api/stats` | Engine statistics |

---

## 🧪 Verification Scripts

```bash
# Verify infrastructure (6 checks)
python verify_setup.py

# Test MongoDB connection
python test_connection.py

# Check document embeddings
python check_embeddings.py
```

---

## 📊 How It Works

```
User Query: "How does artificial intelligence learn?"
                    │
                    ▼
        ┌─────────────────────┐
        │  Generate Embedding  │  ← Sentence Transformers
        │  [0.023, -0.15, …]  │     384 dimensions
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Vector Search       │  ← MongoDB Atlas
        │  Cosine Similarity   │     $vectorSearch
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Ranked Results      │
        │                      │
        │  #1 Machine Learning │  87.3% match
        │  #2 Deep Learning    │  82.1% match
        │  #3 Neural Networks  │  78.5% match
        └─────────────────────┘
```

---

## 📚 Document Categories

| Category | Count | Topics |
|----------|-------|--------|
| 🤖 Technology & AI | 8 | ML, LLMs, Cloud, Cybersecurity, Blockchain, IoT, Quantum, DevOps |
| 🚀 Science & Space | 6 | JWST, CRISPR, Mars, Black Holes, Oceans, Fusion |
| 💚 Health & Wellness | 6 | Sleep, Meditation, Nutrition, Cancer, Exercise, Telemedicine |
| 💼 Business & Finance | 5 | Remote Work, Crypto, Startups, Supply Chain, ESG |
| 🌍 Environment | 5 | Climate, EVs, Biodiversity, Agriculture, Water |
| 📜 History & Culture | 5 | Digital Preservation, Internet History, Ancient Civilizations, Renaissance, Space Race |

---

## 🤝 Expected Solutions Addressed

1. **Context-Aware Semantic Search** — Understands meaning, not just keywords
2. **Natural Language Query Understanding** — Plain English queries, no DB knowledge needed
3. **AI-Based Relevance Matching** — NLP embeddings + cosine similarity scoring
4. **Improved Data Discoverability** — Cross-category insights from diverse datasets
5. **Efficient & Scalable Search** — API-driven microservice architecture with modern UI

---

## 📄 License

This project is built for educational and demonstration purposes.

---

<div align="center">

**Built with ❤️ using MERN Stack + Python AI**

*MongoDB Atlas • Express.js • React.js • Node.js • Sentence Transformers*

</div>
