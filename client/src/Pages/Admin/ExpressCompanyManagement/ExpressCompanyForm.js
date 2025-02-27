import React, { useState, useEffect } from "react";
import clientAPI from "../../../client-api/rest-client"; // Ensure correct path

const ExpressCompanyForm = ({ selectedCompany, onRefresh }) => {
  const [companyData, setCompanyData] = useState({
    idCompany: "",
    nameOfCompany: "",
    phone: "",
    email: "",
    address: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedCompany) {
      setCompanyData(selectedCompany);
    } else {
      resetForm();
    }
  }, [selectedCompany]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    // Kiểm tra đầu vào hợp lệ
    if (!companyData.idCompany || !companyData.email || !companyData.address) {
      setError("Please fill in all required fields!");
      return;
    }

    try {
      const response = await clientAPI.service("expressCompany").create(companyData);
      console.log("New company created successfully:", response);

      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error adding company:", error.response ? error.response.data : error.message);
      setError("An error occurred while adding the company!");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!companyData.idCompany || !companyData.email || !companyData.address) {
      setError("Please fill in all required fields!");
      return;
    }

    try {
      const response = await clientAPI
        .service("expressCompany")
        .patch(selectedCompany._id, companyData);
      console.log("Company updated successfully:", response);

      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating company:", error.response ? error.response.data : error.message);
      setError("An error occurred while updating the company!");
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany || !selectedCompany._id) return;

    try {
      await clientAPI.service("expressCompany").remove(selectedCompany._id);
      console.log("Company deleted successfully");
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting company:", error.response ? error.response.data : error.message);
      setError("An error occurred while deleting the company!");
    }
  };

  const resetForm = () => {
    setCompanyData({
      idCompany: "",
      nameOfCompany: "",
      phone: "",
      email: "",
      address: "",
    });
    setError("");
  };

  return (
    <div className="express-company-form p-4 bg-white border ml-4 h-full flex flex-col">
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex-grow">
        {[
          { label: "ID Công Ty", type: "text", name: "idCompany", required: true },
          { label: "Tên Công Ty", type: "text", name: "nameOfCompany" },
          { label: "Số Điện Thoại", type: "text", name: "phone" },
          { label: "Email", type: "email", name: "email", required: true },
          { label: "Địa Chỉ", type: "text", name: "address", required: true },
        ].map(({ label, type, ...inputProps }, index) => (
          <div key={index} className="mb-3">
            <label className="block mb-1 text-sm">{label}</label>
            <input
              type={type}
              {...inputProps}
              className="border py-1 px-2 w-full"
              onChange={handleChange}
              value={companyData[inputProps.name] || ""}
            />
          </div>
        ))}
        <div className="flex space-x-4 mt-4">
          {[
            { label: "Thêm", onClick: handleAdd, color: "yellow-500" ,disabled: !!selectedCompany },
            { label: "Sửa", onClick: handleUpdate, color: "green-500", disabled: !selectedCompany || !selectedCompany._id },
            { label: "Xóa", onClick: handleDelete, color: "red-500", disabled: !selectedCompany || !selectedCompany._id },
            { label: "Làm mới", onClick: () => { resetForm(); if (onRefresh) onRefresh(); }, color: "blue-500" },
          ].map(({ label, onClick, color, disabled }, idx) => (
            <button
              key={idx}
              type="button"
              onClick={onClick}
              className={`bg-${color} text-white px-3 py-1 text-sm rounded ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={disabled}
            >
              {label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default ExpressCompanyForm;
