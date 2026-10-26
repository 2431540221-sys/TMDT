var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var { ObjectId } = require("mongodb");
var db = require("./../models/database");
var { requireAuth, requireRole, JWT_SECRET } = require("./../middleware/auth");

// Bỏ field password trước khi trả về client
function publicUser(u) {
  return {
    _id: u._id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone || "",
    address: u.address || "",
    role: u.role,
    createdAt: u.createdAt,
  };
}

function signToken(u) {
  return jwt.sign({ id: u._id.toString(), role: u.role, email: u.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/* POST: Đăng ký (mặc định role = user) */
router.post("/register", async function (req, res) {
  try {
    const { fullName, email, password, phone } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ họ tên, email, mật khẩu" });
    if (password.length < 6)
      return res.status(400).json({ message: "Mật khẩu tối thiểu 6 ký tự" });

    const database = await db();
    const users = database.collection("users");
    const mail = email.trim().toLowerCase();

    if (await users.findOne({ email: mail }))
      return res.status(409).json({ message: "Email đã được đăng ký" });

    const doc = {
      fullName: fullName.trim(),
      email: mail,
      password: await bcrypt.hash(password, 10),
      phone: phone || "",
      address: "",
      role: "user",
      createdAt: new Date(),
    };
    const r = await users.insertOne(doc);
    doc._id = r.insertedId;
    res.status(201).json({ token: signToken(doc), user: publicUser(doc) });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* POST: Đăng nhập */
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });

    const database = await db();
    const user = await database
      .collection("users")
      .findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* POST: Đăng xuất (JWT stateless -> client xoá token; endpoint để đủ chức năng) */
router.post("/logout", requireAuth, function (req, res) {
  res.json({ message: "Đã đăng xuất" });
});

/* GET: Hồ sơ cá nhân */
router.get("/profile", requireAuth, async function (req, res) {
  const database = await db();
  const user = await database
    .collection("users")
    .findOne({ _id: new ObjectId(req.user.id) });
  if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản" });
  res.json({ user: publicUser(user) });
});

/* PUT: Cập nhật hồ sơ cá nhân */
router.put("/profile", requireAuth, async function (req, res) {
  const { fullName, phone, address } = req.body;
  if (!fullName || !fullName.trim())
    return res.status(400).json({ message: "Họ tên không được để trống" });

  const database = await db();
  const users = database.collection("users");
  await users.updateOne(
    { _id: new ObjectId(req.user.id) },
    { $set: { fullName: fullName.trim(), phone: phone || "", address: address || "" } }
  );
  const user = await users.findOne({ _id: new ObjectId(req.user.id) });
  res.json({ user: publicUser(user) });
});

/* PUT: Đổi mật khẩu */
router.put("/change-password", requireAuth, async function (req, res) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || newPassword.length < 6)
    return res.status(400).json({ message: "Mật khẩu mới tối thiểu 6 ký tự" });

  const database = await db();
  const users = database.collection("users");
  const user = await users.findOne({ _id: new ObjectId(req.user.id) });
  if (!(await bcrypt.compare(oldPassword, user.password)))
    return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

  await users.updateOne(
    { _id: user._id },
    { $set: { password: await bcrypt.hash(newPassword, 10) } }
  );
  res.json({ message: "Đổi mật khẩu thành công" });
});

/* ===== ADMIN: quản lý user & phân quyền ===== */

/* GET: danh sách user (admin) */
router.get("/users", requireAuth, requireRole("admin"), async function (req, res) {
  const database = await db();
  const list = await database.collection("users").find({}).sort({ createdAt: -1 }).toArray();
  res.json({ users: list.map(publicUser) });
});

/* PUT: đổi quyền user <-> admin (admin) */
router.put("/users/:id/role", requireAuth, requireRole("admin"), async function (req, res) {
  const { role } = req.body;
  if (!["user", "admin"].includes(role))
    return res.status(400).json({ message: "Role không hợp lệ" });
  if (req.params.id === req.user.id)
    return res.status(400).json({ message: "Không thể tự đổi quyền của chính mình" });

  const database = await db();
  await database
    .collection("users")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: { role } });
  res.json({ message: "Đã cập nhật quyền" });
});

/* DELETE: xoá user (admin) */
router.delete("/users/:id", requireAuth, requireRole("admin"), async function (req, res) {
  if (req.params.id === req.user.id)
    return res.status(400).json({ message: "Không thể xoá chính mình" });
  const database = await db();
  await database.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ message: "Đã xoá tài khoản" });
});

module.exports = router;
