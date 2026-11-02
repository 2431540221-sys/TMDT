// Khung chung: Header + thanh menu + "Kênh người bán" (sidebar) giống thiết kế Figma
import React from 'react';
import Icon from './Icons';
import { API, HEADERS } from './api';
import './nguoiban.css';

const MENU = [
  { key: 'tin', nhan: 'Tin đăng của tôi' },
  { key: 'form', nhan: 'Đăng tin mới' },
  { key: 'donhang', nhan: 'Đơn cần xử lý' }
];

// "Trần Thị B" -> "TB"
const chuVietTat = (ten = '') => {
  const t = ten.trim().split(/\s+/);
  return t.length ? (t[0][0] + (t.length > 1 ? t[t.length - 1][0] : '')).toUpperCase() : '?';
};

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ten: '' };
  }

  componentDidMount() {
    fetch(`${API}/me`, { headers: HEADERS })
      .then(r => { if (!r.ok) throw Error(r.statusText); return r.json(); })
      .then(d => this.setState({ ten: d.taiKhoan.hoTenTaiKhoan }))
      .catch(error => console.log('Có lỗi nè : \n', error));
  }

  render() {
    const { active, onNav, children } = this.props;
    return (
      <div className="sdc">
        <header className="sdc-header">
          <div className="sdc-container sdc-header-top">
            <div className="sdc-logo" onClick={() => onNav('tin')}>
              <span className="sdc-logo-icon"><Icon name="leaf" size={22} /></span>
              <span>Sàn<b>ĐồCũ</b></span>
            </div>

            <div className="sdc-search">
              <div className="sdc-search-loc"><Icon name="pin" size={16} /> TP. Hồ Chí Minh <Icon name="chevron" size={14} /></div>
              <div className="sdc-search-box">
                <Icon name="search" size={16} />
                <input placeholder="Tìm điện thoại, xe máy, bàn ghế..." />
                <button type="button" className="sdc-btn sdc-btn-sm">Tìm kiếm</button>
              </div>
            </div>

            <div className="sdc-header-right">
              <span className="sdc-cart"><Icon name="cart" size={20} /><i>1</i></span>
              <span className="sdc-sep" />
              <span className="sdc-user">
                <span className="sdc-avatar">{chuVietTat(this.state.ten)}</span>
                {this.state.ten} <Icon name="chevron" size={14} />
              </span>
              <button type="button" className="sdc-btn" onClick={() => onNav('form')}>
                <Icon name="camera" size={16} /> Đăng tin
              </button>
            </div>
          </div>

          <div className="sdc-subnav">
            <div className="sdc-container sdc-subnav-in">
              <nav>
                <a className="on">Trang chủ</a><a>Mới đăng</a><a>Danh mục</a><a>Gần bạn</a><a>Giá tốt hôm nay</a>
              </nav>
              <span className="sdc-safe"><Icon name="shield" size={15} /> Mua bán an toàn</span>
            </div>
          </div>
        </header>

        <div className="sdc-container sdc-body">
          <aside className="sdc-side">
            <div className="sdc-side-title">KÊNH NGƯỜI BÁN</div>
            {MENU.map(m => (
              <button key={m.key} type="button"
                className={'sdc-side-item' + (active === m.key ? ' on' : '')}
                onClick={() => onNav(m.key)}>{m.nhan}</button>
            ))}
            <hr />
            <button type="button" className="sdc-side-item muted">Về trang mua sắm</button>
          </aside>
          <main className="sdc-main">{children}</main>
        </div>
      </div>
    );
  }
}

export default Layout;
