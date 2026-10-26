import React from "react";
import { Link, NavLink } from "react-router-dom";
import CloverLogo from "./CloverLogo";
import { getUser, clearSession, onAuthChange, api } from "../services/auth";
import "./Header.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: getUser() };
  }

  componentDidMount() {
    this.unsubscribe = onAuthChange(() => this.setState({ user: getUser() }));
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  onLogout = async () => {
    try {
      await api("/logout", "POST");
    } catch (e) {
      // token hết hạn cũng vẫn đăng xuất phía client
    }
    clearSession();
    window.location.href = "/login";
  };

  render() {
    const { user } = this.state;
    return (
      <header className="tmdt-header shadow-sm">
        <div className="container d-flex align-items-center justify-content-between py-2">
          <Link to="/" className="tmdt-brand text-decoration-none d-flex align-items-center gap-2">
            <CloverLogo size={38} />
            <span className="tmdt-brand-text">Cỏ 4 Lá<small>Shop</small></span>
          </Link>

          <nav className="d-flex align-items-center gap-3">
            <NavLink to="/" end className="tmdt-link">Trang chủ</NavLink>
            {user && user.role === "admin" && (
              <NavLink to="/admin/users" className="tmdt-link">
                <i className="bi bi-shield-check"></i> Quản trị
              </NavLink>
            )}

            {!user ? (
              <>
                <NavLink to="/login" className="tmdt-link">Đăng nhập</NavLink>
                <Link to="/register" className="btn btn-light btn-sm fw-semibold tmdt-btn-register">
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button className="btn btn-sm tmdt-user dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle"></i> {user.fullName}
                  {user.role === "admin" && <span className="badge bg-warning text-dark ms-1">admin</span>}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person"></i> Hồ sơ cá nhân
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={this.onLogout}>
                      <i className="bi bi-box-arrow-right"></i> Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;
