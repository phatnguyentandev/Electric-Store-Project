import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',  // URL gốc cho API
    timeout: 100000,  // Giới hạn thời gian chờ,
    withCredentials: true,  // Gửi cookie khi gọi API từ domain khác
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // Thêm token hoặc các headers khác ở đây nếu cần
    }
});
export default axiosInstance;