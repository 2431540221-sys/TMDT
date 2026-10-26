import React from "react";
import { Link } from "react-router-dom";
import { api, saveSession } from "../services/auth";
import CloverLogo from "../components/CloverLogo";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "", email: "", phone: "", password: "", confirm: "",
      error: "", loading: false,
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value, error: "" });

  onSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, phone, password, confirm } = this.state;
    if (password !== confirm) return this.setState({ error: "Mật khẩu nhập lại không khớp" });

    this.setState({ loading: true, error: "" });
    try {
      const { token, user } = await api("/register", "POST", { fullName, email, phone, password });
      saveSession(token, user); // đăng ký xong tự đăng nhập
      window.location.href = "/";
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  render() {
    const { fullName, email, phone, password, confirm, error, loading } = this.state;
    return (
      <div className="container my-5" style={{ maxWidth: 480 }}>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="text-center mb-3">
              <span className="d-inline-flex p-2 rounded-circle" style={{ background: "#2e7d32" }}>
                <CloverLogo size={40} />
              </span>
              <h4 className="mt-2 mb-0">Tạo tài khoản</h4>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={this.onSubmit}>
              <div className="mb-3">
                <label className="form-label">Họ và tên</label>
                <input name="fullName" className="form-control" required value={fullName} onChange={this.onChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" required value={email} onChange={this.onChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input name="phone" className="form-control" value={phone} onChange={this.onChange} />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mật khẩu</label>
                  <input type="password" name="password" className="form-control" required minLength={6}
                    value={password} onChange={this.onChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nhập lại mật khẩu</label>
                  <input type="password" name="confirm" className="form-control" required
                    value={confirm} onChange={this.onChange} />
                </div>
              </div>
              <button className="btn btn-success w-100" disabled={loading}>
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>

            <p className="text-center text-muted mt-3 mb-0">
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
