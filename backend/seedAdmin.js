// Chạy 1 lần: npm run seed  -> tạo tài khoản admin mặc định
const bcrypt = require("bcryptjs");
const db = require("./models/database");

(async () => {
  const database = await db();
  const users = database.collection("users");
  await users.createIndex({ email: 1 }, { unique: true });

  const email = "admin@tmdt.vn";
  if (await users.findOne({ email })) {
    console.log("Admin đã tồn tại:", email);
  } else {
    await users.insertOne({
      fullName: "Quản trị viên",
      email,
      password: await bcrypt.hash("admin123", 10),
      phone: "",
      address: "",
      role: "admin",
      createdAt: new Date(),
    });
    console.log("Đã tạo admin -> email: admin@tmdt.vn | mật khẩu: admin123");
  }
  process.exit(0);
})();
