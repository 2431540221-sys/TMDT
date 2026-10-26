const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let connected = false;

async function db() {
  if (!connected) {
    await client.connect();
    connected = true;
    console.log("Kết nối thành công đến server");
  }
  return client.db("tmdt");
}

module.exports = db;
