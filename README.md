# Kênh NGƯỜI BÁN - SànĐồCũ (Nhóm 5) - giao diện theo Figma

Chức năng: Đăng tin, Sửa tin, Xóa tin, Đánh dấu đã bán, Xử lý đơn hàng.
Màn hình: Form đăng/sửa tin, Quản lý tin của tôi, Đơn cần xử lý.

## Cấu trúc
    backend-sandocu/
      models/database.js     -> sandocu/models/
      routes/nguoiban.js     -> sandocu/routes/
      HUONG_DAN_SUA_APP.md   -> cài cors + multer, sửa app.js, bin/www
    frontend-react/src/
      App.js                 -> thay App.js
      components/nguoiban/   -> chép cả thư mục vào src/components/
        api.js  Icons.js  Layout.js  ModalXacNhan.js
        QuanLyTin.js  FormTin.js  DonHangCanXuLy.js  nguoiban.css
    du-lieu-test/            -> import vào Compass (collection SanPham, DonHang)

## Chạy
1. Backend: `npm install cors multer`, chép file, sửa app.js + bin/www, `npm start` (port 5000).
2. Frontend: chép file, `npm start` (port 3000). Không cần bootstrap cho phần này.
3. Import 2 file trong du-lieu-test để có tin và đơn mẫu của Trần Thị B (id ...03).

## Khớp với Figma
- Header, thanh menu, sidebar "KÊNH NGƯỜI BÁN", tab lọc, bảng tin, badge màu,
  banner "Tin đang chờ Admin duyệt", hộp thoại "Xóa tin đăng?", trạng thái rỗng,
  form (ảnh, thanh trượt Độ mới, nút "Lưu và gửi duyệt lại").
- Màn "Đơn cần xử lý" chưa có trong ảnh/video nên thiết kế cùng phong cách.
- Số "1" ở giỏ hàng trên header chỉ là hiển thị (thuộc phần người mua).

## Khác so với bản trước
- Xóa tin là XÓA MỀM (trangThaiBan = "Đã xóa"), đúng nội dung hộp thoại Figma.
- Thêm upload ảnh thật (multer) cho nút "+ Thêm ảnh", ảnh lưu ở public/uploads.
- Thêm API GET /me để hiện tên người dùng ở header (không trả mật khẩu).
- Đổi người bán mẫu: sửa USER_ID trong api.js (…03 Trần Thị B, …02 Nguyễn Văn A).

## Bảo mật (Chương 5)
Lọc theo id người bán ở mọi truy vấn, validate + whitelist field, chỉ nhận ảnh JPG/PNG/WEBP ≤ 5MB,
đuôi file theo mimetype, trạng thái đơn do backend quyết định theo bảng chuyển trạng thái.
TODO: thay header x-user-id bằng JWT/session khi có đăng nhập.
