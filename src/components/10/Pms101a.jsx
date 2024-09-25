import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HOST_URL,
  GET_SYSSETTING,
  UPDATE_SYSSETTING,
  GET_CODE,
  GET_AREAS_BY_CODE,
} from "../../config";
import { Modal, Button } from "react-bootstrap";

function Pms101a() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPhone: "",
    zipCode: "",
    city: "",
    Township: "",
    companyAddress: "",
    registrationCode: "",
    companyCode: "",
    depreciationPeriod: "",
    controlTime: "",
    reportFormat: "",
    calculationMethod: "",
    footerOne: "",
    footerTwo: "",
    footerThree: "",
    footerFour: "",
    footerFive: "",
    permisstime: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [townships, setTownships] = useState([]);
  //提交狀態
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    //取得系統設定
    axios
      .post(HOST_URL + GET_SYSSETTING)
      .then((response) => {
        const data = response.data[0];
        setFormData({
          companyName: data.農會名稱,
          contactPhone: data.農會電話,
          zipCode: data.郵遞區號,
          city: data.縣市,
          Township: data.鄉鎮,
          companyAddress: data.農會地址,
          registrationCode: data.註冊碼,
          companyCode: data.農會代號,
          depreciationPeriod: data.折舊週期.toString(),
          controlTime: data.控管時間,
          reportFormat: data.報表格式.toString(),
          calculationMethod: data.折舊法.toString(),
          footerOne: data.表尾一,
          footerTwo: data.表尾二,
          footerThree: data.表尾三,
          footerFour: data.表尾四,
          footerFive: data.表尾五,
          permisstime: data.permisstime,
        });
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the system settings!",
          error
        );
      });

    // 取得鄉鎮
    axios
      .get(HOST_URL + GET_CODE, {
        params: { category: "01" },
      })
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the city codes!", error);
      });
  }, []);

  // 取得對應縣市的鄉鎮
  useEffect(() => {
    if (formData.city) {
      axios
        .get(`${HOST_URL + GET_AREAS_BY_CODE}/${formData.city}`)
        .then((response) => {
          setTownships(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the townships!", error);
        });
    }
  }, [formData.city]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //儲存成功訊息
  const handleSave = () => {
    setShowModal(true);
  };

  //儲存設定動作
  const handleConfirmSave = async () => {
    const formattedData = {
      農會名稱: formData.companyName,
      農會電話: formData.contactPhone,
      郵遞區號: formData.zipCode,
      縣市: formData.city,
      鄉鎮: formData.Township,
      農會地址: formData.companyAddress,
      註冊碼: formData.registrationCode,
      農會代號: formData.companyCode,
      折舊週期: parseInt(formData.depreciationPeriod, 10),
      控管時間: parseInt(formData.controlTime, 10),
      報表格式: formData.reportFormat.charAt(0),
      折舊法: formData.calculationMethod.charAt(0),
      表尾一: formData.footerOne,
      表尾二: formData.footerTwo,
      表尾三: formData.footerThree,
      表尾四: formData.footerFour,
      表尾五: formData.footerFive,
      permisstime: formData.permisstime,
    };

    try {
      // 鎖定按鈕，防止重複提交
      setIsSubmitting(true);
      await axios
        .post(HOST_URL + UPDATE_SYSSETTING, formattedData)
        .then((response) => {
          setShowModal(false);
          setShowSuccessModal(true);
        });
    } catch (error) {
      console.error("儲存設定異常:", error);
      alert("儲存設定異常", error);
      setShowModal(false);
    } finally {
      // 解除鎖定
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header border-0">
          <div className="row">
            <div className="col-md-11">
              <h3 className="card-title">
                <i className="fa fa-bookmark"></i>
                <em>1001基本資料維護</em>
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
          <div className="form-group">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="companyName">公司名稱：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="companyName"
                  name="companyName"
                  placeholder="請輸入公司名稱"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="contactPhone">聯絡電話：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="contactPhone"
                  name="contactPhone"
                  placeholder="請輸入聯絡電話"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-2">
                <label htmlFor="zipCode">郵遞區號：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="zipCode"
                  name="zipCode"
                  placeholder="請輸入郵遞區號"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="city">縣市：</label>
                <select
                  className="form-control form-control-border"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                >
                  {cities.map((city) => (
                    <option key={city.代號} value={city.代號}>
                      {city.名稱}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="Township">鄉鎮：</label>
                <select
                  className="form-control form-control-border"
                  id="Township"
                  name="Township"
                  value={formData.Township}
                  onChange={handleChange}
                >
                  {townships.map((township) => (
                    <option key={township.代號} value={township.名稱}>
                      {township.名稱}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="companyAddress">公司地址：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="companyAddress"
                  name="companyAddress"
                  placeholder="請輸入公司地址"
                  value={formData.companyAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="registrationCode">註冊碼：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="registrationCode"
                  name="registrationCode"
                  placeholder="請輸入註冊碼"
                  value={formData.registrationCode}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="companyCode">公司代號：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="companyCode"
                  name="companyCode"
                  placeholder="請輸入公司代號"
                  value={formData.companyCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="depreciationPeriod">折舊週期：</label>
                <select
                  className="form-control form-control-border"
                  id="depreciationPeriod"
                  name="depreciationPeriod"
                  value={formData.depreciationPeriod}
                  onChange={handleChange}
                >
                  <option value="1">年</option>
                  <option value="2">半年</option>
                  <option value="4">季</option>
                  <option value="12">月</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="controlTime">控管時間(分)：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="controlTime"
                  name="controlTime"
                  placeholder="請輸入控管時間(分)"
                  value={formData.controlTime}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="reportFormat">報表格式：</label>
                <select
                  className="form-control form-control-border"
                  id="reportFormat"
                  name="reportFormat"
                  value={formData.reportFormat}
                  onChange={handleChange}
                >
                  <option value="1">PDF(.pdf)</option>
                  <option value="2">Word(.doc)</option>
                  <option value="3">Excel(.xls)</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="calculationMethod">計算方法：</label>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="custom-control custom-radio">
                        <input
                          className="custom-control-input"
                          type="radio"
                          id="customRadio1"
                          name="calculationMethod"
                          value="1"
                          checked={formData.calculationMethod === "1"}
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="customRadio1"
                          className="custom-control-label"
                        >
                          平均法
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="custom-control custom-radio">
                        <input
                          className="custom-control-input"
                          type="radio"
                          id="customRadio2"
                          name="calculationMethod"
                          value="2"
                          checked={formData.calculationMethod === "2"}
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="customRadio2"
                          className="custom-control-label"
                        >
                          會計法
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="form-group">
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="footerOne">表尾一：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="footerOne"
                  name="footerOne"
                  placeholder="請輸入表尾一"
                  value={formData.footerOne}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="footerTwo">表尾二：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="footerTwo"
                  name="footerTwo"
                  placeholder="請輸入表尾二"
                  value={formData.footerTwo}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="footerThree">表尾三：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="footerThree"
                  name="footerThree"
                  placeholder="請輸入表尾三"
                  value={formData.footerThree}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="footerFour">表尾四：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="footerFour"
                  name="footerFour"
                  placeholder="請輸入表尾四"
                  value={formData.footerFour}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="footerFive">表尾五：</label>
                <input
                  type="text"
                  className="form-control form-control-border"
                  id="footerFive"
                  name="footerFive"
                  placeholder="請輸入表尾五"
                  value={formData.footerFive}
                  onChange={handleChange}
                />
                <input
                  type="hidden"
                  id="permisstime"
                  name="permisstime"
                  value={formData.permisstime}
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-info" onClick={handleSave}>
            儲存所有設定
          </button>
        </div>
      </div>

      {/* 儲存所有設定確認訊息 */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>確認儲存</Modal.Title>
        </Modal.Header>
        <Modal.Body>您確定要儲存所有設定嗎？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            取消
          </Button>
          <Button
            variant="info"
            onClick={handleConfirmSave}
            disabled={isSubmitting}
          >
            <i className="fas fa-pencil-alt mr-1"></i>
            {isSubmitting ? "資料處理中..." : "確認"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 儲存成功訊息 */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>儲存成功</Modal.Title>
        </Modal.Header>
        <Modal.Body>設定成功儲存</Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={handleCloseSuccessModal}>
            確認
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Pms101a;
