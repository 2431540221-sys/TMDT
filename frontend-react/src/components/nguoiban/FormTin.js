// Form đăng/sửa tin: có props.idSua -> "Sửa tin thanh lý", không có -> "Đăng tin thanh lý"
import React from 'react';
import { API, HEADERS, HEADERS_AUTH, anhUrl } from './api';

class FormTin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ten: '', gia: '', danhMucId: '', anh: [], phanTram: 80,
      tinhTrang: '', moTa: '', danhMuc: [], loi: '', dangLuu: false
    };
    this.fileRef = React.createRef();
  }

  componentDidMount() {
    fetch(`${API}/danh-muc`, { headers: HEADERS })
      .then(r => r.json())
      .then(d => this.setState({ danhMuc: d.danhMuc }))
      .catch(error => console.log('Có lỗi nè : \n', error));

    if (this.props.idSua) {
      fetch(`${API}/san-pham/${this.props.idSua}`, { headers: HEADERS })
        .then(r => { if (!r.ok) throw Error(r.statusText); return r.json(); })
        .then(d => {
          const s = d.sanPham;
          this.setState({
            ten: s.tenSanPham, gia: s.giaSanPham, danhMucId: s.danhMucIdSanPham,
            anh: s.hinhAnhSanPham || [], phanTram: s.phanTramMoiSanPham,
            tinhTrang: s.moTaTinhTrangSanPham || '', moTa: s.moTaSanPham || ''
          });
        })
        .catch(error => console.log('Có lỗi nè : \n', error));
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  // Nút "+ Thêm ảnh": upload lên server rồi nhận về đường dẫn
  chonAnh = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const fd = new FormData();
    files.forEach(f => fd.append('anh', f));
    fetch(`${API}/upload`, { method: 'POST', headers: HEADERS_AUTH, body: fd }) // không tự set Content-Type
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok) this.setState(st => ({ anh: [...st.anh, ...d.urls].slice(0, 8), loi: '' }));
        else this.setState({ loi: d.message });
      })
      .catch(error => console.log('Có lỗi nè : \n', error));
    e.target.value = '';
  };

  boAnh = (i) => this.setState(st => ({ anh: st.anh.filter((_, idx) => idx !== i) }));

  luu = (e) => {
    e.preventDefault();
    const s = this.state;
    const sua = !!this.props.idSua;
    const body = {
      tenSanPham: s.ten, giaSanPham: s.gia, danhMucIdSanPham: s.danhMucId,
      hinhAnhSanPham: s.anh, phanTramMoiSanPham: s.phanTram,
      moTaTinhTrangSanPham: s.tinhTrang, moTaSanPham: s.moTa
    };
    this.setState({ dangLuu: true, loi: '' });
    fetch(sua ? `${API}/san-pham/${this.props.idSua}` : `${API}/san-pham`, {
      method: sua ? 'PUT' : 'POST', headers: HEADERS, body: JSON.stringify(body)
    })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (ok) this.props.onNav('tin');
        else this.setState({ loi: d.message, dangLuu: false });
      })
      .catch(error => { console.log('Có lỗi nè : \n', error); this.setState({ dangLuu: false }); });
  };

  render() {
    const s = this.state;
    const sua = !!this.props.idSua;
    return (
      <div>
        <div className="sdc-page-head">
          <div>
            <h1>{sua ? 'Sửa tin thanh lý' : 'Đăng tin thanh lý'}</h1>
            <p>Cung cấp thông tin trung thực giúp món đồ sớm tìm được chủ mới</p>
          </div>
        </div>

        <form className="sdc-card sdc-form" onSubmit={this.luu}>
          {s.loi && <div className="sdc-alert">{s.loi}</div>}

          <label>Tên sản phẩm</label>
          <input name="ten" value={s.ten} onChange={this.onChange} placeholder="Nhập tên sản phẩm" />

          <div className="sdc-grid2">
            <div>
              <label>Giá bán</label>
              <input name="gia" type="number" min="0" value={s.gia} onChange={this.onChange} placeholder="0 đ" />
            </div>
            <div>
              <label>Danh mục</label>
              <select name="danhMucId" value={s.danhMucId} onChange={this.onChange}>
                <option value="">Chọn danh mục</option>
                {s.danhMuc.map(dm => <option key={dm._id} value={dm._id}>{dm.tenDanhMuc}</option>)}
              </select>
            </div>
          </div>

          <label>Hình ảnh sản phẩm</label>
          <div className="sdc-images">
            <button type="button" className="sdc-addimg" onClick={() => this.fileRef.current.click()}>+ Thêm ảnh</button>
            <input ref={this.fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={this.chonAnh} />
            {s.anh.map((a, i) => (
              <div className="sdc-img" key={a + i}>
                <img src={anhUrl(a)} alt="" onError={(e) => { e.target.style.opacity = 0.2; }} />
                <button type="button" onClick={() => this.boAnh(i)} aria-label="Bỏ ảnh">×</button>
              </div>
            ))}
          </div>

          <label>Độ mới: <span className="sdc-green">{s.phanTram}%</span></label>
          <input className="sdc-range" type="range" min="0" max="100" name="phanTram"
            value={s.phanTram} onChange={this.onChange}
            style={{ '--p': s.phanTram + '%' }} />

          <label>Mô tả tình trạng</label>
          <input name="tinhTrang" value={s.tinhTrang} onChange={this.onChange} placeholder="Ví dụ: Còn tốt, không trầy xước" />

          <label>Mô tả chi tiết</label>
          <textarea name="moTa" rows="4" value={s.moTa} onChange={this.onChange} placeholder="Mô tả chi tiết sản phẩm" />

          <div>
            <button type="submit" className="sdc-btn" disabled={s.dangLuu}>
              {sua ? 'Lưu và gửi duyệt lại' : 'Đăng tin'}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default FormTin;
