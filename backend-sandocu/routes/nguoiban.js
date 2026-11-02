// routes/nguoiban.js - API cho vai trò NGƯỜI BÁN (Kênh người bán)
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var { ObjectId } = require('mongodb');
var db = require('./../models/database');

/* ---------- Xác thực tạm thời ----------
   Lấy id người bán từ header "x-user-id". Khi nhóm làm xong đăng nhập (JWT/session)
   chỉ cần sửa middleware này, các API bên dưới giữ nguyên. */
router.use((req, res, next) => {
  const id = req.headers['x-user-id'];
  if (!id || !ObjectId.isValid(id)) return res.status(401).json({ message: 'Chưa đăng nhập' });
  req.nguoiBanId = new ObjectId(id);
  next();
});

/* ---------- Upload ảnh (nút "+ Thêm ảnh") ---------- */
const THU_MUC_ANH = path.join(__dirname, '..', 'public', 'uploads');
fs.mkdirSync(THU_MUC_ANH, { recursive: true });
const DUOI_ANH = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, THU_MUC_ANH),
    // Đuôi file lấy theo mimetype đã whitelist, không tin tên file do client gửi
    filename: (req, file, cb) =>
      cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + DUOI_ANH[file.mimetype])
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (req, file, cb) =>
    DUOI_ANH[file.mimetype] ? cb(null, true) : cb(new Error('Chỉ nhận ảnh JPG, PNG, WEBP'))
});

router.post('/upload', (req, res) => {
  upload.array('anh', 8)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    res.json({ urls: req.files.map(f => '/uploads/' + f.filename) });
  });
});

/* ---------- Thông tin người bán (hiện ở header) ---------- */
router.get('/me', async (req, res) => {
  const database = await db();
  const tk = await database.collection('TaiKhoan').findOne(
    { _id: req.nguoiBanId },
    { projection: { hoTenTaiKhoan: 1, emailTaiKhoan: 1 } } // KHÔNG trả mật khẩu
  );
  if (!tk) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
  res.json({ taiKhoan: tk });
});

/* ---------- Validate: chỉ nhận field được phép ---------- */
function layDuLieuTin(body) {
  const ten = String(body.tenSanPham || '').trim();
  const gia = Number(body.giaSanPham);
  const phanTram = Number(body.phanTramMoiSanPham);
  if (!ten) return { loi: 'Vui lòng nhập tên sản phẩm' };
  if (!(gia > 0)) return { loi: 'Giá bán phải lớn hơn 0' };
  if (!(phanTram >= 0 && phanTram <= 100)) return { loi: 'Độ mới phải từ 0 đến 100' };
  if (!ObjectId.isValid(body.danhMucIdSanPham)) return { loi: 'Vui lòng chọn danh mục' };
  const anh = Array.isArray(body.hinhAnhSanPham)
    ? body.hinhAnhSanPham.filter(x => typeof x === 'string').slice(0, 8) : [];
  return {
    data: {
      tenSanPham: ten,
      moTaSanPham: String(body.moTaSanPham || '').trim(),
      giaSanPham: gia,
      hinhAnhSanPham: anh,
      phanTramMoiSanPham: phanTram,
      moTaTinhTrangSanPham: String(body.moTaTinhTrangSanPham || '').trim(),
      danhMucIdSanPham: new ObjectId(body.danhMucIdSanPham)
    }
  };
}

const idHopLe = (req, res) => {
  if (ObjectId.isValid(req.params.id)) return true;
  res.status(400).json({ message: 'ID không hợp lệ' });
  return false;
};

/* ================= DANH MỤC ================= */
router.get('/danh-muc', async (req, res) => {
  const database = await db();
  const kq = await database.collection('DanhMuc').find({ trangThaiDanhMuc: 'Hiển thị' }).toArray();
  res.json({ danhMuc: kq });
});

/* ================= TIN ĐĂNG ================= */
// Quản lý tin của tôi (chỉ tin của mình, không lấy tin đã xóa)
router.get('/san-pham', async (req, res) => {
  const database = await db();
  const kq = await database.collection('SanPham')
    .find({ nguoiBanIdSanPham: req.nguoiBanId, trangThaiBan: { $ne: 'Đã xóa' } })
    .sort({ ngayDangSanPham: -1 }).toArray();
  res.json({ sanPham: kq });
});

// Lấy 1 tin để đổ vào form sửa
router.get('/san-pham/:id', async (req, res) => {
  if (!idHopLe(req, res)) return;
  const database = await db();
  const kq = await database.collection('SanPham').findOne({
    _id: new ObjectId(req.params.id), nguoiBanIdSanPham: req.nguoiBanId, trangThaiBan: { $ne: 'Đã xóa' }
  });
  if (!kq) return res.status(404).json({ message: 'Không tìm thấy tin' });
  res.json({ sanPham: kq });
});

