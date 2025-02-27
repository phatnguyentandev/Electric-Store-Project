import React, { useState } from "react";
import clientAPI from "../../client-api/rest-client";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); // Clear messages before a new request
    setErrorMessage("");

    // Kiểm tra xem mật khẩu mới và xác nhận có khớp không
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      // Gửi yêu cầu đến server để thay đổi mật khẩu
      const response = await clientAPI
        .service("services")
        .patch("change-password", { oldPassword, newPassword });

      if (response.success) {
        setSuccessMessage("Mật khẩu của bạn đã được thay đổi thành công.");

        // Reset các giá trị input
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");

        // Xóa thông tin người dùng và token khỏi localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("userToken");

        // Chờ 2 giây trước khi chuyển tới trang login
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage("Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin và thử lại.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="oldPassword" className="sr-only">
              Mật khẩu cũ
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Mật khẩu cũ"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="sr-only">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmNewPassword" className="sr-only">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
