export const API_ROOT = 'http://localhost:5000';
export const API = API_ROOT + '/api/nguoiban';

// Tạm hard-code người bán mẫu. Mặc định là Trần Thị B (giống thiết kế Figma).
// Đổi sang 65a000000000000000000002 nếu muốn dùng Nguyễn Văn A.
// Khi có đăng nhập thì lấy từ localStorage/token.
export const USER_ID = '65a000000000000000000003';

export const HEADERS_AUTH = { 'x-user-id': USER_ID };                       // dùng cho upload (FormData)
export const HEADERS = { 'Content-Type': 'application/json', ...HEADERS_AUTH };

// Ảnh upload lưu dạng "/uploads/xxx.jpg" -> ghép với địa chỉ backend
export const anhUrl = (p) => (!p ? '' : /^https?:/.test(p) ? p : API_ROOT + p);

export const tienVND = (n) => Number(n || 0).toLocaleString('vi-VN') + ' ₫';
