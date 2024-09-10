import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/zh-tw";

//系統資訊
export const SYSTEM_NAME = "財產管理系統";
export const SYSTEM_YEAR = "2024";
export const SYSTEM_VERSION = "1.0.0";
export const COMPANY_NAME = "財團法人農漁會南區資訊中心";
export const COMPANY_SITE = "http://www.fast.org.tw";
//API
export const HOST_URL = "http://localhost:5035/api/v1/Pms/";
export const ADD_PROLISTS = "AddPro";
export const GET_PROLISTS = "GetProLists";
export const EDIT_PROLIST = "EditProList";
export const DELETE_PROLIST = "DeleteProList";
export const GET_SYSSETTING = "GetSysSetting";
export const UPDATE_SYSSETTING = "UpdateSysSetting";
export const GET_CODE = "GetCode";
export const GET_AREAS_BY_CODE = "GetAreasByCode";
export const GET_PRO_COUNTS = "GetProCount";
export const GET_GPASS = "GetGpass";
export const GET_GPASS_BY_ID = "GetGpassById";
export const GET_GPASS_GROUP_ID = "GetGpassGroupID";
export const UPDATE_PERMISSION_LEVEL = "UpdatePermissionLevel";
export const CREATEGROUP = "CreateGroup";
export const GETCUSER = "GetCuser";
export const ADDCUSER = "AddCuser";
export const UPDATE_CUSER_INFO = "UpdateCuserInfo";
export const DELETE_CUSER = "DeleteCuser";
export const LOGIN = "Login";
export const UPDATE_PASSWORD = "UpdatePassword";
export const ADDCODE = "AddCode";
export const UPDATE_CODE = "UpdateCode";
export const GET_NEXT_CODEID = "GetNextCodeId";
export const GET_PRO_NO = "GetProNo";
export const GET_SUBJECT_SUMMARY = "GetSubjectSummary";
//提示訊息
export const Toast = Swal.mixin({
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
//財產科目
export const SujectOptions = [
  { 代號: "1", 名稱: "土地" },
  { 代號: "2", 名稱: "房屋及建築" },
  { 代號: "3", 名稱: "機器及設備" },
  { 代號: "4", 名稱: "電腦設備" },
  { 代號: "5", 名稱: "農林設備" },
  { 代號: "6", 名稱: "畜產設備" },
  { 代號: "7", 名稱: "交通運輸設備" },
  { 代號: "8", 名稱: "雜項設備" },
  { 代號: "9", 名稱: "未完工程" },
];
//財產類別
export const CategoryOptions = [
  { 代號: "A", 名稱: "固定資產" },
  { 代號: "N", 名稱: "非固定資產" },
];
//財產狀態
export const StateOptions = [
  { 代號: "1", 名稱: "待報廢/待賣出" },
  { 代號: "2", 名稱: "報廢/賣出" },
  { 代號: "3", 名稱: "轉費用" },
  { 代號: "4", 名稱: "已完成" },
];
//完成註記
export const FinishOptions = [
  { 代號: "N", 名稱: "N" },
  { 代號: "Y", 名稱: "Y" },
];
