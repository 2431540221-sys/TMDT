const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "tmdt_secret_key_doi_khi_nop_bai";

// Yêu cầu đã đăng nhập
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });
  try {
    req.user = jwt.verify(token, JWT_SECRET); // { id, role, email }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
}

// Phân quyền: chỉ cho phép các role được liệt kê
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole, JWT_SECRET };
