# Cài đặt backend (project sandocu)

## 1) Cài thư viện
    npm install cors multer

## 2) Chép file
- models/database.js  -> sandocu/models/
- routes/nguoiban.js  -> sandocu/routes/

## 3) app.js  (cors đặt TRƯỚC các app.use('/...'))
    var cors = require('cors');
    var nguoiBanRouter = require('./routes/nguoiban');

    app.use(cors());
    app.use('/api/nguoiban', nguoiBanRouter);

(app.js đã có express.static(public) nên ảnh upload ở /uploads/... tự truy cập được.)

## 4) bin/www  (đổi port 3000 -> 5000 để không trùng React)
    var port = normalizePort(process.env.PORT || '5000');

## 5) Test nhanh (header x-user-id = 65a000000000000000000003 - Trần Thị B)
    GET http://localhost:5000/api/nguoiban/san-pham
