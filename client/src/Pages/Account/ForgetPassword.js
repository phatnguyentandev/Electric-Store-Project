import React, { useState } from "react";
import clientAPI from "../../client-api/rest-client";

const ForgetPassWord = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); // Clear messages before a new request
    setErrorMessage("");
    try {
      // Send request to the server to initiate the forgot-password process
      const response = await clientAPI.service('services/forgot-password').create({email});

      if (response.status==="success") {
        setSuccessMessage("Một email khôi phục mật khẩu đã được gửi đến hòm thư của bạn.");
      } else {
        setErrorMessage("Có lỗi xảy ra. Vui lòng kiểm tra lại email và thử lại.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Quên mật khẩu</h2>
        <p className="text-center mb-6">
          Hãy nhập email của bạn để lấy lại mật khẩu
        </p>
        <form onSubmit={handleSubmit}> {/* Wrap elements in a form */}
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
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
            Lấy lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassWord;
