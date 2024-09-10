import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderNavItem from "./HeaderNavItem";
import { Modal, Button } from "react-bootstrap";
import { UserContext } from "../UserContext";

function Header() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { setAuth, setUserId } = useContext(UserContext);

  // 接收 setAuth 為 prop
  const navigate = useNavigate();

  const handleLogout = () => {
    // 清除 localStorage
    /* localStorage.removeItem("userid");
    localStorage.removeItem("passwd");
    localStorage.removeItem("remember"); */

    // 設置認證狀態為 false
    setUserId("");
    setAuth(false);

    // 導回登入頁面
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="/" className="nav-link">
              首頁
            </Link>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          {/* Navbar Search */}
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="navbar-search"
              href="#"
              role="button"
            >
              <i className="fas fa-search" />
            </a>
            <div className="navbar-search-block">
              <form className="form-inline">
                <div className="input-group input-group-sm">
                  <input
                    className="form-control form-control-navbar"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-navbar" type="submit">
                      <i className="fas fa-search" />
                    </button>
                    <button
                      className="btn btn-navbar"
                      type="button"
                      data-widget="navbar-search"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>
          {/* Messages Dropdown Menu */}
          <HeaderNavItem />
          {/* Notifications Dropdown Menu */}
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-bell" />
              <span className="badge badge-warning navbar-badge">15</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">
                15 Notifications
              </span>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <i className="fas fa-envelope mr-2" /> 4 new messages
                <span className="float-right text-muted text-sm">3 mins</span>
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <i className="fas fa-users mr-2" /> 8 friend requests
                <span className="float-right text-muted text-sm">12 hours</span>
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                <i className="fas fa-file mr-2" /> 3 new reports
                <span className="float-right text-muted text-sm">2 days</span>
              </a>
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item dropdown-footer">
                See All Notifications
              </a>
            </div>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="fullscreen"
              href="#"
              role="button"
            >
              <i className="fas fa-expand-arrows-alt" />
            </a>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => setShowLogoutModal(true)}
              style={{ cursor: "pointer" }}
            >
              <i className="fas fa-sign-out-alt" />
              <span className="d-none d-sm-inline"> 登出</span>
            </button>
          </li>
        </ul>
      </nav>
      {/* /.navbar */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>確認訊息</Modal.Title>
        </Modal.Header>
        <Modal.Body>確定要登出嗎？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            登出
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Header;