// Đăng tin -> chờ Admin duyệt
router.post('/san-pham', async (req, res) => {
  const { data, loi } = layDuLieuTin(req.body);
  if (loi) return res.status(400).json({ message: loi });
  const database = await db();
  const kq = await database.collection('SanPham').insertOne({
    ...data,
    trangThaiDuyet: 'Chờ duyệt',
    trangThaiBan: 'Đang bán',
    ngayDangSanPham: new Date(),
    nguoiBanIdSanPham: req.nguoiBanId, // lấy từ server, không tin client
    nguoiDuyetIdSanPham: null
  });
  res.status(201).json({ message: 'Đăng tin thành công, tin đang chờ Admin duyệt', _id: kq.insertedId });
});

// Sửa tin ("Lưu và gửi duyệt lại"): chỉ tin của mình & còn đang bán
router.put('/san-pham/:id', async (req, res) => {
  if (!idHopLe(req, res)) return;
  const { data, loi } = layDuLieuTin(req.body);
  if (loi) return res.status(400).json({ message: loi });
  const database = await db();
  const kq = await database.collection('SanPham').updateOne(
    { _id: new ObjectId(req.params.id), nguoiBanIdSanPham: req.nguoiBanId, trangThaiBan: 'Đang bán' },
    { $set: { ...data, trangThaiDuyet: 'Chờ duyệt', nguoiDuyetIdSanPham: null } }
  );
  if (kq.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy tin hoặc tin không còn ở trạng thái đang bán' });
  res.json({ message: 'Đã lưu và gửi duyệt lại' });
});

// Xóa tin = XÓA MỀM: chuyển sang trạng thái "Đã xóa" (giữ lại để đối soát đơn hàng)
router.delete('/san-pham/:id', async (req, res) => {
  if (!idHopLe(req, res)) return;
  const database = await db();
  const kq = await database.collection('SanPham').updateOne(
    { _id: new ObjectId(req.params.id), nguoiBanIdSanPham: req.nguoiBanId, trangThaiBan: { $ne: 'Đã xóa' } },
    { $set: { trangThaiBan: 'Đã xóa' } }
  );
  if (kq.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy tin' });
  res.json({ message: 'Đã xóa tin' });
});

// Đánh dấu đã bán
router.patch('/san-pham/:id/da-ban', async (req, res) => {
  if (!idHopLe(req, res)) return;
  const database = await db();
  const kq = await database.collection('SanPham').updateOne(
    { _id: new ObjectId(req.params.id), nguoiBanIdSanPham: req.nguoiBanId, trangThaiBan: 'Đang bán' },
    { $set: { trangThaiBan: 'Đã bán' } }
  );
  if (kq.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy tin đang bán' });
  res.json({ message: 'Đã đánh dấu đã bán' });
});

/* ================= ĐƠN CẦN XỬ LÝ ================= */
router.get('/don-hang', async (req, res) => {
  const database = await db();
  const loc = { nguoiBanIdDonHang: req.nguoiBanId };
  if (req.query.trangThai) loc.trangThaiDonHang = String(req.query.trangThai);
  const kq = await database.collection('DonHang').find(loc).sort({ ngayDatDonHang: -1 }).toArray();
  res.json({ donHang: kq });
});

// Chỉ cho chuyển trạng thái đúng quy trình
const CHUYEN_TRANG_THAI = {
  'Chờ xác nhận': ['Đang giao', 'Đã hủy'],
  'Đang giao': ['Hoàn tất', 'Đã hủy']
};

router.patch('/don-hang/:id/trang-thai', async (req, res) => {
  if (!idHopLe(req, res)) return;
  const moi = req.body.trangThaiMoi;
  const database = await db();
  const donHang = database.collection('DonHang');
  const dh = await donHang.findOne({ _id: new ObjectId(req.params.id), nguoiBanIdDonHang: req.nguoiBanId });
  if (!dh) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

  const hopLe = CHUYEN_TRANG_THAI[dh.trangThaiDonHang] || [];
  if (!hopLe.includes(moi))
    return res.status(400).json({ message: `Không thể chuyển từ "${dh.trangThaiDonHang}" sang "${moi}"` });

  const set = { trangThaiDonHang: moi };
  if (moi === 'Hoàn tất') {
    if (dh.phuongThucThanhToan === 'COD') set.trangThaiThanhToan = 'Đã thanh toán';
    // Đồ cũ chỉ có 1 món: giao thành công thì đánh dấu sản phẩm trong đơn là đã bán
    const ids = dh.danhSachChiTiet.map(ct => ct.sanPhamIdChiTiet);
    await database.collection('SanPham').updateMany({ _id: { $in: ids } }, { $set: { trangThaiBan: 'Đã bán' } });
  }
  await donHang.updateOne({ _id: dh._id }, { $set: set });
  res.json({ message: 'Đã cập nhật đơn hàng' });
});

module.exports = router;
