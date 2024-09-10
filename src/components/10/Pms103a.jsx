import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  HOST_URL,
  GET_GPASS_GROUP_ID,
  ADDCUSER,
  GETCUSER,
  UPDATE_CUSER_INFO,
  DELETE_CUSER,
} from "../../config";

const Pms103a = () => {
  const [proList, setProList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCuser, setNewCuser] = useState({
    UserId: "",
    Username: "",
    Password: "",
    GroupId: "",
    ProgramName: "",
    ProgramTime: "",
    IPAddress: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editItem, setEditItem] = useState({});
  //提交狀態
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(HOST_URL + GETCUSER);
        setProList(response.data);
        setFilteredList(response.data);
      } catch (error) {
        setError("載入資料異常");
        console.error("載入資料異常:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await axios.post(HOST_URL + GET_GPASS_GROUP_ID);
        setGroups(response.data);
      } catch (error) {
        console.error("There was an error fetching the groupId!", error);
      }
    };

    fetchData();
    fetchGroups();
  }, []);

  //群組查詢
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = proList.filter((pro) =>
      pro.使用者名稱.toLowerCase().includes(query)
    );

    setFilteredList(filtered);
    setCurrentPage(0);
  };

  const handleSelectGroupChange = (event) => {
    const groupId = event.target.value;
    setSelectedGroupId(groupId);

    const filtered = proList.filter(
      (pro) =>
        pro.使用者名稱.toLowerCase().includes(searchQuery) &&
        (groupId === "" || pro.群組代號 === groupId)
    );

    setFilteredList(filtered);
    setCurrentPage(0);
  };

  //分頁
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredList.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  //新增群組
  const handleAddGroup = async () => {
    setErrorMessage("");

    if (
      !newCuser.UserId ||
      !newCuser.Username ||
      !newCuser.Password ||
      !newCuser.GroupId
    ) {
      setErrorMessage("欄位必須填寫");
      return;
    }

    const formattedData = {
      使用者代號: newCuser.UserId,
      使用者名稱: newCuser.Username,
      使用者密碼: newCuser.Password,
      群組代號: newCuser.GroupId,
      程式名稱: newCuser.ProgramName,
      程式時間: newCuser.ProgramTime
        ? Date.now().toString("yyyy-MM-dd HH:ss")
        : null,
      ip: newCuser.IPAddress,
    };

    try {
      await axios.post(HOST_URL + ADDCUSER, formattedData).then((response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `使用者: ${newCuser.UserId} 建立成功`,
          showConfirmButton: false,
          timer: 1500,
        });
        setShowAddModal(false);
        setNewCuser({
          GroupId: "",
          UserId: "",
          Username: "",
          Password: "",
          ProgramName: "",
          ProgramTime: "",
          IPAddress: "",
        });
      });

      const response = await axios.post(HOST_URL + GETCUSER);
      setProList(response.data);
      setFilteredList(response.data);
    } catch (error) {
      console.error("建立使用者時發生錯誤:", error);
      setErrorMessage(
        error.response?.data || "建立使用者時發生未知錯誤，請稍後再試。"
      );
    }
  };

  //修改群組代號
  const handleGroupChange = async (
    userId,
    userName,
    userPassword,
    programName,
    programTime,
    newGroupId
  ) => {
    try {
      await axios.put(HOST_URL + UPDATE_CUSER_INFO, {
        使用者代號: userId,
        使用者名稱: userName,
        使用者密碼: userPassword,
        群組代號: newGroupId,
        程式名稱: programName,
        程式時間: programTime,
      });
      const updatedList = proList.map((pro) =>
        pro.使用者代號 === userId ? { ...pro, 群組代號: newGroupId } : pro
      );
      setProList(updatedList);
      setFilteredList(updatedList);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${userName}變更群組「${newGroupId}」成功`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("更新群組代號時發生錯誤:", error);
    }
  };

  //保存修改狀態
  const handleEdit = (index) => {
    setCurrentItem(filteredList[index]);
    setEditItem(filteredList[index]);
    setShowEditModal(true);
  };

  //保存刪除狀態
  const handleDelete = (index) => {
    setCurrentItem(filteredList[index]);
    setShowDeleteModal(true);
  };

  //確定修改
  const handleEditSubmit = async () => {
    try {
      // 鎖定按鈕，防止重複提交
      setIsSubmitting(true);

      await axios.put(HOST_URL + UPDATE_CUSER_INFO, editItem);
      const updatedList = proList.map((item) =>
        item === currentItem ? editItem : item
      );
      setProList(updatedList);
      setFilteredList(updatedList);
      setShowEditModal(false);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `修改成功`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      setError("修改失敗:" + error.message);
      console.error(
        "Error updating data:",
        error.response ? error.response.data : error.message
      );
    } finally {
      // 解除鎖定
      setIsSubmitting(false);
    }
  };

  //確定刪除
  const handleDeleteConfirm = async () => {
    try {
      // 鎖定按鈕，防止重複提交
      setIsSubmitting(true);
      const { 使用者代號 } = currentItem;
      await axios.delete(`${HOST_URL + DELETE_CUSER}/${使用者代號}`);
      const updatedList = proList.filter((item) => item !== currentItem);
      setProList(updatedList);
      setFilteredList(updatedList);
      setShowDeleteModal(false);
    } catch (error) {
      setError("Error deleting data");
      console.error("Error deleting data:", error);
    } finally {
      // 解除鎖定
      setIsSubmitting(false);
    }
  };

  //隱藏密碼***
  const hidePassword = (password) => {
    return password ? "***" : "";
  };

  return (
    <div className="container">
      {loading && <p>載入資料中...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <>
          <div className="card">
            <div className="card-header border-0">
              <div className="row">
                <div className="col-md-4">
                  <h3 className="card-title">
                    <i className="fa fa-bookmark"></i>
                    <em>1003使用者維護</em>
                  </h3>
                </div>
                <div className="col-md-8">
                  <div className="card-tools">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-4">
                            <button
                              type="submit"
                              className="btn btn-block btn-outline-info"
                              onClick={() => {
                                setNewCuser({
                                  ...newCuser,
                                  GroupId: groups[0] || "",
                                });
                                setShowAddModal(true);
                              }}
                            >
                              建立使用者
                            </button>
                          </div>
                          <div className="col-md-8">
                            <select
                              className="form-control form-control-border"
                              id="groupid"
                              name="groupid"
                              value={selectedGroupId}
                              onChange={handleSelectGroupChange}
                            >
                              <option value="">全部群組</option>
                              {groups.map((group) => (
                                <option key={group} value={group}>
                                  {group}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            placeholder="請輸入使用者名稱"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="form-control"
                          />
                          <div className="input-group-append">
                            <div className="input-group-text">
                              <span className="fas fa-search"></span>
                            </div>
                          </div>
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
                </div>
              </div>
            </div>
            <div className="card-body table-responsive p-0">
              <table className="table table-striped table-valign-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>項目</th>
                    <th>使用者代號</th>
                    <th>使用者名稱</th>
                    <th>使用者密碼</th>
                    <th>程式名稱</th>
                    <th>程式時間</th>
                    <th>ip</th>
                    <th>群組代號</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((pro, index) => (
                    <tr key={pro.使用者代號}>
                      <td>
                        <button
                          className="btn btn-sm btn-primary mr-2"
                          onClick={() => handleEdit(index)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(index)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                      <td>{offset + index + 1}</td>
                      <td>{pro.使用者代號}</td>
                      <td>{pro.使用者名稱}</td>
                      <td>{hidePassword(pro.使用者密碼)}</td>
                      <td>{pro.程式名稱}</td>
                      <td>
                        {new Date(pro.程式時間)
                          .toISOString()
                          .slice(0, 16)
                          .replace("T", " ")}
                      </td>
                      <td>{pro.ip}</td>
                      <td>
                        <select
                          className="form-control"
                          value={pro.群組代號}
                          onChange={(e) =>
                            handleGroupChange(
                              pro.使用者代號,
                              pro.使用者名稱,
                              pro.使用者密碼,
                              pro.程式名稱,
                              pro.程式時間,
                              e.target.value
                            )
                          }
                        >
                          {groups.map((group) => (
                            <option key={group} value={group}>
                              {group}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer">
              <ReactPaginate
                previousLabel={"上一頁"}
                nextLabel={"下一頁"}
                breakLabel={"..."}
                pageCount={Math.ceil(filteredList.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            </div>
          </div>
          <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>建立使用者</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formGroupId">
                  <Form.Label>使用者代號</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="輸入使用者代號"
                    value={newCuser.UserId}
                    onChange={(e) => {
                      const value = e.target.value;

                      // 檢查是否為英數字
                      if (/^[A-Za-z0-9]{0,9}$/.test(value)) {
                        setNewCuser({ ...newCuser, UserId: value });
                      }
                    }}
                  />
                  <Form.Label>使用者名稱</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="輸入使用者名稱"
                    value={newCuser.Username}
                    onChange={(e) =>
                      setNewCuser({ ...newCuser, Username: e.target.value })
                    }
                  />
                  <Form.Label>使用者密碼</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="輸入使用者密碼"
                    value={newCuser.Password}
                    onChange={(e) =>
                      setNewCuser({ ...newCuser, Password: e.target.value })
                    }
                  />
                  <Form.Label>群組代號</Form.Label>
                  <Form.Select
                    className="form-control form-control-border"
                    value={newCuser.GroupId}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.info(value);
                      setNewCuser({ ...newCuser, GroupId: value });
                    }}
                  >
                    {groups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </Form.Select>
                  {errorMessage && (
                    <Form.Label className="text-danger">
                      {errorMessage}
                    </Form.Label>
                  )}
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                取消
              </Button>
              <Button variant="info" onClick={handleAddGroup}>
                建立
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>編輯</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="form-group">
                  <label>使用者代號：</label>
                  <label>{editItem.使用者代號}</label>
                </div>
                <div className="form-group">
                  <label>使用者名稱：</label>
                  <label>{editItem.使用者名稱}</label>
                </div>
                <div className="form-group">
                  <label>使用者密碼：</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editItem.使用者密碼}
                    onChange={(e) =>
                      setEditItem({ ...editItem, 使用者密碼: e.target.value })
                    }
                  />
                  <input
                    type="hidden"
                    value={editItem.群組代號}
                    onChange={(e) =>
                      setEditItem({ ...editItem, 群組代號: e.target.value })
                    }
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={handleEditSubmit}
                disabled={isSubmitting}
              >
                <i className="fas fa-pencil-alt mr-1"></i>
                {isSubmitting ? "資料處理中..." : "儲存"}
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>確認刪除</Modal.Title>
            </Modal.Header>
            <Modal.Body>確定要刪除該筆資料嗎？</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                取消
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
              >
                <i className="fas fa-pencil-alt mr-1"></i>
                {isSubmitting ? "資料處理中..." : "删除"}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Pms103a;
