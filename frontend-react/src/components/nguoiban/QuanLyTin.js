// Màn hình "Quản lý tin của tôi"
import React from 'react';
import ModalXacNhan from './ModalXacNhan';
import { API, HEADERS, anhUrl, tienVND } from './api';

const TABS = ['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Từ chối', 'Đã bán'];

const mauDuyet = { 'Chờ duyệt': 'amber', 'Đã duyệt': 'green', 'Từ chối': 'red' };
const mauBan = { 'Đang bán': 'blue', 'Đã bán': 'gray' };

class QuanLyTin extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ds: [], tab: 'Tất cả', dongBanner: false, xoaId: null, loi: '' };
  }

  componentDidMount() { this.layDuLieu(); }

  layDuLieu = () => {
    fetch(`${API}/san-pham`, { headers: HEADERS })
      .then(res => { if (!res.ok) throw Error(res.statusText); return res.json(); })
      .then(data => this.setState({ ds: data.sanPham }))
      .catch(error => console.log('Có lỗi nè : \n', error));
  };

  goiApi = (url, method) =>
    fetch(url, { method, headers: HEADERS })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        this.setState({ loi: ok ? '' : d.message, xoaId: null });
        this.layDuLieu();
      })
      .catch(error => console.log('Có lỗi nè : \n', error));

  daBan = (id) => this.goiApi(`${API}/san-pham/${id}/da-ban`, 'PATCH');
  xoa = () => this.goiApi(`${API}/san-pham/${this.state.xoaId}`, 'DELETE');

  loc = () => {
    const { ds, tab } = this.state;
    if (tab === 'Tất cả') return ds;
    if (tab === 'Đã bán') return ds.filter(s => s.trangThaiBan === 'Đã bán');
    return ds.filter(s => s.trangThaiDuyet === tab);
  };

  render() {
    const { ds, tab, dongBanner, xoaId, loi } = this.state;
    const hienThi = this.loc();
    const coChoDuyet = ds.some(s => s.trangThaiDuyet === 'Chờ duyệt');

    return (
      <div>
        <div className="sdc-page-head">
          <div>
            <h1>Quản lý tin của tôi</h1>
            <p>Theo dõi trạng thái duyệt và bán hàng</p>
          </div>
          <button type="button" className="sdc-btn" onClick={() => this.props.onNav('form')}>+ Đăng tin</button>
        </div>

        {coChoDuyet && !dongBanner && (
          <div className="sdc-banner">
            <b>Tin đang chờ Admin duyệt</b>
            <button type="button" onClick={() => this.setState({ dongBanner: true })}>Đóng</button>
          </div>
        )}
        {loi && <div className="sdc-alert">{loi}</div>}

        <div className="sdc-tabs">
          {TABS.map(t => (
            <button key={t} type="button" className={t === tab ? 'on' : ''}
              onClick={() => this.setState({ tab: t })}>{t}</button>
          ))}
        </div>

        <div className="sdc-card sdc-table">
          <div className="sdc-row sdc-row-head">
            <div>Sản phẩm</div><div>Giá</div><div>Duyệt tin</div><div>Bán hàng</div><div>Thao tác</div>
          </div>

          {hienThi.length === 0 && <div className="sdc-empty">Chưa có tin nào ở trạng thái này</div>}

          {hienThi.map(sp => {
            const dangBan = sp.trangThaiBan === 'Đang bán';
            return (
              <div className="sdc-row" key={sp._id}>
                <div className="sdc-prod">
                  <span className="sdc-thumb">
                    {sp.hinhAnhSanPham && sp.hinhAnhSanPham[0] &&
                      <img src={anhUrl(sp.hinhAnhSanPham[0])} alt="" onError={(e) => { e.target.style.display = 'none'; }} />}
                  </span>
                  <div>
                    <div className="sdc-prod-name">{sp.tenSanPham}</div>
                    <div className="sdc-prod-date">{new Date(sp.ngayDangSanPham).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
                <div className="sdc-price">{tienVND(sp.giaSanPham)}</div>
                <div><span className={'sdc-badge ' + (mauDuyet[sp.trangThaiDuyet] || 'gray')}>{sp.trangThaiDuyet}</span></div>
                <div><span className={'sdc-badge ' + (mauBan[sp.trangThaiBan] || 'gray')}>{sp.trangThaiBan}</span></div>
                <div className="sdc-actions">
                  {dangBan && <button type="button" className="blue" onClick={() => this.props.onNav('form', sp._id)}>Sửa</button>}
                  <button type="button" className="red" onClick={() => this.setState({ xoaId: sp._id })}>Xóa</button>
                  {dangBan && <button type="button" onClick={() => this.daBan(sp._id)}>Đánh dấu đã bán</button>}
                </div>
              </div>
            );
          })}
        </div>

        {xoaId && (
          <ModalXacNhan
            tieuDe="Xóa tin đăng?"
            noiDung="Tin sẽ chuyển sang trạng thái Đã xóa và không còn hiển thị."
            nhanXacNhan="Xóa tin"
            onHuy={() => this.setState({ xoaId: null })}
            onXacNhan={this.xoa}
          />
        )}
      </div>
    );
  }
}

export default QuanLyTin;
