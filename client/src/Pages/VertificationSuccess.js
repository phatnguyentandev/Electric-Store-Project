import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const VerificationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Hiển thị thông báo thành công hoặc thực hiện các bước tiếp theo
    // alert("Your account has been successfully verified!");
    // Chuyển hướng người dùng đến trang đăng nhập hoặc trang chính
    navigate("/login");
  }, [navigate]);

  return (
    <div>
      <h2>Verification Success</h2>
      <p>Your account has been verified successfully!</p>
    </div>
  );
};

export default VerificationSuccess;
