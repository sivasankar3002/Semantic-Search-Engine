/**
 * MongoDB Connection Module
 * Handles connection to MongoDB Atlas
 */
const { MongoClient } = require("mongodb");

let client = null;
let db = null;

async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "semantic_search_db";

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("✅ Connected to MongoDB Atlas");

  db = client.db(dbName);
  return db;
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

module.exports = { connectDB, getDB, closeDB };
