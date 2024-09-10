import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { Bar } from "react-chartjs-2"; // Bar 圖表
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  HOST_URL,
  GET_PROLISTS,
  GET_PRO_COUNTS,
  EDIT_PROLIST,
  DELETE_PROLIST,
  GET_SUBJECT_SUMMARY,
} from "../config";

// 註冊 Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  const [editItem, setEditItem] = useState({});
  const [counts, setCounts] = useState({
    land: 0,
    house: 0,
    machine: 0,
    computer: 0,
    farm: 0,
    livestock: 0,
    transport: 0,
    misc: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(HOST_URL + GET_PROLISTS);
        setProList(response.data);
        setFilteredList(response.data);
        await fetchCounts();
      } catch (error) {
        setError("載入資料異常");
        console.error("載入資料異常:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCounts = async () => {
      try {
        const landCount = await axios.get(`${HOST_URL + GET_PRO_COUNTS}/1`);
        const houseCount = await axios.get(`${HOST_URL + GET_PRO_COUNTS}/2`);
        const machineCount = await axios.get(`${HOST_URL + GET_PRO_COUNTS}/3`);
        const computerCount = await axios.get(`${HOST_URL + GET_PRO_COUNTS}/4`);
        const farmCount = await axios.get(`${HOST_URL + GET_PRO_COUNTS}/5`);
        const livestockCount = await axios.get(
          `${HOST_URL + GET_PRO_COUNTS}/6`
        );
        const transportCount = await axios.get(
          `${HOST_URL + GET_PRO_COUNTS}/7`
        );
        const miscCount = await axios.get(`${HOST_URL + GET_PRO_COUNTS}/8`);

        setCounts({
          land: landCount.data,
          house: houseCount.data,
          machine: machineCount.data,
          computer: computerCount.data,
          farm: farmCount.data,
          livestock: livestockCount.data,
          transport: transportCount.data,
          misc: miscCount.data,
        });
      } catch (error) {
        setError("Error fetching counts");
        console.error("Error fetching counts:", error);
      }
    };

    fetchData();
  }, []);

  // 設置圖表數據
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    axios
      .post(HOST_URL + GET_SUBJECT_SUMMARY)
      .then((response) => {
        const data = response.data;
        processData(data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  const processData = (data) => {
    // 初始化標籤及資料
    const labels = [];
    const values = [];

    // 計算總和
    let totalValue = 0;

    // 整理資料
    data.forEach((item) => {
      labels.push(item.科目名稱);
      values.push(item.取得價值);
      totalValue += item.取得價值;
    });

    // 設定圖表資料
    setChartData({
      labels: labels,
      datasets: [
        {
          label: `${new Intl.NumberFormat("zh-TW", {
            style: "currency",
            currency: "TWD",
          }).format(totalValue)}`,
          data: values,
          backgroundColor: [
            "#36a2eb",
            "#ff6384",
            "#4bc0c0",
            "#9966ff",
            "#ffcd56",
            "#ff9f40",
            "#ff6384",
            "#4bc0c0",
            "#9966ff",
          ],
          borderColor: [
            "#36a2eb",
            "#ff6384",
            "#4bc0c0",
            "#9966ff",
            "#ffcd56",
            "#ff9f40",
            "#ff6384",
            "#4bc0c0",
            "#9966ff",
          ],
          borderWidth: 1,
        },
      ],
    });
  };

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

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredList.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const handleEdit = (index) => {
    const ListIndex = offset + index;
    setCurrentItem(filteredList[ListIndex]);
    setEditItem(filteredList[ListIndex]);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
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
    }
  };

  const handleDelete = (index) => {
    const ListIndex = offset + index;
    setCurrentItem(filteredList[ListIndex]);
    setShowDeleteModal(true);
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditItem({
      ...editItem,
      [name]: value,
    });
  };

  //提示訊息
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

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
                <em>財產總數</em>
              </h3>
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
            <div className="card-body">
              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <div className="row">
                        <div className="col-md-6">
                          <p>土地</p>
                        </div>
                        <div className="col-md-6 text-right">
                          <h3>{counts.land}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="icon">
                      <i className="fas fa-globe"></i>
                    </div>
                    <a href="#" className="small-box-footer">
                      查看 <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <div className="row">
                        <div className="col-md-6">
                          <p>房屋及建築</p>
                        </div>
                        <div className="col-md-6 text-right">
                          <h3>{counts.house}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="icon">
                      <i className="fas fa-home"></i>
                    </div>
                    <a href="#" className="small-box-footer">
                      查看 <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <div className="row">
                        <div className="col-md-6">
                          <p>機器及設備</p>
                        </div>
                        <div className="col-md-6 text-right">
                          <h3>{counts.machine}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="icon">
                      <i className="fas fa-gavel"></i>
                    </div>
                    <a href="#" className="small-box-footer">
                      查看 <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <div className="row">
                        <div className="col-md-6">
                          <p>電腦設備</p>
                        </div>
                        <div className="col-md-6 text-right">
                          <h3>{counts.computer}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="icon">
                      <i className="fas fa-desktop"></i>
                    </div>
                    <a href="#" className="small-box-footer">
                      查看 <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <div className="row">
                        <div className="col-md-6">
                          <p>農林設備</p>
                        </div>
                        <div className="col-md-6 text-right">
                          <h3>{counts.farm}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="icon">
                      <i className="fas fa-tree"></i>
                    </div>
                    <a href="#" className="small-box-footer">
                      查看 <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <div className="row">
                        <div className="col-md-6">
                          <p>畜產設備</p>
                        </div>
                        <div className="col-md-6 text-right">
                          <h3>{counts.livestock}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="icon">
                      <i className="fas fa-bug"></i>
                    </div>
                    <a href="#" className="small-box-footer">
                      查看 <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <div className="row">
                        <div className="col-md-6">
                          <p>交通運輸設備</p>
                        </div>
                        <div className="col-md-6 text-right">
                          <h3>{counts.transport}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="icon">
                      <i className="fas fa-car"></i>
                    </div>
                    <a href="#" className="small-box-footer">
                      查看 <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <div className="row">
                        <div className="col-md-6">
                          <p>雜項設備</p>
                        </div>
                        <div className="col-md-6 text-right">
                          <h3>{counts.misc}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="icon">
                      <i className="fas fa-cube"></i>
                    </div>
                    <a href="#" className="small-box-footer">
                      查看 <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header border-0">
              <h3 className="card-title">
                <i className="fa fa-bookmark"></i>
                <em>財產價值</em>
              </h3>
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
            <div className="card-body">
              {chartData ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "財產價值總表",
                      },
                      datalabels: {
                        anchor: "end",
                        align: "top",
                        color: "#000",
                        formatter: (value) => value.toLocaleString(),
                        font: {
                          weight: "bold",
                          size: 16,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <p>載入圖表...</p>
              )}
            </div>
          </div>

          {/* <div className="card">
            <div className="card-header border-0">
              <h3 className="card-title">
                <i className="fa fa-bookmark"></i>
                <em>財產清單</em>
              </h3>
              <div className="card-tools">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    placeholder="請輸入財產名稱"
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
                    <th>項目</th>
                    <th>科目</th>
                    <th>子目</th>
                    <th>類別</th>
                    <th>總項</th>
                    <th>財產名稱</th>
                    <th>使用單位編號</th>
                    <th>規格程式</th>
                    <th>使用單位</th>
                    <th>來源</th>
                    <th>機器號碼</th>
                    <th>置放地點</th>
                    <th>廠牌年式</th>
                    <th>數量</th>
                    <th>計算單位</th>
                    <th>取得日期</th>
                    <th>開始折舊日期</th>
                    <th>耐用年限</th>
                    <th>開支部門</th>
                    <th>證號</th>
                    <th>資料袋編號</th>
                    <th>安裝情形</th>
                    <th>使用情形一</th>
                    <th>使用情形二</th>
                    <th>取得價值</th>
                    <th>改良修理</th>
                    <th>預留殘值</th>
                    <th>補助款</th>
                    <th>備註</th>
                    <th>保管者</th>
                    <th>財產狀態</th>
                    <th>報廢日期</th>
                    <th>報廢申請人</th>
                    <th>廢轉數量</th>
                    <th>未折減餘額</th>
                    <th>折舊累計</th>
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
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(index)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                      <td>{offset + index + 1}</td>
                      <td>{pro.科目}</td>
                      <td>{pro.子目}</td>
                      <td>{pro.類別}</td>
                      <td>{pro.總項}</td>
                      <td>{pro.財產名稱}</td>
                      <td>{pro.使用單位編號}</td>
                      <td>{pro.規格程式}</td>
                      <td>{pro.使用單位}</td>
                      <td>{pro.來源}</td>
                      <td>{pro.機器號碼}</td>
                      <td>{pro.置放地點}</td>
                      <td>{pro.廠牌年式}</td>
                      <td>{pro.數量}</td>
                      <td>{pro.計算單位}</td>
                      <td>{pro.取得日期}</td>
                      <td>{pro.開始折舊日期}</td>
                      <td>{pro.耐用年限}</td>
                      <td>{pro.開支部門}</td>
                      <td>{pro.證號}</td>
                      <td>{pro.資料袋編號}</td>
                      <td>{pro.安裝情形}</td>
                      <td>{pro.使用情形一}</td>
                      <td>{pro.使用情形二}</td>
                      <td>{pro.取得價值}</td>
                      <td>{pro.改良修理}</td>
                      <td>{pro.預留殘值}</td>
                      <td>{pro.補助款}</td>
                      <td>{pro.備註}</td>
                      <td>{pro.保管者}</td>
                      <td>{pro.財產狀態}</td>
                      <td>{pro.報廢日期}</td>
                      <td>{pro.報廢申請人}</td>
                      <td>{pro.廢轉數量}</td>
                      <td>{pro.未折減餘額}</td>
                      <td>{pro.折舊累計}</td>
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
          </div> */}
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
                className="form-control"
                value={editItem.財產名稱}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>使用單位編號</label>
              <input
                type="text"
                name="使用單位編號"
                className="form-control"
                value={editItem.使用單位編號}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>規格程式</label>
              <input
                type="text"
                name="規格程式"
                className="form-control"
                value={editItem.規格程式}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>使用單位</label>
              <input
                type="text"
                name="使用單位"
                className="form-control"
                value={editItem.使用單位}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>來源</label>
              <input
                type="text"
                name="來源"
                className="form-control"
                value={editItem.來源}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>機器號碼</label>
              <input
                type="text"
                name="機器號碼"
                className="form-control"
                value={editItem.機器號碼}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>置放地點</label>
              <input
                type="text"
                name="置放地點"
                className="form-control"
                value={editItem.置放地點}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>廠牌年式</label>
              <input
                type="text"
                name="廠牌年式"
                className="form-control"
                value={editItem.廠牌年式}
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
                value={editItem.數量}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>計算單位</label>
              <input
                type="text"
                name="計算單位"
                className="form-control"
                value={editItem.計算單位}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>取得日期</label>
              <input
                type="text"
                name="取得日期"
                className="form-control"
                value={editItem.取得日期}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>開始折舊日期</label>
              <input
                type="text"
                name="開始折舊日期"
                className="form-control"
                value={editItem.開始折舊日期}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>耐用年限</label>
              <input
                type="number"
                name="耐用年限"
                min={1}
                className="form-control"
                value={editItem.耐用年限}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>開支部門</label>
              <input
                type="text"
                name="開支部門"
                className="form-control"
                value={editItem.開支部門}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>證號</label>
              <input
                type="text"
                name="證號"
                className="form-control"
                value={editItem.證號}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>資料袋編號</label>
              <input
                type="text"
                name="資料袋編號"
                className="form-control"
                value={editItem.資料袋編號}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>安裝情形</label>
              <input
                type="text"
                name="安裝情形"
                className="form-control"
                value={editItem.安裝情形}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>使用情形一</label>
              <input
                type="text"
                name="使用情形一"
                className="form-control"
                value={editItem.使用情形一}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>使用情形二</label>
              <input
                type="text"
                name="使用情形二"
                className="form-control"
                value={editItem.使用情形二}
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
                value={editItem.取得價值}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>改良修理</label>
              <input
                type="number"
                name="改良修理"
                min={0}
                className="form-control"
                value={editItem.改良修理}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>預留殘值</label>
              <input
                type="number"
                name="預留殘值"
                min={0}
                className="form-control"
                value={editItem.預留殘值}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>補助款</label>
              <input
                type="number"
                name="補助款"
                min={0}
                className="form-control"
                value={editItem.補助款}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>備註</label>
              <input
                type="text"
                name="備註"
                className="form-control"
                value={editItem.備註}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>保管者</label>
              <input
                type="text"
                name="保管者"
                className="form-control"
                value={editItem.保管者}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>財產狀態</label>
              <input
                type="text"
                name="財產狀態"
                className="form-control"
                value={editItem.財產狀態}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>報廢日期</label>
              <input
                type="text"
                name="報廢日期"
                className="form-control"
                value={editItem.報廢日期}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>報廢申請人</label>
              <input
                type="text"
                name="報廢申請人"
                className="form-control"
                value={editItem.報廢申請人}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>廢轉數量</label>
              <input
                type="number"
                name="廢轉數量"
                min={0}
                className="form-control"
                value={editItem.廢轉數量}
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
                value={editItem.未折減餘額}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>折舊累計</label>
              <input
                type="number"
                name="折舊累計"
                min={0}
                className="form-control"
                value={editItem.折舊累計}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>明細數量</label>
              <input
                type="number"
                name="明細數量"
                min={2}
                className="form-control"
                value={editItem.明細數量}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>登錄者</label>
              <input
                type="text"
                name="登錄者"
                className="form-control"
                value={editItem.登錄者}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>更新時間</label>
              <input
                type="text"
                name="更新時間"
                className="form-control"
                value={editItem.更新時間}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>總量</label>
              <input
                type="number"
                name="總量"
                min={1}
                className="form-control"
                value={editItem.總量}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>已完成註記</label>
              <input
                type="text"
                name="已完成註記"
                className="form-control"
                value={editItem.已完成註記}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>使用者</label>
              <input
                type="text"
                name="使用者"
                className="form-control"
                value={editItem.使用者}
                onChange={handleChange}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleEditSubmit}>
            <i class="fas fa-pencil-alt mr-1"></i>
            儲存
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
