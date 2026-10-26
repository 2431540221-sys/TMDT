import React from "react";
import { Link } from "react-router-dom";
import { api, saveSession } from "../services/auth";
import CloverLogo from "../components/CloverLogo";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", error: "", loading: false };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value, error: "" });

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: "" });
    try {
      const { token, user } = await api("/login", "POST", {
        email: this.state.email,
        password: this.state.password,
      });
      saveSession(token, user);
      window.location.href = user.role === "admin" ? "/admin/users" : "/";
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  render() {
    const { email, password, error, loading } = this.state;
    return (
      <div className="container my-5" style={{ maxWidth: 440 }}>
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="text-center mb-3">
              <span className="d-inline-flex p-2 rounded-circle" style={{ background: "#2e7d32" }}>
                <CloverLogo size={40} />
              </span>
              <h4 className="mt-2 mb-0">Đăng nhập</h4>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={this.onSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" required
                  value={email} onChange={this.onChange} autoFocus />
              </div>
              <div className="mb-3">
                <label className="form-label">Mật khẩu</label>
                <input type="password" name="password" className="form-control" required
                  value={password} onChange={this.onChange} />
              </div>
              <button className="btn btn-success w-100" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <p className="text-center text-muted mt-3 mb-0">
              Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
