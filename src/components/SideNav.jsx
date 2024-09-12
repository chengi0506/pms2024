import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SYSTEM_NAME } from "../config";
import axios from "axios";
import { HOST_URL, GET_GPASS_BY_ID } from "../config";

const SidebarHeader = () => (
  <a href="/" className="brand-link">
    <span className="brand-text font-weight-light">{SYSTEM_NAME}</span>
  </a>
);

const SidebarSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/Pms201a?query=${searchTerm}`);
    } else {
      navigate(`/Pms201a`);
    }
  };

  return (
    <div className="form-inline">
      <div className="input-group">
        <input
          id="tbSearch"
          className="form-control form-control-sidebar"
          placeholder="請輸入財產編號"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-sidebar" onClick={handleSearch}>
            <i className="fas fa-search fa-fw" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NavLinkItem = ({ to, icon, label }) => (
  <NavLink to={to} className="nav-link">
    <i className={icon} />
    <p>{label}</p>
  </NavLink>
);

const NavGroup = ({ icon, label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleGroup = () => setIsOpen((prev) => !prev);

  return (
    <li className={`nav-item ${isOpen ? "menu-open" : ""}`}>
      <a href="#" className="nav-link" onClick={toggleGroup}>
        <i className={`nav-icon ${icon}`} />
        <p>
          {label}
          <i className="fas fa-angle-left right" />
        </p>
      </a>
      {isOpen && <ul className="nav nav-treeview">{children}</ul>}
    </li>
  );
};

const SidebarMenu = ({ permissions }) => (
  <nav className="mt-2">
    <ul
      className="nav nav-pills nav-sidebar flex-column"
      data-widget="treeview"
      role="menu"
      data-accordion="false"
    >
      <li className="nav-header">系統選單</li>
      <NavGroup icon="nav-icon fas fa-circle" label="10系統維護">
        {permissions["pms101a"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms101a"
              icon="far fa-circle nav-icon"
              label="1001基本資料維護"
            />
          </li>
        )}
        {permissions["pms102a"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms102a"
              icon="far fa-circle nav-icon"
              label="1002群組維護"
            />
          </li>
        )}
        {permissions["pms103a"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms103a"
              icon="far fa-circle nav-icon"
              label="1003使用者維護"
            />
          </li>
        )}
        {permissions["pms104r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms104r"
              icon="far fa-circle nav-icon"
              label="1004密碼變更"
            />
          </li>
        )}
        {permissions["pms105a"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms105a"
              icon="far fa-circle nav-icon"
              label="1005代碼維護"
            />
          </li>
        )}
      </NavGroup>
      <NavGroup icon="nav-icon fas fa-circle" label="20資料維護">
        {permissions["pms201a"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms201a"
              icon="far fa-circle nav-icon"
              label="2001財產資料維護"
            />
          </li>
        )}
        {permissions["pms202r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms202r"
              icon="far fa-circle nav-icon"
              label="2002折舊計算作業"
            />
          </li>
        )}
        {permissions["pms203a"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms203a"
              icon="far fa-circle nav-icon"
              label="2003折舊資料維護"
            />
          </li>
        )}
        {permissions["pms205a"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms205a"
              icon="far fa-circle nav-icon"
              label="2005財產攜出作業"
            />
          </li>
        )}
        {permissions["pms206a"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms206a"
              icon="far fa-circle nav-icon"
              label="2006廠商提供作業"
            />
          </li>
        )}
        {permissions["pms207r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms207r"
              icon="far fa-circle nav-icon"
              label="2007使用及保管人更換作業"
            />
          </li>
        )}
      </NavGroup>
      <NavGroup icon="nav-icon fas fa-circle" label="30報表列印">
        {permissions["pms301r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms3001"
              icon="far fa-circle nav-icon"
              label="3001外置清冊"
            />
          </li>
        )}
        {permissions["pms302r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms302r"
              icon="far fa-circle nav-icon"
              label="3002財產清冊"
            />
          </li>
        )}
        {permissions["pms303r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms303r"
              icon="far fa-circle nav-icon"
              label="3003盤點表"
            />
          </li>
        )}
        {permissions["pms304r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms304r"
              icon="far fa-circle nav-icon"
              label="3004財產標籤"
            />
          </li>
        )}
        {permissions["pms305r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms305r"
              icon="far fa-circle nav-icon"
              label="3005領用及保管人清冊"
            />
          </li>
        )}
        {permissions["pms306r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms306r"
              icon="far fa-circle nav-icon"
              label="3006固定資產增減表"
            />
          </li>
        )}
        {permissions["pms307r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms307r"
              icon="far fa-circle nav-icon"
              label="3007固定資產折舊提列表"
            />
          </li>
        )}
        {permissions["pms308r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms308r"
              icon="far fa-circle nav-icon"
              label="3008固定資產明細表"
            />
          </li>
        )}
        {permissions["pms309r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms309r"
              icon="far fa-circle nav-icon"
              label="3009廠商提供清冊"
            />
          </li>
        )}
        {permissions["pms310r"] === 1 && (
          <li className="nav-item">
            <NavLinkItem
              to="/Pms310r"
              icon="far fa-circle nav-icon"
              label="3010財產攜出清冊"
            />
          </li>
        )}
      </NavGroup>
      <NavGroup icon="nav-icon fas fa-circle" label="40資料庫維護">
        <li className="nav-item">
          <NavLinkItem
            to="/4001.html"
            icon="far fa-circle nav-icon"
            label="4001資料庫備份"
          />
        </li>
        <li className="nav-item">
          <NavLinkItem
            to="/4002.html"
            icon="far fa-circle nav-icon"
            label="4002資料庫更新"
          />
        </li>
      </NavGroup>
    </ul>
  </nav>
);

const SideNav = () => {
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.post(HOST_URL + GET_GPASS_BY_ID, {
          GroupId: "01",
        });
        const permissions = {};
        response.data.forEach((item) => {
          permissions[item.程式代號] = parseInt(item.權限等級, 10);
        });
        setPermissions(permissions);
      } catch (error) {
        console.error("Failed to fetch permissions", error);
      }
    };
    fetchPermissions();
  }, []);

  if (!permissions) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <SidebarHeader />
      <div className="sidebar">
        <SidebarSearch />
        <SidebarMenu permissions={permissions} />
      </div>
    </aside>
  );
};

export default SideNav;
