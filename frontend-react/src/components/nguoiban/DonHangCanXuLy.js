// Màn hình "Đơn cần xử lý" (Figma chưa có màn này nên thiết kế theo cùng phong cách)
import React from 'react';
import ModalXacNhan from './ModalXacNhan';
import { API, HEADERS, tienVND } from './api';

const TABS = ['Tất cả', 'Chờ xác nhận', 'Đang giao', 'Hoàn tất', 'Đã hủy'];
const mau = { 'Chờ xác nhận': 'amber', 'Đang giao': 'blue', 'Hoàn tất': 'green', 'Đã hủy': 'red' };

class DonHangCanXuLy extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ds: [], tab: 'Tất cả', huyId: null, thongBao: '', loi: '' };
  }

  componentDidMount() { this.layDuLieu(); }

  layDuLieu = () => {
    fetch(`${API}/don-hang`, { headers: HEADERS })
      .then(res => { if (!res.ok) throw Error(res.statusText); return res.json(); })
      .then(data => this.setState({ ds: data.donHang }))
      .catch(error => console.log('Có lỗi nè : \n', error));
  };

  doiTrangThai = (id, trangThaiMoi) => {
    fetch(`${API}/don-hang/${id}/trang-thai`, {
      method: 'PATCH', headers: HEADERS, body: JSON.stringify({ trangThaiMoi })
    })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        this.setState({ huyId: null, thongBao: ok ? d.message : '', loi: ok ? '' : d.message });
        this.layDuLieu();
      })
      .catch(error => console.log('Có lỗi nè : \n', error));
  };

  render() {
    const { ds, tab, huyId, thongBao, loi } = this.state;
    const hienThi = tab === 'Tất cả' ? ds : ds.filter(d => d.trangThaiDonHang === tab);
    const choXuLy = ds.filter(d => d.trangThaiDonHang === 'Chờ xác nhận').length;

    return (
      <div>
        <div className="sdc-page-head">
          <div>
            <h1>Đơn cần xử lý</h1>
            <p>Xác nhận, giao hàng và theo dõi đơn của người mua</p>
          </div>
        </div>

        {choXuLy > 0 && <div className="sdc-banner"><b>Bạn có {choXuLy} đơn đang chờ xác nhận</b></div>}
        {thongBao && <div className="sdc-ok">{thongBao}</div>}
        {loi && <div className="sdc-alert">{loi}</div>}

        <div className="sdc-tabs">
          {TABS.map(t => (
            <button key={t} type="button" className={t === tab ? 'on' : ''}
              onClick={() => this.setState({ tab: t })}>{t}</button>
          ))}
        </div>

        {hienThi.length === 0 && <div className="sdc-card"><div className="sdc-empty">Chưa có đơn hàng nào ở trạng thái này</div></div>}

        {hienThi.map(dh => (
          <div className="sdc-card sdc-order" key={dh._id}>
            <div className="sdc-order-top">
              <div>
                <div className="sdc-prod-name">{dh.diaChiGiaoHang.tenNguoiNhan} · {dh.diaChiGiaoHang.sdtNguoiNhan}</div>
                <div className="sdc-prod-date">{dh.diaChiGiaoHang.diaChiNguoiNhan}</div>
              </div>
              <span className={'sdc-badge ' + (mau[dh.trangThaiDonHang] || 'gray')}>{dh.trangThaiDonHang}</span>
            </div>

            <ul className="sdc-order-items">
              {dh.danhSachChiTiet.map((ct, i) => (
                <li key={i}><span>{ct.tenSanPhamChiTiet} × {ct.soLuongChiTiet}</span><b>{tienVND(ct.giaChiTiet)}</b></li>
              ))}
            </ul>

            <div className="sdc-order-bottom">
              <div className="sdc-prod-date">
                {dh.phuongThucThanhToan} · {dh.trangThaiThanhToan} · {new Date(dh.ngayDatDonHang).toLocaleDateString('vi-VN')}
                <div className="sdc-total">Tổng: <b>{tienVND(dh.tongTienDonHang)}</b></div>
              </div>
              <div className="sdc-order-actions">
                {dh.trangThaiDonHang === 'Chờ xác nhận' && (
                  <button type="button" className="sdc-btn sdc-btn-sm" onClick={() => this.doiTrangThai(dh._id, 'Đang giao')}>Xác nhận & giao</button>
                )}
                {dh.trangThaiDonHang === 'Đang giao' && (
                  <button type="button" className="sdc-btn sdc-btn-sm" onClick={() => this.doiTrangThai(dh._id, 'Hoàn tất')}>Giao thành công</button>
                )}
                {(dh.trangThaiDonHang === 'Chờ xác nhận' || dh.trangThaiDonHang === 'Đang giao') && (
                  <button type="button" className="sdc-btn sdc-btn-sm sdc-btn-outline-red" onClick={() => this.setState({ huyId: dh._id })}>Hủy đơn</button>
                )}
              </div>
            </div>
          </div>
        ))}

        {huyId && (
          <ModalXacNhan
            tieuDe="Hủy đơn hàng?"
            noiDung="Đơn sẽ chuyển sang trạng thái Đã hủy và không thể hoàn tác."
            nhanXacNhan="Hủy đơn"
            onHuy={() => this.setState({ huyId: null })}
            onXacNhan={() => this.doiTrangThai(huyId, 'Đã hủy')}
          />
        )}
      </div>
    );
  }
}

export default DonHangCanXuLy;
