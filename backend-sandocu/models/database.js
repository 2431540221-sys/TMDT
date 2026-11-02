// models/database.js - kết nối MongoDB (giống Lab08, đổi sang DB "sandocu")
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");

async function db() {
  await client.connect();
  return client.db("sandocu");
}

module.exports = db;
