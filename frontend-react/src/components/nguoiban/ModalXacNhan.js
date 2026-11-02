import React from 'react';

// Hộp thoại xác nhận (dùng cho "Xóa tin đăng?" và "Hủy đơn?")
export default function ModalXacNhan({ tieuDe, noiDung, nhanXacNhan, onHuy, onXacNhan }) {
  return (
    <div className="sdc-overlay" onClick={onHuy}>
      <div className="sdc-modal" onClick={(e) => e.stopPropagation()}>
        <h4>{tieuDe}</h4>
        <p>{noiDung}</p>
        <div className="sdc-modal-actions">
          <button type="button" className="sdc-link-btn" onClick={onHuy}>Hủy</button>
          <button type="button" className="sdc-btn sdc-btn-danger" onClick={onXacNhan}>{nhanXacNhan}</button>
        </div>
      </div>
    </div>
  );
}
