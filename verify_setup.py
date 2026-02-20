"""
Semantic Search Engine — Setup Verification Script
Checks that all infrastructure components are properly configured.
"""
import sys
import os

# Track results
results = []

def check(name, func):
    """Run a check and record pass/fail."""
    try:
        msg = func()
        results.append((name, True, msg))
        print(f"  ✅ {name}: {msg}")
    except Exception as e:
        results.append((name, False, str(e)))
        print(f"  ❌ {name}: {e}")

print("=" * 60)
print("🔧 SEMANTIC SEARCH ENGINE — SETUP VERIFICATION")
print("=" * 60)

# ── Check 1: Python Version ──────────────────────────────────
def check_python():
    v = sys.version_info
    if v.major < 3 or (v.major == 3 and v.minor < 9):
        raise RuntimeError(f"Python {v.major}.{v.minor} found, need ≥ 3.9")
    return f"Python {v.major}.{v.minor}.{v.micro}"

print("\n📦 [1/6] Python Version")
check("Python ≥ 3.9", check_python)

# ── Check 2: Required Packages ───────────────────────────────
def check_packages():
    missing = []
    for pkg_import, pkg_name in [
        ("pymongo", "pymongo"),
        ("sentence_transformers", "sentence-transformers"),
        ("flask", "Flask"),
        ("dotenv", "python-dotenv"),
        ("torch", "torch"),
        ("numpy", "numpy"),
    ]:
        try:
            __import__(pkg_import)
        except ImportError:
            missing.append(pkg_name)
    if missing:
        raise RuntimeError(f"Missing packages: {', '.join(missing)}")
    return "All 6 packages importable"

print("\n📦 [2/6] Required Packages")
check("Package imports", check_packages)

# ── Check 3: Environment Variables ────────────────────────────
def check_env():
    from dotenv import load_dotenv
    load_dotenv()
    required = ["MONGODB_URI", "MONGODB_DB_NAME", "MONGODB_COLLECTION_NAME",
                 "MONGODB_VECTOR_INDEX_NAME", "EMBEDDING_MODEL"]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise RuntimeError(f"Missing .env vars: {', '.join(missing)}")
    return f"All {len(required)} variables set"

print("\n📦 [3/6] Environment Variables")
check("Env config", check_env)

# ── Check 4: MongoDB Connection ───────────────────────────────
def check_mongo():
    from pymongo import MongoClient
    uri = os.getenv("MONGODB_URI")
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")
    client.close()
    return "Ping successful"

print("\n📦 [4/6] MongoDB Atlas Connection")
check("MongoDB ping", check_mongo)

# ── Check 5: Database & Collection ────────────────────────────
def check_db():
    from pymongo import MongoClient
    uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("MONGODB_DB_NAME")
    coll_name = os.getenv("MONGODB_COLLECTION_NAME")
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    db = client[db_name]
    count = db[coll_name].count_documents({})
    client.close()
    return f"Collection '{coll_name}' accessible ({count} docs)"

print("\n📦 [5/6] Database & Collection")
check("DB access", check_db)

# ── Check 6: Embedding Model ─────────────────────────────────
def check_model():
    from sentence_transformers import SentenceTransformer
    model_name = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    model = SentenceTransformer(model_name)
    vec = model.encode("test sentence")
    dim = len(vec)
    if dim != 384:
        raise RuntimeError(f"Expected 384 dims, got {dim}")
    return f"Model loaded, output dim = {dim}"

print("\n📦 [6/6] Embedding Model")
check("Embedding model", check_model)

# ── Summary ──────────────────────────────────────────────────
print("\n" + "=" * 60)
passed = sum(1 for _, ok, _ in results if ok)
total = len(results)
print(f"🏁 RESULT: {passed}/{total} checks passed")
if passed == total:
    print("🎉 All systems go! Infrastructure is ready.")
else:
    print("⚠️  Some checks failed — review the errors above.")
print("=" * 60)

sys.exit(0 if passed == total else 1)
