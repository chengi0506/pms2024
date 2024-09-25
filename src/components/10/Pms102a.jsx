import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  HOST_URL,
  GET_GPASS,
  GET_GPASS_GROUP_ID,
  UPDATE_PERMISSION_LEVEL,
  CREATEGROUP,
} from "../../config";

const Pms102a = () => {
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
  const [newGroup, setNewGroup] = useState({ groupId: "" });
  const [errorMessage, setErrorMessage] = useState("");
  //提交狀態
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(HOST_URL + GET_GPASS);
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

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = proList.filter(
      (pro) =>
        pro.程式代號.toLowerCase().includes(query) &&
        (selectedGroupId === "" || pro.群組代號 === selectedGroupId)
    );

    setFilteredList(filtered);
    setCurrentPage(0);
  };

  const handleSelectGroupChange = (event) => {
    const groupId = event.target.value;
    setSelectedGroupId(groupId);

    const filtered = proList.filter(
      (pro) =>
        pro.程式代號.toLowerCase().includes(searchQuery) &&
        (groupId === "" || pro.群組代號 === groupId)
    );

    setFilteredList(filtered);
    setCurrentPage(0);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredList.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const permissionLevelMap = {
    1: "讀取",
    2: "新增及修改",
    3: "刪除",
  };

  const handleSelectChange = async (index, event) => {
    const updatedList = [...filteredList];
    const updatedPermissionLevel = event.target.value;
    const ListIndex = offset + index;
    updatedList[ListIndex].權限等級 = updatedPermissionLevel;
    const permissionDescription =
      permissionLevelMap[updatedPermissionLevel] || "未知";

    setFilteredList(updatedList);

    console.log(
      updatedList[ListIndex].群組代號 +
        updatedList[ListIndex].程式代號 +
        updatedList[ListIndex].權限等級
    );

    try {
      await axios.post(HOST_URL + UPDATE_PERMISSION_LEVEL, {
        群組代號: updatedList[ListIndex].群組代號,
        程式代號: updatedList[ListIndex].程式代號,
        權限等級: updatedPermissionLevel,
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${updatedList[index].群組代號}變更權限等級「${permissionDescription}」成功`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("更新權限等級時發生錯誤:", error);
    }
  };

  const handleAddGroup = async () => {
    // 清空錯誤訊息
    setErrorMessage("");

    // 檢查 groupId 是否為 "空值" 或 "兩位英數字"
    if (!newGroup.groupId || !/^[A-Za-z0-9]{2}$/.test(newGroup.groupId)) {
      setErrorMessage("群組代號必填且需為兩位英數字");
      return;
    }

    try {
      console.info("newGroup:" + newGroup.groupId);
      // 鎖定按鈕，防止重複提交
      setIsSubmitting(true);
      await axios.post(HOST_URL + CREATEGROUP, null, {
        params: {
          _groupid: newGroup.groupId,
        },
      });

      // 成功訊息
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "群組" + newGroup.groupId + "建立成功",
        showConfirmButton: false,
        timer: 1500,
      });

      setShowAddModal(false);
      setNewGroup({ groupId: "" });

      // 更新群組和程式清單
      const groupResponse = await axios.post(HOST_URL + GET_GPASS_GROUP_ID);
      setGroups(groupResponse.data);

      const proListResponse = await axios.post(HOST_URL + GET_GPASS);
      setProList(proListResponse.data);
      setFilteredList(proListResponse.data);
    } catch (error) {
      console.error("建立群組時發生錯誤:", error);

      // 設定錯誤訊息，並顯示在 Modal 中
      if (error.response && error.response.data) {
        setErrorMessage(`建立群組失敗：${error.response.data}`);
      } else {
        setErrorMessage("建立群組時發生未知錯誤，請稍後再試。");
      }
    } finally {
      // 解除鎖定
      setIsSubmitting(false);
    }
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
                    <em>1002程式清單</em>
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
                              onClick={() => setShowAddModal(true)}
                            >
                              建立群組
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
                            placeholder="請輸入程式代號"
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
                    <th>項目</th>
                    <th>群組代號</th>
                    <th>程式代號</th>
                    <th>權限等級</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((pro, index) => (
                    <tr key={pro.程式代號}>
                      <td>{offset + index + 1}</td>
                      <td>{pro.群組代號}</td>
                      <td>{pro.程式代號}</td>
                      <td>
                        <select
                          className="form-control form-control-border"
                          value={pro.權限等級}
                          onChange={(event) => handleSelectChange(index, event)}
                        >
                          <option value="1">{permissionLevelMap[1]}</option>
                          <option value="2">{permissionLevelMap[2]}</option>
                          <option value="3">{permissionLevelMap[3]}</option>
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
              <Modal.Title>建立群組</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formGroupId">
                  <Form.Label>群組代號</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="輸入群組代號"
                    value={newGroup.groupId}
                    onChange={(e) => {
                      const value = e.target.value;

                      // 檢查是否為英數字，並且長度不超過兩個字元
                      if (/^[A-Za-z0-9]{0,2}$/.test(value)) {
                        setNewGroup({ ...newGroup, groupId: value });
                      }
                    }}
                  />
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
              <Button
                variant="info"
                onClick={handleAddGroup}
                disabled={isSubmitting}
              >
                <i className="fas fa-pencil-alt mr-1"></i>
                {isSubmitting ? "資料處理中..." : "建立"}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Pms102a;
