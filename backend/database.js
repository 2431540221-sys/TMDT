// database.js – Helper for MongoDB connection
// Sử dụng driver mongodb native, không phụ thuộc vào bất kỳ ORM nào.
// Đảm bảo bạn đã cài đặt `mongodb` package: npm install mongodb

const { MongoClient } = require('mongodb');

// Chuỗi kết nối – thay đổi nếu bạn dùng username/password hoặc cloud service
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
// Tên database mà bạn đã nói là "sandocu"
const DB_NAME = process.env.DB_NAME || 'sandocu';

let _client = null; // MongoClient singleton
let _db = null;

/**
 * Khởi tạo kết nối tới MongoDB (singleton).
 * @returns {Promise<Db>} Promise trả về đối tượng Db đã kết nối.
 */
async function connect() {
  if (_db) return _db; // đã có kết nối

  try {
    _client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await _client.connect();
    _db = _client.db(DB_NAME);
    console.log(`✅ Đã kết nối tới MongoDB database: ${DB_NAME}`);
    return _db;
  } catch (err) {
    console.error('❌ Lỗi khi kết nối MongoDB:', err);
    throw err;
  }
}

/**
 * Trả về một collection đã được khởi tạo.
 * @param {string} name Tên collection
 * @returns {Promise<Collection>} Collection instance
 */
async function getCollection(name) {
  const db = await connect();
  return db.collection(name);
}

/**
 * Đóng kết nối (được dùng khi ứng dụng dừng hoặc trong test).
 */
async function close() {
  if (_client) {
    await _client.close();
    _client = null;
    _db = null;
    console.log('🔌 Đã đóng kết nối MongoDB');
  }
}

module.exports = { connect, getCollection, close };
