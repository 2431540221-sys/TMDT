import React from "react";
import { api, updateStoredUser } from "../services/auth";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      fullName: "", phone: "", address: "",
      oldPassword: "", newPassword: "",
      msg: "", error: "", pwMsg: "", pwError: "",
    };
  }

  async componentDidMount() {
    try {
      const { user } = await api("/profile");
      this.setState({ user, fullName: user.fullName, phone: user.phone, address: user.address });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value, msg: "", error: "", pwMsg: "", pwError: "" });

  onSave = async (e) => {
    e.preventDefault();
    const { fullName, phone, address } = this.state;
    try {
      const { user } = await api("/profile", "PUT", { fullName, phone, address });
      updateStoredUser(user);
      this.setState({ user, msg: "Đã lưu hồ sơ", error: "" });
    } catch (err) {
      this.setState({ error: err.message, msg: "" });
    }
  };

  onChangePassword = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword } = this.state;
    try {
      await api("/change-password", "PUT", { oldPassword, newPassword });
      this.setState({ pwMsg: "Đổi mật khẩu thành công", pwError: "", oldPassword: "", newPassword: "" });
    } catch (err) {
      this.setState({ pwError: err.message, pwMsg: "" });
    }
  };

  render() {
    const { user, fullName, phone, address, oldPassword, newPassword, msg, error, pwMsg, pwError } = this.state;
    if (!user) return <div className="container my-5">{error || "Đang tải..."}</div>;

    return (
      <div className="container my-4">
        <div className="row g-4">
          <div className="col-md-7">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="mb-3"><i className="bi bi-person-circle text-success"></i> Hồ sơ cá nhân</h5>
                {msg && <div className="alert alert-success py-2">{msg}</div>}
                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form onSubmit={this.onSave}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" value={user.email} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Vai trò</label>
                    <div>
                      <span className={`badge ${user.role === "admin" ? "bg-warning text-dark" : "bg-success"}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Họ và tên</label>
                    <input name="fullName" className="form-control" required value={fullName} onChange={this.onChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input name="phone" className="form-control" value={phone} onChange={this.onChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Địa chỉ</label>
                    <textarea name="address" rows="2" className="form-control" value={address} onChange={this.onChange} />
                  </div>
                  <button className="btn btn-success">Lưu thay đổi</button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="mb-3"><i className="bi bi-key text-success"></i> Đổi mật khẩu</h5>
                {pwMsg && <div className="alert alert-success py-2">{pwMsg}</div>}
                {pwError && <div className="alert alert-danger py-2">{pwError}</div>}
                <form onSubmit={this.onChangePassword}>
                  <div className="mb-3">
                    <label className="form-label">Mật khẩu cũ</label>
                    <input type="password" name="oldPassword" className="form-control" required
                      value={oldPassword} onChange={this.onChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mật khẩu mới</label>
                    <input type="password" name="newPassword" className="form-control" required minLength={6}
                      value={newPassword} onChange={this.onChange} />
                  </div>
                  <button className="btn btn-outline-success">Đổi mật khẩu</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
