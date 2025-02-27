import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clientAPI from "../../client-api/rest-client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {token} = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      // Send the new password to the server for reset
      const data = await clientAPI.service('services/reset-password').patch(token, { password, confirmPassword });
      if (data.status === "success") {
        alert("Mật khẩu đã được cập nhật thành công");
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      setErrorMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Thiết lập mật khẩu mới</h2>
        <p className="text-center mb-6">
          Nhập mật khẩu mới của bạn để hoàn tất quá trình đặt lại mật khẩu
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="sr-only">
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="sr-only">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
