var express = require("express");
var cors = require("cors");
var authRouter = require("./routes/auth");

var app = express();
app.use(cors());
app.use(express.json());

// Giữ cùng prefix với các lab: /api/...
app.use("/api/auth", authRouter);

// Gắn thêm router của Lab09 nếu có (copy routes/categories.js, routes/products.js vào thư mục routes)
try {
  app.use("/api/categories", require("./routes/categories"));
} catch (e) {}
try {
  app.use("/api/products", require("./routes/products"));
} catch (e) {}

var port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server chạy tại http://localhost:" + port));
