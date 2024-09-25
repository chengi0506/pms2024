import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SYSTEM_NAME, HOST_URL, LOGIN } from "../config";
import Footer from "./Footer";
import Swal from "sweetalert2";
import { UserContext } from "../UserContext";

const Login = () => {
  const [UserId, setUserid] = useState("");
  const [Password, setPasswd] = useState("");
  const [remember, setRemember] = useState(false);
  const { setAuthInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userid");
    const storedPasswd = localStorage.getItem("passwd");
    const storedRemember = localStorage.getItem("remember");

    if (storedUserId) {
      setUserid(storedUserId);
    }

    if (storedPasswd) {
      setPasswd(storedPasswd);
    }

    if (storedRemember === true) {
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(HOST_URL + LOGIN, {
        userId: UserId,
        password: Password,
      });

      if (response.status === 200) {
        // 更新 localStorage
        const authInfo = { userId: UserId, auth: true };

        if (remember) {
          localStorage.setItem("remember", remember);
          localStorage.setItem("userid", UserId);
          localStorage.setItem("passwd", Password);
        } else {
          localStorage.removeItem("remember");
          localStorage.removeItem("userid");
          localStorage.removeItem("passwd");
        }

        // 將 authInfo 存入 localStorage
        localStorage.setItem("authInfo", JSON.stringify(authInfo));

        // 更新 context 中的 authInfo
        setAuthInfo(authInfo);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `登入成功`,
          showConfirmButton: false,
          timer: 1500,
        });

        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.response.data,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="card card-outline card-primary">
          <div style={{ textAlign: "center" }}>
            <img
              src="/assets/fast.png"
              alt="Logo"
              className="brand-image img-fa-square"
              style={{ opacity: ".8" }}
              width="25%"
              height="25%"
            />
          </div>
          <div className="card-header text-center">
            <h3>{SYSTEM_NAME}</h3>
          </div>
          <div className="card-body login-card-body">
            <form onSubmit={handleLogin}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="帳號"
                  value={UserId}
                  onChange={(e) => setUserid(e.target.value)}
                  autoComplete="username"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="密碼"
                  value={Password}
                  onChange={(e) => setPasswd(e.target.value)}
                  autoComplete="current-password"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input
                      type="checkbox"
                      id="remember"
                      onChange={(e) => setRemember(e.target.checked)}
                      {...remember}
                    />
                    <label htmlFor="remember">記住帳號及密碼</label>
                  </div>
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    登入
                  </button>
                </div>
              </div>
            </form>

            <div className="row" style={{ marginTop: "25px" }}>
              <div className="col-12">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
