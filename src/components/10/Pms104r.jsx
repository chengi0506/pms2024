import React, { useContext, useState } from "react";
import { UserContext } from "../../UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import { HOST_URL, UPDATE_PASSWORD } from "../../config";

const Pms104r = () => {
  const { userId } = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "新密碼和確認密碼不一致",
        showConfirmButton: true,
      });
      return;
    }

    try {
      const response = await axios.post(HOST_URL + UPDATE_PASSWORD, {
        userId,
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "密碼已成功變更",
          showConfirmButton: true,
        });

        // 清空欄位
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "密碼變更失敗",
        text: error.response?.data || "未知錯誤",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header border-0">
          <div className="row">
            <div className="col-md-11">
              {" "}
              <h3 className="card-title">
                <i className="fa fa-bookmark"></i>
                <em>1004密碼變更</em>
              </h3>
            </div>
            <div className="col-md-1">
              <div className="card-tools">
                <button
                  type="button"
                  className="btn btn-tool"
                  data-card-widget="collapse"
                >
                  <i className="fas fa-minus"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-tool"
                  data-card-widget="remove"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="login-box">
            <div className="card card-outline card-info">
              <div className="card-body">
                <p className="login-box-msg">請輸入舊密碼及新密碼</p>
                <form onSubmit={handleChangePassword}>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      name="username"
                      autoComplete="username"
                      style={{ display: "none" }}
                    />
                    <input
                      type="password"
                      className="form-control"
                      placeholder="輸入舊密碼"
                      autoComplete="current-password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      autoComplete="new-password"
                      placeholder="輸入新密碼"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock" />
                      </div>
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      autoComplete="new-password"
                      placeholder="重複輸入新密碼"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-block btn-outline-info"
                      >
                        確定變更
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* /.login-card-body */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pms104r;
