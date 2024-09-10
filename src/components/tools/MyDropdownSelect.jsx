import React from "react";

const MyDropdownSelect = ({
  name,
  value,
  onChange,
  options,
  loading,
  error,
  option_key,
  option_value,
  invalid,
}) => {
  return (
    <div className="form-group">
      <label>{name}</label>
      <select
        className={`form-control ${invalid ? "is-invalid" : ""}`}
        name={name}
        value={value || ""}
        onChange={onChange}
      >
        <option value="">選擇{name}</option>
        {loading && <option>載入中...</option>}
        {error && <option>錯誤: {error}</option>}
        {!loading &&
          options.map((option) => (
            <option key={option[option_key]} value={option[option_value]}>
              {option.名稱}
            </option>
          ))}
      </select>
      {invalid && <div className="invalid-feedback">請選擇{name}</div>}
    </div>
  );
};

export default MyDropdownSelect;
