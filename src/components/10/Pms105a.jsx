import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  HOST_URL,
  GET_CODE,
  UPDATE_CODE,
  ADDCODE,
  GET_NEXT_CODEID,
  Toast,
} from "../../config";

function Pms105a() {
  //Tab 資料
  const [cityData, setCityData] = useState([]);
  const [townData, setTownData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [ChildData, setChildData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [activeTab, setActiveTab] = useState("01");
  //分頁
  const [currentPage, setCurrentPage] = useState(0); //當前頁數
  const itemsPerPage = 10; //分頁筆數
  // 搜尋狀態
  const [categoryFilter, setCategoryFilter] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [codeOptions, setCodeOptions] = useState([]);

  // 暫存輸入框內容
  const [tempContent, setTempContent] = useState({});
  //新增代碼Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState({
    類別: "",
    代號: "",
    名稱: "",
    內容: "",
  });
  //異常訊息
  const [errorMessage, setErrorMessage] = useState("");
  //提交狀態
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCodeData = (category, setData) => {
    axios
      .get(`${HOST_URL + GET_CODE}`, { params: { category } })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(`取得類別異常 ${category}:`, error);
      });
  };

  const fetchCodeOptions = (category) => {
    axios
      .get(`${HOST_URL + GET_CODE}`, { params: { category } })
      .then((response) => {
        setCodeOptions(response.data);
      })
      .catch((error) => {
        console.error(`取得代號異常 ${category}:`, error);
      });
  };

  useEffect(() => {
    switch (activeTab) {
      case "01":
        fetchCodeData("01", setCityData);
        break;
      case "02":
        fetchCodeData("02", setTownData);
        break;
      case "03":
        fetchCodeData("06", setEmployeeData);
        break;
      case "04":
        fetchCodeData("07", setDepartmentData);
        break;
      case "05":
        fetchCodeData("08", setChildData);
        break;
      case "06":
        fetchCodeData("09", setUnitData);
        break;
      default:
        break;
    }
    setCurrentPage(0);
  }, [activeTab]);

  useEffect(() => {
    switch (categoryFilter) {
      case "01":
        setActiveTab("01");
        break;
      case "02":
        setActiveTab("02");
        break;
      case "06":
        setActiveTab("03");
        break;
      case "07":
        setActiveTab("04");
        break;
      case "08":
        setActiveTab("05");
        break;
      case "09":
        setActiveTab("06");
        break;
      default:
        setActiveTab("01");
        break;
    }
    if (categoryFilter) {
      fetchCodeOptions(categoryFilter);
    }
  }, [categoryFilter]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filterData = (data) => {
    return data.filter((item) => {
      const matchesCategory = categoryFilter
        ? item.類別.includes(categoryFilter)
        : true;
      const matchesCode = codeFilter ? item.代號.includes(codeFilter) : true;
      const matchesKeyword = keywordFilter
        ? item.名稱.includes(keywordFilter) || item.內容.includes(keywordFilter)
        : true;
      return matchesCategory && matchesCode && matchesKeyword;
    });
  };

  const updateContent = async (pro, newContent) => {
    try {
      const response = await axios.put(`${HOST_URL + UPDATE_CODE}`, {
        代號: pro.代號,
        類別: pro.類別,
        名稱: pro.名稱,
        內容: newContent,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: `「${pro.類別 + pro.代號}」內容變更成功`,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "內容變更失敗",
        text: error.response?.data || "內容變更失敗",
        showConfirmButton: true,
      });
    }
  };

  const handleContentChange = (index, newContent) => {
    // 失去焦點後更新TempContent
    setTempContent((prev) => ({
      ...prev,
      [`${activeTab}-${index}`]: newContent,
    }));
  };

  //失去焦點後更新資料庫
  const handleBlur = (index) => {
    const contentToUpdate = tempContent[`${activeTab}-${index}`];
    if (contentToUpdate !== undefined) {
      let updatedData;

      switch (activeTab) {
        case "01":
          updatedData = [...cityData];
          updatedData[index].內容 = contentToUpdate;
          setCityData(updatedData);
          break;
        case "02":
          updatedData = [...townData];
          updatedData[index].內容 = contentToUpdate;
          setTownData(updatedData);
          break;
        case "03":
          updatedData = [...employeeData];
          updatedData[index].內容 = contentToUpdate;
          setEmployeeData(updatedData);
          break;
        case "04":
          updatedData = [...departmentData];
          updatedData[index].內容 = contentToUpdate;
          setDepartmentData(updatedData);
          break;
        case "05":
          updatedData = [...ChildData];
          updatedData[index].內容 = contentToUpdate;
          setChildData(updatedData);
          break;
        case "06":
          updatedData = [...unitData];
          updatedData[index].內容 = contentToUpdate;
          setUnitData(updatedData);
          break;
        default:
          return;
      }

      updateContent(updatedData[index], contentToUpdate);
      // 清除暫存內容
      setTempContent((prev) => ({
        ...prev,
        [`${activeTab}-${index}`]: undefined,
      }));
    }
  };

  const handleAddCode = async () => {
    console.info(newCode);
    // 驗證輸入
    if (!newCode.代號 || !/^[A-Za-z0-9]{1,3}$/.test(newCode.代號)) {
      setErrorMessage("代號必須為1-3位英數字");
    } else {
      setErrorMessage(""); // 清除錯誤訊息
    }

    // 鎖定按鈕，防止重複提交
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${HOST_URL + ADDCODE}`, {
        類別: newCode.類別,
        代號: newCode.代號,
        名稱: newCode.名稱,
        內容: newCode.內容,
      });

      console.info(response.status);

      if (response.status === 200) {
        Toast.fire({
          icon: "success",
          title: `「${
            newCode.類別 + newCode.代號 + newCode.名稱
          }」代碼新增成功`,
        });

        setNewCode((prevCode) => ({
          ...prevCode,
          類別: "",
          代號: "",
          名稱: "",
          內容: "",
        }));
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        text: error.response?.data || "代碼新增失敗",
      });
    } finally {
      // 解除鎖定
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewCode({ ...newCode, [name]: value });
  };

  //產生表格
  const renderTable = (data) => {
    const filteredData = filterData(data);
    const offset = currentPage * itemsPerPage;
    const currentData = filteredData.slice(offset, offset + itemsPerPage);

    return (
      <>
        <table className="table table-striped table-valign-middle">
          <thead>
            <tr>
              <th>項目</th>
              <th>類別</th>
              <th>代號</th>
              <th>名稱</th>
              <th>內容</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((pro, index) => (
              <tr key={index}>
                <td>{offset + index + 1}</td>
                <td>{pro.類別}</td>
                <td>{pro.代號}</td>
                <td>{pro.名稱}</td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-border"
                    id={`content-${index}`}
                    name="content"
                    placeholder="內容"
                    value={
                      tempContent[`${activeTab}-${offset + index}`] || pro.內容
                    }
                    onChange={(e) =>
                      handleContentChange(offset + index, e.target.value)
                    } //暫存內容
                    onBlur={() => handleBlur(offset + index)} //失去焦點
                    maxLength={10}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"上一頁"}
          nextLabel={"下一頁"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredData.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </>
    );
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header border-0">
          <div className="row">
            <div className="col-md-4">
              <h3 className="card-title">
                <i className="fa fa-bookmark"></i>
                <em>1005代碼維護</em>
              </h3>
            </div>
            <div className="col-md-8">
              <div className="card-tools">
                <div className="row">
                  <div className="col-md-2">
                    <button
                      type="submit"
                      className="btn btn-block btn-outline-info"
                      onClick={() => setShowAddModal(true)}
                    >
                      新增代碼
                    </button>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-control"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">選擇類別</option>
                      <option value="01">縣市</option>
                      <option value="02">鄉鎮</option>
                      <option value="06">員工</option>
                      <option value="07">部門</option>
                      <option value="08">子目</option>
                      <option value="09">單位</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-control"
                      value={codeFilter}
                      onChange={(e) => setCodeFilter(e.target.value)}
                    >
                      <option value="">選擇代號</option>
                      {codeOptions.map((option) => (
                        <option key={option.代號} value={option.代號}>
                          {option.代號}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="請輸入名稱"
                        value={keywordFilter}
                        onChange={(e) => setKeywordFilter(e.target.value)}
                      />
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
          <div className="card card-info card-outline card-tabs">
            <div className="card-header p-0 pt-1 border-bottom-0">
              <ul
                className="nav nav-tabs"
                id="custom-tabs-three-tab"
                role="tablist"
              >
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "01" ? "active" : ""}`}
                    onClick={() => setActiveTab("01")}
                    href="#tab1"
                    role="tab"
                  >
                    縣市
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "02" ? "active" : ""}`}
                    onClick={() => setActiveTab("02")}
                    href="#tab2"
                    role="tab"
                  >
                    鄉鎮
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "03" ? "active" : ""}`}
                    onClick={() => setActiveTab("03")}
                    href="#tab3"
                    role="tab"
                  >
                    員工
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "04" ? "active" : ""}`}
                    onClick={() => setActiveTab("04")}
                    href="#tab4"
                    role="tab"
                  >
                    部門
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "05" ? "active" : ""}`}
                    onClick={() => setActiveTab("05")}
                    href="#tab5"
                    role="tab"
                  >
                    子目
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === "06" ? "active" : ""}`}
                    onClick={() => setActiveTab("06")}
                    href="#tab6"
                    role="tab"
                  >
                    單位
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content" id="custom-tabs-three-tabContent">
                <div
                  className={`tab-pane fade ${
                    activeTab === "01" ? "active show" : ""
                  }`}
                  role="tabpanel"
                >
                  {renderTable(cityData)}
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "02" ? "active show" : ""
                  }`}
                  role="tabpanel"
                >
                  {renderTable(townData)}
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "03" ? "active show" : ""
                  }`}
                  role="tabpanel"
                >
                  {renderTable(employeeData)}
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "04" ? "active show" : ""
                  }`}
                  role="tabpanel"
                >
                  {renderTable(departmentData)}
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "05" ? "active show" : ""
                  }`}
                  role="tabpanel"
                >
                  {renderTable(ChildData)}
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "06" ? "active show" : ""
                  }`}
                  role="tabpanel"
                >
                  {renderTable(unitData)}
                </div>
              </div>
            </div>
            {/* /.card */}
          </div>
        </div>
      </div>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>新增代碼</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGroupId">
              <Form.Label>類別</Form.Label>
              <Form.Control
                as="select"
                name="類別"
                value={newCode.類別}
                onChange={async (e) => {
                  const selectedCategory = e.target.value;
                  handleChange(e);
                  if (selectedCategory) {
                    try {
                      // 取得下一個代號
                      const response = await axios.get(
                        `${HOST_URL + GET_NEXT_CODEID}`,
                        {
                          params: { category: selectedCategory },
                        }
                      );

                      if (response.status === 200) {
                        // 設定代號
                        setNewCode((prevCode) => ({
                          ...prevCode,
                          代號: String(response.data),
                        }));

                        // 清空名稱、內容
                        setNewCode((prevCode) => ({
                          ...prevCode,
                          類別: selectedCategory,
                          代號: String(response.data),
                          名稱: "",
                          內容: "",
                        }));

                        Toast.fire({
                          icon: "success",
                          title: `新代號:${response.data}`,
                        });
                      }
                    } catch (error) {
                      setErrorMessage("請手動編號");
                    }
                  }
                }}
              >
                <option value="">選擇類別</option>
                <option value="01">縣市</option>
                <option value="02">鄉鎮</option>
                <option value="06">員工</option>
                <option value="07">部門</option>
                <option value="08">子目</option>
                <option value="09">單位</option>
              </Form.Control>

              <Form.Label>代號</Form.Label>
              <Form.Control
                type="text"
                name="代號"
                minLength={1}
                maxLength={3}
                placeholder="輸入代號"
                value={newCode.代號}
                onChange={handleChange}
              />
              <Form.Label>名稱</Form.Label>
              <Form.Control
                type="text"
                name="名稱"
                placeholder="輸入名稱"
                value={newCode.名稱}
                onChange={handleChange}
              />
              <Form.Label>內容</Form.Label>
              <Form.Control
                type="text"
                name="內容"
                placeholder="輸入內容"
                value={newCode.內容}
                onChange={handleChange}
              />
              {errorMessage && (
                <Form.Label className="text-danger">{errorMessage}</Form.Label>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            取消
          </Button>
          <Button
            variant="info"
            onClick={handleAddCode}
            disabled={isSubmitting}
          >
            <i className="fas fa-pencil-alt mr-1"></i>
            {isSubmitting ? "資料處理中..." : "建立"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Pms105a;
