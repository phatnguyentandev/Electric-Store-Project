import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios"; // Đảm bảo axios được import đúng cách

const getShortenedLink = async (longUrl) => {
    try {
        // Gửi yêu cầu tới TinyURL để rút gọn URL
        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${longUrl}`);
        return response.data; // Trả về URL ngắn gọn
    } catch (error) {
        console.error('Error shortening URL:', error);
        return longUrl; // Trả lại URL gốc nếu có lỗi
    }
};
const BankTransferQRCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [shortLink, setShortLink] = useState(""); // State để lưu trữ link rút gọn

  const linkPayment = location.state?.linkPayment || ""; // Link URL for payment

  useEffect(() => {
    // Chạy hàm bất đồng bộ để lấy link rút gọn
    const fetchShortenedLink = async () => {
      const shortened = await getShortenedLink(linkPayment);
      setShortLink(shortened); // Cập nhật state với link rút gọn
    };

    if (linkPayment) {
      fetchShortenedLink();
    }
  }, [linkPayment]); // Chạy lại khi linkPayment thay đổi

  const handleReturnToCheckout = () => {
    navigate("/CheckoutPage");
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Chuyển khoản ngân hàng</h1>
      <p className="text-gray-700 mb-4">Vui lòng quét mã QR dưới đây để thanh toán.</p>

      {/* Generate QR code from shortLink */}
      {shortLink && (
        <QRCodeCanvas
          value={shortLink} // Convert shortLink into QR code
          size={256} // Increase QR code size for better scanning
          level="L" // Set error correction level to "L" for maximum data capacity
          className="mx-auto mb-6"
        />
      )}

      <p className="text-gray-500 mb-6">
        Sau khi thanh toán, vui lòng quay lại để hoàn tất đơn hàng.
      </p>

      <button
        onClick={handleReturnToCheckout}
        className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
      >
        Quay lại trang thanh toán
      </button>
    </div>
  );
};

export default BankTransferQRCode;
