import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Sửa lại thành named imports
import clientAPI from "./client-api/rest-client";

let userToken = localStorage.getItem("userToken");

const refreshUserToken = async () => {
    try {
      const response = await clientAPI.service('auth/refresh-token').create({});
      
      // Kiểm tra xem response có chứa accessToken không
      if (response && response.accessToken) {
        const newAccessToken = response.accessToken;
  
        // Lưu lại accessToken vào localStorage
        localStorage.setItem("userToken", newAccessToken);
  
        // Cập nhật user trong localStorage (bao gồm cả accessToken mới)
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          storedUser.accessToken = newAccessToken;  // Cập nhật accessToken vào user
          localStorage.setItem("user", JSON.stringify(storedUser));  // Lưu lại user mới
        }
  
        console.log("New access token:", newAccessToken);
      } else {
        console.error("Không tìm thấy accessToken trong phản hồi");
      }
    } catch (error) {
      console.error("Làm mới token thất bại:", error);
    }
  };

export const monitorToken = () => {
  setInterval(() => {
    if (!userToken) return;

    const decodedToken = jwtDecode(userToken); // Đúng cú pháp
    const currentTime = Date.now() / 1000;
    refreshUserToken();
    if (decodedToken.exp - currentTime < 120) {
      refreshUserToken();
    }
  }, 60000);
};
