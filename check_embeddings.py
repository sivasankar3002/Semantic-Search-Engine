"""
Diagnostic Script: Check Document Embeddings
Helps identify why semantic search returns no results
"""
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

print("=" * 60)
print("🔍 SEMANTIC SEARCH EMBEDDING DIAGNOSTIC TOOL")
print("=" * 60)

# Connect to MongoDB
try:
    uri = os.getenv('MONGODB_URI')
    db_name = os.getenv('MONGODB_DB_NAME', 'semantic_search_db')
    collection_name = os.getenv('MONGODB_COLLECTION_NAME', 'documents')
    
    print(f"\n📡 Connecting to MongoDB...")
    print(f"   URI: {uri[:50]}..." if uri else "   URI: Not found")
    print(f"   Database: {db_name}")
    print(f"   Collection: {collection_name}")
    
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("   ✓ Connection successful!")
    
    db = client[db_name]
    collection = db[collection_name]
    
except Exception as e:
    print(f"   ✗ Connection failed: {e}")
    print("\n💡 Make sure your .env file has correct MongoDB URI")
    exit(1)

# Get all documents
print(f"\n📊 Fetching documents...")
docs = list(collection.find())
print(f"   Total documents found: {len(docs)}")

if len(docs) == 0:
    print("\n⚠️  WARNING: No documents in database!")
    print("   → Go to frontend → Sample Data → Load Sample Data")
    exit(0)

# Check embeddings
print("\n" + "=" * 60)
print("📋 EMBEDDING ANALYSIS")
print("=" * 60)

docs_with_embeddings = 0
docs_without_embeddings = 0
embedding_dimensions = []

for i, doc in enumerate(docs, 1):
    title = doc.get('title', 'No Title')
    has_embedding = 'embedding' in doc and isinstance(doc.get('embedding'), list) and len(doc.get('embedding', [])) > 0
    
    if has_embedding:
        docs_with_embeddings += 1
        dim = len(doc['embedding'])
        embedding_dimensions.append(dim)
        status = "✓"
        dim_info = f"({dim} dimensions)"
    else:
        docs_without_embeddings += 1
        status = "✗"
        dim_info = "NO EMBEDDING"
    
    print(f"   {status} Document {i}: {title}")
    print(f"      → {dim_info}")

# Summary
print("\n" + "=" * 60)
print("📈 SUMMARY")
print("=" * 60)
print(f"   Total Documents: {len(docs)}")
print(f"   With Embeddings: {docs_with_embeddings} ({docs_with_embeddings/len(docs)*100:.1f}%)")
print(f"   Without Embeddings: {docs_without_embeddings} ({docs_without_embeddings/len(docs)*100:.1f}%)")

if embedding_dimensions:
    print(f"   Embedding Dimensions: {min(embedding_dimensions)} - {max(embedding_dimensions)}")
    print(f"   Expected: 384 (for all-MiniLM-L6-v2 model)")
    
    if 384 not in embedding_dimensions:
        print(f"\n⚠️  WARNING: Embedding dimensions don't match expected 384!")
        print("   → This may cause search issues")

# Recommendations
print("\n" + "=" * 60)
print("💡 RECOMMENDATIONS")
print("=" * 60)

if docs_without_embeddings > 0:
    print("   1. Documents missing embeddings!")
    print("      → Clear data and reload sample data")
    print("      → Frontend → Sample Data → Clear All → Load Sample Data")
    
if embedding_dimensions and 384 not in embedding_dimensions:
    print("   2. Embedding dimension mismatch!")
    print("      → Expected: 384 (all-MiniLM-L6-v2)")
    print(f"      → Found: {embedding_dimensions[0]}")
    print("      → Check your EMBEDDING_MODEL in .env")

if docs_with_embeddings > 0 and docs_without_embeddings == 0:
    print("   ✓ All documents have valid embeddings!")
    print("   → Try lowering similarity threshold to 0.0")
    print("   → Check if search query is too specific")

print("\n" + "=" * 60)
print("🔧 NEXT STEPS")
print("=" * 60)
print("   1. If embeddings missing: Clear & reload sample data")
print("   2. If dimensions wrong: Check .env EMBEDDING_MODEL")
print("   3. If all good: Lower threshold to 0.0 and test search")
print("   4. Check Flask terminal for errors during search")
print("=" * 60)

# Close connection
client.close()