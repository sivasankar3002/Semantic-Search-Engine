from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

uri = os.getenv('MONGODB_URI')
print(f"Testing connection to: {uri[:50]}...")

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ Connection successful!")
except Exception as e:
    print(f"❌ Connection failed: {e}")