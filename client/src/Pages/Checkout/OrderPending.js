import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const OrderPending = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderIdParams } = useParams(); // Lấy orderId từ params
    const stateOrderId = location.state?.orderId; // Lấy orderId từ state
    // Ưu tiên lấy orderId từ state, nếu không có thì lấy từ params
    const orderId = stateOrderId || orderIdParams || "Không xác định";

    const handleReturnToHome = () => {
        navigate("/"); // Điều hướng trở về trang chủ
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Đơn hàng đang chờ xử lý</h1>
            <p className="text-gray-700 mb-4">Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đang được xử lý.</p>
            
            {orderId && (
                <p className="text-gray-500 mb-6">
                    Mã đơn hàng: <span className="font-semibold">{orderId}</span>
                </p>
            )}

            <p className="text-gray-700 mb-6">
                Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng và thời gian giao hàng.
            </p>

            <button
                onClick={handleReturnToHome}
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
            >
                Quay lại trang chủ
            </button>
        </div>
    );
};

export default OrderPending;
