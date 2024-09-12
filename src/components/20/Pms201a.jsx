import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  HOST_URL,
  GET_PROLISTS,
  EDIT_PROLIST,
  DELETE_PROLIST,
  GET_CODE,
  ADD_PROLISTS,
  GET_PRO_NO,
  Toast,
  SujectOptions,
  CategoryOptions,
  StateOptions,
  FinishOptions,
} from "../../config";
import MyDatePicker from "../tools/MyDatePicker";
import DropdownSelect from "../tools/MyDropdownSelect";
import { useLocation } from "react-router-dom";

const HOME = () => {
  const [proList, setProList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const location = useLocation();

  // 解析 URL 中的查詢參數
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    if (query) {
      handleSearch({ target: { value: query } });
    }
  }, [location]);

  //編輯財產State
  const resetEditItem = () => {
    return {
      科目: "",
      子目: "",
      類別: "",
      總項: "",
      財產名稱: "",
      使用單位編號: "",
      規格程式: "",
      使用單位: "",
      來源: "",
      機器號碼: "",
      置放地點: "",
      廠牌年式: "",
      數量: "",
      計算單位: "",
      取得日期: "",
      開始折舊日期: "",
      耐用年限: "",
      開支部門: "",
      證號: "",
      資料袋編號: "",
      安裝情形: "",
      使用情形一: "",
      使用情形二: "",
      取得價值: "",
      改良修理: "",
      預留殘值: "",
      補助款: "",
      備註: "",
      保管者: "",
      財產狀態: "",
      報廢日期: "",
      報廢申請人: "",
      廢轉數量: "",
      未折減餘額: "",
      折舊累計: "",
      明細數量: "",
      登錄者: "",
      更新時間: "",
      總量: "",
      已完成註記: "",
      使用者: "",
    };
  };

  const [editItem, setEditItem] = useState(resetEditItem);

  //新增財產State
  const today = new Date();
  const minguoYear = today.getFullYear() - 1911; // 民國年
  const formattedMinguoDate = `${minguoYear}/${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${today.getDate().toString().padStart(2, "0")}`;
  const [showAddModal, setShowAddModal] = useState(false);
  const resetNewItem = () => {
    return {
      科目: "",
      子目: "",
      類別: "",
      總項: "",
      財產名稱: "",
      使用單位編號: "",
      規格程式: "",
      使用單位: "",
      來源: "",
      機器號碼: "",
      置放地點: "",
      廠牌年式: "",
      數量: 1,
      計算單位: "",
      取得日期: formattedMinguoDate, // 預設為當日
      開始折舊日期: formattedMinguoDate, // 預設為當日
      耐用年限: 1,
      開支部門: "",
      證號: "",
      資料袋編號: "",
      安裝情形: "",
      使用情形一: "",
      使用情形二: "",
      取得價值: 0,
      改良修理: 0,
      預留殘值: 0,
      補助款: 0,
      備註: "",
      保管者: "",
      財產狀態: "",
      報廢日期: "",
      報廢申請人: "",
      廢轉數量: 0,
      未折減餘額: 0,
      折舊累計: 0,
      明細數量: 1,
      登錄者: "",
      更新時間: formattedMinguoDate, // 預設為當日
      總量: 1,
      已完成註記: "",
      使用者: "",
    };
  };

  const [newItem, setNewItem] = useState(resetNewItem);
  //搜尋條件
  const [codeFilter, setCodeFilter] = useState("");
  //載入財產資料
  const fetchData = async () => {
    try {
      const response = await axios.post(HOST_URL + GET_PROLISTS);
      setProList(response.data);
      setFilteredList(response.data);
    } catch (error) {
      setError("載入資料異常");
      console.error("載入資料異常:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // 載入資料
  }, []);

  //搜尋狀態
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = proList.filter(
      (pro) =>
        pro.財產名稱.toLowerCase().includes(query) ||
        (pro.科目 + pro.子目 + pro.類別 + pro.總項)
          .toLowerCase()
          .includes(query)
    );

    setFilteredList(filtered);
    //重置為第一頁
    setCurrentPage(0);
  };

  //分頁
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredList.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  //保存編輯狀態
  const handleEdit = (index) => {
    const ListIndex = offset + index;
    setCurrentItem(filteredList[ListIndex]);
    setEditItem(filteredList[ListIndex]);
    setShowEditModal(true);
  };

  //確定編輯財產
  const handleEditSubmit = async () => {
    try {
      // 鎖定按鈕，防止重複提交
      setIsSubmitting(true);
      const response = await axios.put(HOST_URL + EDIT_PROLIST, editItem);
      if (response.status === 200) {
        const updatedList = proList.map((item) =>
          item === currentItem ? editItem : item
        );
        setProList(updatedList);
        setFilteredList(updatedList);
        setShowEditModal(false);

        Toast.fire({
          icon: "success",
          title: `「${
            editItem.財產名稱 +
            editItem.科目 +
            editItem.子目 +
            editItem.類別 +
            editItem.總項
          }」更新成功`,
        });
      }
    } catch (error) {
      setError("財產更新失敗");
      Swal.fire({
        icon: "error",
        title: "財產更新失敗",
        text: error.response?.data || "財產更新失敗",
        showConfirmButton: true,
      });
    } finally {
      // 解除鎖定
      setIsSubmitting(false);
    }
  };

  //刪除事件
  const handleDelete = (index) => {
    const ListIndex = offset + index;
    setCurrentItem(filteredList[ListIndex]);
    setShowDeleteModal(true);
  };

  //刪除財產
  const handleDeleteConfirm = async () => {
    try {
      const { 科目, 子目, 類別, 總項 } = currentItem;
      console.log("Sending data for delete:", { 科目, 子目, 類別, 總項 });
      await axios.delete(
        `${HOST_URL + DELETE_PROLIST}/${科目}/${子目}/${類別}/${總項}`
      );
      const updatedList = proList.filter((item) => item !== currentItem);
      setProList(updatedList);
      setFilteredList(updatedList);
      setShowDeleteModal(false);
    } catch (error) {
      setError("Error deleting data");
      console.error("Error deleting data:", error);
    }
  };

  //保存編輯狀態
  const handleChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setEditItem({
      ...editItem,
      [name]: value,
    });
  };

  //保存新增狀態
  const handleAddChange = (e) => {
    if (!e || !e.target) return;

    const { name, value } = e.target;

    // 如果科目變動
    if (name === "科目") {
      // 重置子目、類別為預設選項
      setNewItem((prevItem) => ({
        ...prevItem,
        科目: value, // 新的科目
        子目: "", // 清空子目
        類別: "", // 清空類別
        總項: "", // 清空總項
      }));
      return;
    }

    // 直接更新該欄位的值
    setNewItem({
      ...newItem,
      [name]: value,
    });

    // 當科目、子目、類別改變時，取得財產流水號
    if (name === "科目" || name === "子目" || name === "類別") {
      const { 科目, 子目, 類別 } = { ...newItem, [name]: value };
      if (科目 && 子目 && 類別) {
        try {
          console.debug(科目 + 子目 + 類別);
          const response = axios.get(HOST_URL + GET_PRO_NO, {
            params: { 科目, 子目, 類別 },
          });

          if (response.status === 200) {
            console.info("response:" + response.data);
            setNewItem((prevItem) => ({
              ...prevItem,
              總項: response.data,
            }));

            Toast.fire({
              icon: "success",
              title: `取得財產編號「${response.data}」`,
            });
          }
        } catch (error) {
          console.error("取得財產編號失敗", error);
          setError("取得財產編號失敗");
        }
      }
    }
  };

  //確定新增財產
  const [isSubmitting, setIsSubmitting] = useState(false); //提交狀態
  const handleAddSubmit = async () => {
    // 進行表單驗證
    const formErrors = validateForm();

    // 如果有錯誤，則更新錯誤狀態並提示
    if (Object.keys(formErrors).length > 0) {
      console.warn(Object.keys(formErrors));
      setErrors(formErrors);
      Toast.fire({
        icon: "error",
        title: `欄位必需填寫`,
      });
      return; // 阻止表單提交
    }

    // 鎖定按鈕，防止重複提交
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${HOST_URL + ADD_PROLISTS}`, {
        科目: newItem.科目,
        子目: newItem.子目.substring(1),
        類別: newItem.類別,
        總項: newItem.總項,
        財產名稱: newItem.財產名稱,
        使用單位編號: newItem.使用單位編號,
        規格程式: newItem.規格程式,
        使用單位: newItem.使用單位,
        來源: newItem.來源,
        機器號碼: newItem.機器號碼,
        置放地點: newItem.置放地點,
        廠牌年式: newItem.廠牌年式,
        數量: newItem.數量,
        計算單位: newItem.計算單位,
        取得日期: newItem.取得日期,
        開始折舊日期: newItem.開始折舊日期,
        耐用年限: newItem.耐用年限,
        開支部門: newItem.開支部門,
        證號: newItem.證號,
        資料袋編號: newItem.資料袋編號,
        安裝情形: newItem.安裝情形,
        使用情形一: newItem.使用情形一,
        使用情形二: newItem.使用情形二,
        取得價值: newItem.取得價值,
        改良修理: newItem.改良修理,
        預留殘值: newItem.預留殘值,
        補助款: newItem.補助款,
        備註: newItem.備註,
        保管者: newItem.保管者,
        財產狀態: newItem.財產狀態,
        報廢日期: newItem.報廢日期,
        報廢申請人: newItem.報廢申請人,
        廢轉數量: newItem.廢轉數量,
        未折減餘額: newItem.未折減餘額,
        折舊累計: newItem.折舊累計,
        明細數量: newItem.明細數量,
        登錄者: newItem.登錄者,
        更新時間: null,
        總量: newItem.總量,
        已完成註記: null,
        使用者: newItem.使用者,
      });

      if (response.status === 200) {
        console.info(response.status);
        fetchData();
        // 新增成功後更新列表並關閉 Modal
        setShowAddModal(false);

        resetNewItem();

        Toast.fire({
          icon: "success",
          title: `「${newItem.財產名稱}」新增成功`,
        });
      }
    } catch (error) {
      setError("財產新增失敗");
      Swal.fire({
        icon: "error",
        title: "財產新增失敗",
        text: error.response?.data || "財產新增失敗",
        showConfirmButton: true,
      });
    } finally {
      // 解除鎖定
      setIsSubmitting(false);
    }
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    // 驗證必填欄位
    if (!newItem.科目) formErrors.科目 = "請選擇科目";
    if (!newItem.子目) formErrors.子目 = "請選擇子目";
    if (!newItem.類別) formErrors.類別 = "請選擇類別";
    if (!newItem.總項) formErrors.總項 = "請填寫總項";
    if (!newItem.財產名稱) formErrors.財產名稱 = "請填寫財產名稱";
    if (!newItem.使用單位) formErrors.使用單位 = "請選擇使用單位";
    if (!newItem.置放地點) formErrors.置放地點 = "請選擇置放地點";
    if (!newItem.數量) formErrors.數量 = "請填寫數量";
    if (!newItem.計算單位) formErrors.計算單位 = "請選擇計算單位";
    if (!newItem.取得日期) formErrors.取得日期 = "請填寫取得日期";
    if (!newItem.開始折舊日期) formErrors.開始折舊日期 = "請填寫開始折舊日期";
    if (!newItem.耐用年限) formErrors.耐用年限 = "請填寫耐用年限";
    if (!newItem.開支部門) formErrors.開支部門 = "請選擇耐用年限";
    if (!newItem.取得價值) formErrors.取得價值 = "請填寫取得價值";
    if (!newItem.保管者) formErrors.保管者 = "請選擇保管者";
    if (!newItem.登錄者) formErrors.登錄者 = "請選擇登錄者";
    if (!newItem.總量) formErrors.總量 = "請選擇總量";
    if (!newItem.使用者) formErrors.使用者 = "請選擇使用者";

    // 返回是否有錯誤
    return formErrors;
  };

  // 下拉式選單
  const [options, setOptions] = useState({
    UserOptions: [],
    DepartmentOptions: [],
    ChildOptions: [],
    UnitOptions: [],
  });

  // 通用的下拉式選單選項加載函數
  const fetchOptions = async (category, key) => {
    try {
      const response = await axios.get(HOST_URL + GET_CODE, {
        params: { category },
      });
      setOptions((prevOptions) => ({
        ...prevOptions,
        [key]: response.data,
      }));
    } catch (error) {
      setError(`載入${key}失敗`);
      console.error(`載入${key}失敗:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllOptions = async () => {
      setLoading(true);
      await Promise.all([
        fetchOptions("06", "UserOptions"),
        fetchOptions("07", "DepartmentOptions"),
        fetchOptions("08", "ChildOptions"),
        fetchOptions("09", "UnitOptions"),
      ]);
    };

    fetchAllOptions();
  }, []);

  //折舊率
  function DepreciationRate(editItem) {
    const 折舊累計 = parseFloat(editItem?.折舊累計 ?? 0);
    const 取得價值 = parseFloat(editItem?.取得價值 ?? 0);
    const 預留殘值 = parseFloat(editItem?.預留殘值 ?? 0);

    if (取得價值 === 0 || 取得價值 - 預留殘值 === 0) {
      return "0%";
    }

    const result = (折舊累計 / (取得價值 - 預留殘值)) * 100;
    return `${result.toFixed(0)}%`;
  }

  //科目下拉選單
  const [selectedSubject, setSelectedSubject] = useState("");
  const handleSubjectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSubject(selectedValue);

    const filtered = proList.filter((pro) =>
      selectedValue ? pro.科目.includes(selectedValue) : true
    );

    setFilteredList(filtered);
    setCurrentPage(0);
  };

  return (
    <div className="container">
      {loading && <p>載入資料中...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <>
          <div className="card">
            <div className="card-header border-0">
              <h3 className="card-title">
                <i className="fa fa-bookmark"></i>
                <em>財產清單</em>
              </h3>
              <div className="card-tools">
                <div className="row">
                  <div className="col-md-3">
                    <button
                      type="submit"
                      className="btn btn-block btn-outline-info"
                      onClick={() => setShowAddModal(true)}
                    >
                      新增財產
                    </button>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-control"
                      value={selectedSubject}
                      onChange={handleSubjectChange}
                    >
                      <option value="">選擇科目</option>
                      {SujectOptions.map((option) => (
                        <option key={option.代號} value={option.代號}>
                          {option.名稱}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        placeholder="請輸入財產名稱"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="form-control"
                        style={{ textTransform: "uppercase" }}
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
            <div
              className="card-body table-responsive p-0"
              style={{
                overflowX: "auto",
              }}
            >
              <table
                className="table table-striped table-valign-middle"
                style={{ whiteSpace: "nowrap" }}
              >
                <thead>
                  <tr>
                    <th></th>
                    <th className="sticky-column">項目</th>
                    <th className="sticky-column-2">財產編號</th>
                    <th className="sticky-column-3">財產名稱</th>
                    <th>折舊率　　　　　　</th>
                    <th>數量</th>
                    <th>計算單位</th>
                    <th>取得日期</th>
                    <th>取得價值</th>
                    <th>預留殘值</th>
                    <th>折舊累計</th>
                    <th>未折減餘額</th>
                    <th>開始折舊日期</th>
                    <th>使用單位編號</th>
                    <th>規格程式</th>
                    <th>使用單位</th>
                    <th>來源</th>
                    <th>機器號碼</th>
                    <th>置放地點</th>
                    <th>廠牌年式</th>
                    <th>耐用年限</th>
                    <th>開支部門</th>
                    <th>證號</th>
                    <th>資料袋編號</th>
                    <th>安裝情形</th>
                    <th>使用情形一</th>
                    <th>使用情形二</th>
                    <th>改良修理</th>
                    <th>補助款</th>
                    <th>備註</th>
                    <th>保管者</th>
                    <th>財產狀態</th>
                    <th>報廢日期</th>
                    <th>報廢申請人</th>
                    <th>廢轉數量</th>
                    <th>明細數量</th>
                    <th>登錄者</th>
                    <th>更新時間</th>
                    <th>總量</th>
                    <th>已完成註記</th>
                    <th>使用者</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((pro, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          className="btn btn-sm btn-primary mr-2"
                          onClick={() => handleEdit(index)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        {/*                         <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(index)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button> */}
                      </td>
                      <td className="sticky-column">{offset + index + 1}</td>
                      <td className="sticky-column-2">
                        <label>
                          {pro.科目}
                          {pro.子目}
                          {pro.類別}
                          {pro.總項}
                        </label>
                      </td>
                      <td className="sticky-column-3">
                        <label>{pro.財產名稱}</label>
                      </td>
                      <td>
                        <div className="progress progress-xs">
                          <div
                            className="progress-bar progress-bar-striped"
                            style={{ width: DepreciationRate(pro) }}
                          ></div>
                        </div>
                        {DepreciationRate(pro)}
                      </td>
                      <td>{pro.數量}</td>
                      <td>{pro.計算單位}</td>
                      <td>{pro.取得日期}</td>
                      <td>{pro.取得價值}</td>
                      <td>{pro.預留殘值}</td>
                      <td>{pro.折舊累計}</td>
                      <td>{pro.未折減餘額}</td>
                      <td>{pro.開始折舊日期}</td>
                      <td>{pro.使用單位編號}</td>
                      <td>{pro.規格程式}</td>
                      <td>{pro.使用單位}</td>
                      <td>{pro.來源}</td>
                      <td>{pro.機器號碼}</td>
                      <td>{pro.置放地點}</td>
                      <td>{pro.廠牌年式}</td>
                      <td>{pro.耐用年限}</td>
                      <td>{pro.開支部門}</td>
                      <td>{pro.證號}</td>
                      <td>{pro.資料袋編號}</td>
                      <td>{pro.安裝情形}</td>
                      <td>{pro.使用情形一}</td>
                      <td>{pro.使用情形二}</td>
                      <td>{pro.改良修理}</td>
                      <td>{pro.補助款}</td>
                      <td>{pro.備註}</td>
                      <td>{pro.保管者}</td>
                      <td>{pro.財產狀態}</td>
                      <td>{pro.報廢日期}</td>
                      <td>{pro.報廢申請人}</td>
                      <td>{pro.廢轉數量}</td>
                      <td>{pro.明細數量}</td>
                      <td>{pro.登錄者}</td>
                      <td>{pro.更新時間}</td>
                      <td>{pro.總量}</td>
                      <td>{pro.已完成註記}</td>
                      <td>{pro.使用者}</td>
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
        </>
      )}

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-info">
            {editItem.科目}
            {editItem.子目}
            {editItem.類別}
            {editItem.總項}-{editItem.財產名稱}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div id="MainContent_PanDept">
              <div className="info-box bg-info">
                <div className="info-box-content">
                  <div className="ribbon-wrapper">
                    <div className="ribbon bg-danger">
                      <span id="MainContent_lbRibbon">
                        {SujectOptions.find(
                          (option) => option.代號 === editItem.科目
                        )?.名稱 || "未知科目"}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-12">
                          <span className="info-box-number">
                            <span id="MainContent_lbDept03">
                              折舊率:
                              {DepreciationRate(editItem)}/ 折舊累計:
                              {editItem.折舊累計}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="progress">
                            <div
                              className="progress-bar"
                              style={{
                                width: `${DepreciationRate(editItem)}`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <label>財產編號</label>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <h3>
                    {editItem.科目}
                    {editItem.子目}
                    {editItem.類別}
                    {editItem.總項}
                  </h3>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>財產名稱</label>
              <input
                type="text"
                name="財產名稱"
                maxLength={30}
                minLength={1}
                className="form-control"
                value={editItem.財產名稱 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>使用單位編號</label>
              <input
                type="text"
                name="使用單位編號"
                maxLength={8}
                className="form-control"
                value={editItem.使用單位編號 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>規格程式</label>
              <input
                type="text"
                name="規格程式"
                maxLength={20}
                className="form-control"
                value={editItem.規格程式 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="使用單位"
                value={editItem.使用單位}
                onChange={handleChange}
                options={options.DepartmentOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
              />
            </div>
            <div className="form-group">
              <label>來源</label>
              <input
                type="text"
                name="來源"
                maxLength={20}
                className="form-control"
                value={editItem.來源 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>機器號碼</label>
              <input
                type="text"
                name="機器號碼"
                maxLength={30}
                className="form-control"
                value={editItem.機器號碼 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>置放地點</label>
              <input
                type="text"
                name="置放地點"
                maxLength={20}
                className="form-control"
                value={editItem.置放地點 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>廠牌年式</label>
              <input
                type="text"
                name="廠牌年式"
                maxLength={20}
                className="form-control"
                value={editItem.廠牌年式 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>數量</label>
              <input
                type="number"
                name="數量"
                min={1}
                className="form-control"
                value={editItem.數量 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="計算單位"
                value={editItem.計算單位}
                onChange={handleChange}
                options={options.UnitOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
              />
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-12">
                  <label>取得日期</label>
                </div>
                <div className="col-md-12">
                  <MyDatePicker
                    name="取得日期"
                    value={editItem.取得日期 || ""}
                    onChange={(date) =>
                      handleChange({
                        target: { name: "取得日期", value: date },
                      })
                    }
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-12">
                  <label>開始折舊日期</label>
                </div>
                <div className="col-md-12">
                  <MyDatePicker
                    name="開始折舊日期"
                    value={editItem.開始折舊日期 || ""}
                    onChange={(date) =>
                      handleChange({
                        target: { name: "開始折舊日期", value: date },
                      })
                    }
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>耐用年限</label>
              <input
                type="number"
                name="耐用年限"
                maxLength={999}
                min={1}
                className="form-control"
                value={editItem.耐用年限 || ""}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="開支部門"
                value={editItem.開支部門}
                onChange={handleChange}
                options={options.DepartmentOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
              />
            </div>
            <div className="form-group">
              <label>證號</label>
              <input
                type="text"
                name="證號"
                maxLength={10}
                className="form-control"
                value={editItem.證號 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>資料袋編號</label>
              <input
                type="text"
                name="資料袋編號"
                maxLength={10}
                className="form-control"
                value={editItem.資料袋編號 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>安裝情形</label>
              <input
                type="text"
                name="安裝情形"
                maxLength={40}
                className="form-control"
                value={editItem.安裝情形 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>使用情形一</label>
              <input
                type="text"
                name="使用情形一"
                maxLength={40}
                className="form-control"
                value={editItem.使用情形一 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>使用情形二</label>
              <input
                type="text"
                name="使用情形二"
                maxLength={40}
                className="form-control"
                value={editItem.使用情形二 || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>取得價值</label>
              <input
                type="number"
                name="取得價值"
                min={0}
                className="form-control"
                value={editItem.取得價值 || "0"}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <label>改良修理</label>
              <input
                type="number"
                name="改良修理"
                min={0}
                className="form-control"
                value={editItem.改良修理 || "0"}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <label>預留殘值</label>
              <input
                type="number"
                name="預留殘值"
                min={0}
                className="form-control"
                value={editItem.預留殘值 || "0"}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <label>補助款</label>
              <input
                type="number"
                name="補助款"
                min={0}
                className="form-control"
                value={editItem.補助款 || "0"}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <label>備註</label>
              <textarea
                name="備註"
                className="form-control"
                value={editItem.備註 || ""}
                onChange={handleChange}
                rows="6"
                cols="50"
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="保管者"
                value={editItem.保管者}
                onChange={handleChange}
                options={options.UserOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
              />
            </div>
            <div className="form-group">
              <label>財產狀態</label>
              <select
                name="財產狀態"
                className="form-control"
                value={editItem.財產狀態 || ""}
                onChange={handleChange}
              >
                <option value="">請選擇財產狀態</option>
                <option value="1">待報廢/待賣出</option>
                <option value="2">報廢/賣出</option>
                <option value="3">轉費用</option>
                <option value="4">已完成</option>
              </select>
            </div>
            <div className="form-group">
              <label>報廢日期</label>
              <MyDatePicker
                name="報廢日期"
                value={editItem.報廢日期 || ""}
                onChange={(date) =>
                  handleChange({
                    target: { name: "報廢日期", value: date },
                  })
                }
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="報廢申請人"
                value={editItem.報廢申請人}
                onChange={handleChange}
                options={options.UserOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
              />
            </div>
            <div className="form-group">
              <label>廢轉數量</label>
              <input
                type="number"
                name="廢轉數量"
                min={0}
                className="form-control"
                value={editItem.廢轉數量 || "0"}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>未折減餘額</label>
              <input
                type="number"
                name="未折減餘額"
                min={0}
                className="form-control"
                value={editItem.未折減餘額 || "0"}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <label>折舊累計</label>
              <input
                type="number"
                name="折舊累計"
                min={0}
                className="form-control"
                value={editItem.折舊累計 || "0"}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <label>明細數量</label>
              <input
                type="number"
                name="明細數量"
                min={1}
                className="form-control"
                value={editItem.明細數量 || "1"}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <label>登錄者</label>
              <input
                type="text"
                name="登錄者"
                maxLength={20}
                className="form-control"
                value={editItem.登錄者 || ""}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <label>更新時間</label>
              <input
                type="text"
                name="更新時間"
                className="form-control"
                value={editItem.更新時間 || ""}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <label>總量</label>
              <input
                type="number"
                name="總量"
                min={1}
                className="form-control"
                value={editItem.總量 || "1"}
                onChange={handleChange}
                readOnly={true}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="已完成註記"
                value={editItem.已完成註記}
                onChange={handleChange}
                options={FinishOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"代號"}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="使用者"
                value={editItem.使用者}
                onChange={handleChange}
                options={options.UserOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            取消
          </Button>
          <Button
            variant="danger"
            onClick={handleEditSubmit}
            disabled={isSubmitting}
          >
            <i className="fas fa-pencil-alt mr-1"></i>
            {isSubmitting ? "資料處理中..." : "儲存"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-info">新增財產</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <DropdownSelect
                name="科目"
                value={newItem.科目}
                onChange={handleAddChange}
                options={SujectOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"代號"}
                invalid={errors.科目}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="子目"
                value={newItem.子目}
                onChange={handleAddChange}
                options={options.ChildOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"代號"}
                invalid={errors.子目}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="類別"
                value={newItem.類別}
                onChange={handleAddChange}
                options={CategoryOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"代號"}
                invalid={errors.類別}
              />
            </div>
            <div className="form-group">
              <label>總項</label>
              <input
                type="text"
                name="總項"
                value={newItem.總項}
                onChange={handleAddChange}
                className={`form-control ${errors.總項 ? "is-invalid" : ""}`}
                readOnly
              />
              {errors.總項 && (
                <div className="invalid-feedback">{errors.總項}</div>
              )}
            </div>
            <div className="form-group">
              <label>財產名稱</label>
              <input
                type="text"
                name="財產名稱"
                maxLength={30}
                minLength={1}
                className={`form-control ${
                  errors.財產名稱 ? "is-invalid" : ""
                }`}
                value={newItem.財產名稱}
                onChange={handleAddChange}
              />
              {errors.財產名稱 && (
                <div className="invalid-feedback">{errors.財產名稱}</div>
              )}
            </div>
            <div className="form-group">
              <label>使用單位編號</label>
              <input
                type="text"
                name="使用單位編號"
                maxLength={8}
                className="form-control"
                value={newItem.使用單位編號}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>規格程式</label>
              <input
                type="text"
                name="規格程式"
                maxLength={20}
                className="form-control"
                value={newItem.規格程式}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="使用單位"
                value={newItem.使用單位}
                onChange={handleAddChange}
                options={options.DepartmentOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
                invalid={errors.使用單位}
              />
            </div>
            <div className="form-group">
              <label>來源</label>
              <input
                type="text"
                name="來源"
                maxLength={20}
                className="form-control"
                value={newItem.來源}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>機器號碼</label>
              <input
                type="text"
                name="機器號碼"
                maxLength={30}
                className="form-control"
                value={newItem.機器號碼}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>置放地點</label>
              <input
                type="text"
                name="置放地點"
                maxLength={20}
                className={`form-control ${
                  errors.置放地點 ? "is-invalid" : ""
                }`}
                value={newItem.置放地點}
                onChange={handleAddChange}
              />
              {errors.置放地點 && (
                <div className="invalid-feedback">{errors.置放地點}</div>
              )}
            </div>
            <div className="form-group">
              <label>廠牌年式</label>
              <input
                type="text"
                name="廠牌年式"
                maxLength={30}
                className="form-control"
                value={newItem.廠牌年式}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>數量</label>
              <input
                type="number"
                name="數量"
                min={1}
                className={`form-control ${errors.數量 ? "is-invalid" : ""}`}
                value={newItem.數量}
                onChange={handleAddChange}
              />
              {errors.數量 && (
                <div className="invalid-feedback">{errors.數量}</div>
              )}
            </div>
            <div className="form-group">
              <DropdownSelect
                name="計算單位"
                value={newItem.計算單位}
                onChange={handleAddChange}
                options={options.UnitOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
                invalid={errors.計算單位}
              />
            </div>
            <div className="form-group">
              <label>取得日期</label>
              <MyDatePicker
                name="取得日期"
                value={newItem.取得日期 || ""}
                onChange={(date) =>
                  handleChange({
                    target: { name: "取得日期", value: date },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>開始折舊日期</label>
              <MyDatePicker
                name="開始折舊日期"
                value={newItem.開始折舊日期 || ""}
                onChange={(date) =>
                  handleChange({
                    target: { name: "開始折舊日期", value: date },
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>耐用年限</label>
              <input
                type="number"
                name="耐用年限"
                min={1}
                className="form-control"
                value={newItem.耐用年限}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="開支部門"
                value={newItem.開支部門}
                onChange={handleAddChange}
                options={options.DepartmentOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
                invalid={errors.開支部門}
              />
            </div>
            <div className="form-group">
              <label>證號</label>
              <input
                type="text"
                name="證號"
                maxLength={10}
                className="form-control"
                value={newItem.證號}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>資料袋編號</label>
              <input
                type="text"
                name="資料袋編號"
                maxLength={10}
                className="form-control"
                value={newItem.資料袋編號}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>安裝情形</label>
              <input
                type="text"
                name="安裝情形"
                maxLength={40}
                className="form-control"
                value={newItem.安裝情形}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>使用情形一</label>
              <input
                type="text"
                name="使用情形一"
                maxLength={40}
                className="form-control"
                value={newItem.使用情形一}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>使用情形二</label>
              <input
                type="text"
                name="使用情形二"
                maxLength={40}
                className="form-control"
                value={newItem.使用情形二}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>取得價值</label>
              <input
                type="number"
                min={0}
                name="取得價值"
                className={`form-control ${
                  errors.取得價值 ? "is-invalid" : ""
                }`}
                value={newItem.取得價值}
                onChange={handleAddChange}
              />
              {errors.取得價值 && (
                <div className="invalid-feedback">{errors.取得價值}</div>
              )}
            </div>
            <div className="form-group">
              <label>改良修理</label>
              <input
                type="text"
                name="改良修理"
                className="form-control"
                value={newItem.改良修理}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>預留殘值</label>
              <input
                type="number"
                min={0}
                name="預留殘值"
                className="form-control"
                value={newItem.預留殘值}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>補助款</label>
              <input
                type="number"
                min={0}
                name="補助款"
                className="form-control"
                value={newItem.補助款}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>備註</label>
              <textarea
                type="text"
                name="備註"
                className="form-control"
                value={newItem.備註}
                onChange={handleAddChange}
                rows="6"
                cols="50"
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="保管者"
                value={newItem.保管者}
                onChange={handleAddChange}
                options={options.UserOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
                invalid={errors.保管者}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="財產狀態"
                value={newItem.財產狀態}
                onChange={handleAddChange}
                options={StateOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"代號"}
                invalid={errors.財產狀態}
              />
            </div>
            <div className="form-group">
              <label>報廢日期</label>
              <MyDatePicker
                name="報廢日期"
                value={newItem.報廢日期 || ""}
                onChange={(date) =>
                  handleChange({
                    target: { name: "報廢日期", value: date },
                  })
                }
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="報廢申請人"
                value={newItem.報廢申請人}
                onChange={handleAddChange}
                options={options.UserOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
              />
            </div>
            <div className="form-group">
              <label>廢轉數量</label>
              <input
                type="number"
                name="廢轉數量"
                min={0}
                className="form-control"
                value={newItem.廢轉數量}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>未折減餘額</label>
              <input
                type="number"
                name="未折減餘額"
                min={0}
                className="form-control"
                value={newItem.未折減餘額}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>折舊累計</label>
              <input
                type="number"
                name="折舊累計"
                min={0}
                className="form-control"
                value={newItem.折舊累計}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <label>明細數量</label>
              <input
                type="number"
                name="明細數量"
                min={0}
                className="form-control"
                value={newItem.明細數量}
                onChange={handleAddChange}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="登錄者"
                value={newItem.登錄者}
                onChange={handleAddChange}
                options={options.UserOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
                invalid={errors.登錄者}
              />
            </div>
            <div className="form-group">
              <label>更新時間</label>
              <input
                type="text"
                name="更新時間"
                className="form-control"
                value={newItem.更新時間}
                onChange={handleAddChange}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>總量</label>
              <input
                type="number"
                name="總量"
                min={1}
                className={`form-control ${errors.總量 ? "is-invalid" : ""}`}
                value={newItem.總量}
                onChange={handleAddChange}
              />
              {errors.總量 && (
                <div className="invalid-feedback">{errors.總量}</div>
              )}
            </div>
            <div className="form-group">
              <DropdownSelect
                name="已完成註記"
                value={newItem.已完成註記}
                onChange={handleAddChange}
                options={FinishOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"代號"}
              />
            </div>
            <div className="form-group">
              <DropdownSelect
                name="使用者"
                value={newItem.使用者}
                onChange={handleAddChange}
                options={options.UserOptions}
                loading={loading}
                error={error}
                option_key={"代號"}
                option_value={"名稱"}
                invalid={errors.使用者}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            取消
          </Button>
          <Button
            variant="danger"
            onClick={handleAddSubmit}
            disabled={isSubmitting}
          >
            <i className="fa fa-plus"></i>
            {isSubmitting ? "資料處理中..." : "新增"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>確認刪除</Modal.Title>
        </Modal.Header>
        <Modal.Body>確定要刪除該筆資料嗎？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            删除
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HOME;
