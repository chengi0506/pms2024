import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { zhTW } from "date-fns/locale";
import {
  format,
  parse,
  isValid,
  getYear,
  getMonth,
  eachYearOfInterval,
} from "date-fns";
import "../../index.css";

// 轉換西元年到民國年
const convertToROCYear = (date) => {
  if (!date) return "";
  const year = date.getFullYear() - 1911;
  const formattedDate = format(date, `yyyy/MM/dd`, { locale: zhTW });
  return formattedDate.replace(/^(\d{4})/, year.toString());
};

// 轉換民國年到西元年
const convertToGregorianYear = (rocYear) => {
  if (!rocYear) return new Date();
  const year = parseInt(rocYear.split("/")[0]) + 1911;
  const formattedDate = rocYear.replace(/^\d{3}/, year.toString());
  return parse(formattedDate, `yyyy/MM/dd`, new Date());
};

const MyDatePicker = ({ name, value, onChange, readOnly }) => {
  const [startDate, setStartDate] = React.useState(
    convertToGregorianYear(value)
  );
  const [displayDate, setDisplayDate] = React.useState(value);

  const handleDateChange = (date) => {
    setStartDate(date);
    const formattedDate = convertToROCYear(date);
    setDisplayDate(formattedDate);
    onChange(formattedDate);
  };

  const handleDateInputChange = (event) => {
    const value = event.target.value;
    const parsedDate = convertToGregorianYear(value);
    if (isValid(parsedDate)) {
      setStartDate(parsedDate);
      const formattedDate = convertToROCYear(parsedDate);
      setDisplayDate(formattedDate);
      onChange(formattedDate);
    }
  };

  // 自訂標頭
  const CustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const years = eachYearOfInterval({
      start: new Date(1990, 0, 1),
      end: new Date(getYear(new Date()) + 1, 0, 1),
    }).map((d) => getYear(d));

    const months = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];

    return (
      <div style={{ margin: 10, display: "flex", justifyContent: "center" }}>
        <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
          {"<"}
        </button>
        <select
          value={getYear(date)}
          onChange={({ target: { value } }) => changeYear(value)}
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={months[getMonth(date)]}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
          {">"}
        </button>
      </div>
    );
  };

  return (
    <div className="form-group">
      <DatePicker
        name={name}
        selected={startDate}
        onChange={handleDateChange}
        locale={zhTW}
        dateFormat="yyyy/MM/dd"
        className={`form-control`}
        onChangeRaw={handleDateInputChange}
        value={displayDate}
        placeholderText="年/月/日"
        showYearDropdown={true}
        showMonthDropdown={true}
        todayButton={"選擇本日"}
        readOnly={readOnly}
        //renderCustomHeader={CustomHeader} // 使用自訂標頭
      />
    </div>
  );
};

export default MyDatePicker;
