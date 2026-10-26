import React from "react";
import { api, getUser } from "../services/auth";

// Trang admin: xem danh sách user, phân quyền user/admin, xoá tài khoản
class AdminUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { users: [], error: "" };
    this.me = getUser();
  }

  componentDidMount() {
    this.load();
  }

  load = async () => {
    try {
      const { users } = await api("/users");
      this.setState({ users, error: "" });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  changeRole = async (id, role) => {
    try {
      await api(`/users/${id}/role`, "PUT", { role });
      this.load();
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  remove = async (u) => {
    if (!window.confirm(`Xoá tài khoản ${u.email}?`)) return;
    try {
      await api(`/users/${u._id}`, "DELETE");
      this.load();
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  render() {
    const { users, error } = this.state;
    return (
      <div className="container my-4">
        <h5 className="mb-3"><i className="bi bi-shield-check text-success"></i> Quản lý tài khoản & phân quyền</h5>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-success">
                <tr>
                  <th>Họ tên</th><th>Email</th><th>SĐT</th><th>Ngày tạo</th><th>Quyền</th><th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isMe = this.me && u._id === this.me._id;
                  return (
                    <tr key={u._id}>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ width: 130 }}>
                        <select className="form-select form-select-sm" value={u.role} disabled={isMe}
                          onChange={(e) => this.changeRole(u._id, e.target.value)}>
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger" disabled={isMe} onClick={() => this.remove(u)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminUsers;
