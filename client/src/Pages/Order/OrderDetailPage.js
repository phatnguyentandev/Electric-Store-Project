import React, { useEffect, useState } from "react";
import clientAPI from "../../client-api/rest-client";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetailPage = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); // Trạng thái lưu vai trò người dùng
    const orderId = useParams().id; // Lấy orderId từ URL
    const navigate = useNavigate();

    // Hàm tải chi tiết đơn hàng
    const loadOrderDetails = async () => {
        try {
            const response = await clientAPI.service("services/order").get(orderId);
            if (response.data) {
                setOrder(response.data);
            } else {
                console.error("No order data found.");
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            window.alert("Error loading order details.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm kiểm tra vai trò người dùng
    const checkUserRole = () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.data.role) {
            setUserRole(storedUser.data.role);
        } else {
            setUserRole(null);
        }
    };

    // Hàm xử lý xuất hóa đơn
    const handleConfirmOrder = async () => {
        try {
            // Gửi yêu cầu xuất hóa đơn qua API
            const response = await clientAPI.service("services/order").patch(orderId);
            if (response.success === true) {
                window.alert("Xác nhận giao hàng thành công!");
                // Có thể thêm logic tải xuống hóa đơn tại đây
            } else {
                window.alert("Không thể xác nhận giao hàng!");
            }
        } catch (error) {
            console.error("Error exporting invoice:", error);
            window.alert("Lỗi khi xuất hóa đơn.");
        }
    };

    useEffect(() => {
        loadOrderDetails();
        checkUserRole();
    }, [orderId]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!order) {
        return <div className="text-center">Order not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <h2 className="text-gray-900 text-3xl font-bold mb-6">Chi tiết đơn hàng #{order._id}</h2>
                <div className="mb-4">
                    <h3 className="text-gray-700 text-xl font-semibold">Thông tin khách hàng</h3>
                    <p><strong>Tên khách hàng:</strong> {order.nameOfCustomer}</p>
                    <p><strong>Điện thoại:</strong> {order.phone}</p>
                    <p><strong>Địa chỉ:</strong> {order.address}</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-gray-700 text-xl font-semibold">Thông tin đơn hàng</h3>
                    <p>
                        <strong>Ngày đặt:</strong>{" "}
                        {new Date(order.dateOrder).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}
                    </p>
                    <p>
                        <strong>Ngày nhận:</strong>{" "}
                        {new Date(order.dateReceived) < new Date(order.dateOrder)
                            ? "Chưa nhận hàng"
                            : new Date(order.dateReceived).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                              })}
                    </p>
                    <p><strong>Phương thức thanh toán:</strong> {order.payment_method}</p>
                    <p><strong>Trạng thái:</strong> {order.status}</p>
                    <p><strong>Tổng tiền:</strong> {order.totalPrice} ₫</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-gray-700 text-xl font-semibold">Danh sách sản phẩm</h3>
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Tên sản phẩm</th>
                                <th className="px-4 py-2 text-left">Số lượng</th>
                                <th className="px-4 py-2 text-left">Đơn giá</th>
                                <th className="px-4 py-2 text-left">Tổng tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.products.map((product, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">{product.nameOfProduct}</td>
                                    <td className="px-4 py-2">{product.quantity}</td>
                                    <td className="px-4 py-2">{product.price} ₫</td>
                                    <td className="px-4 py-2">{product.price * product.quantity} ₫</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {order.linkPayment && (
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/bank-transfer-qr-code", { state: { linkPayment: order.linkPayment } });
                        }}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Thanh toán tại đây
                    </a>
                )}
                <div className="mt-6">
                    {userRole === "staff" && (
                        <button
                            onClick={handleConfirmOrder}
                            className="mr-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                        >
                            Xác nhận đã giao
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (userRole === "staff") {
                                navigate("/orders-staff-page");
                            } else if (userRole === "user" || userRole === "admin") {
                                navigate("/orders-page");
                            } else {
                                window.alert("Không xác định được quyền người dùng.");
                            }
                        }}
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600"
                    >
                        Quay lại danh sách đơn hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
