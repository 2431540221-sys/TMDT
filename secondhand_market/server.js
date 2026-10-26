require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'secondhand_market';

async function main() {
  await client.connect();
  const db = client.db(dbName);
  const items = db.collection('items');

  // Get all items
  app.get('/api/items', async (req, res) => {
    try {
      const data = await items.find({}).toArray();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Add a new item (example)
  app.post('/api/items', async (req, res) => {
    try {
      const result = await items.insertOne(req.body);
      res.json(result.ops ? result.ops[0] : { _id: result.insertedId, ...req.body });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

main().catch(console.error);
