# TMĐT – Tài khoản + Nền tảng (Đăng ký / Đăng nhập / Đăng xuất / Phân quyền / Hồ sơ)

## Chạy backend (port 5000)
```
cd backend
npm install
npm run seed     # tạo admin: admin@tmdt.vn / admin123
npm start
```
MongoDB: `mongodb://localhost:27017`, database `tmdt`, collection `users` (tự tạo).
Có Lab09 thì copy `routes/categories.js`, `routes/products.js` vào `backend/routes` (app.js tự nạp).

## Chạy frontend (port 3000)
```
cd frontend
npm install
npm start
```
Có Lab09 thì copy `components/categories`, `components/products` vào `src/components`,
rồi bỏ comment trong `src/App.js` (hàm Home).

## API (/api/auth)
| Method | Path | Quyền |
|---|---|---|
| POST | /register | public |
| POST | /login | public |
| POST | /logout | đăng nhập |
| GET/PUT | /profile | đăng nhập |
| PUT | /change-password | đăng nhập |
| GET | /users | admin |
| PUT | /users/:id/role | admin |
| DELETE | /users/:id | admin |
