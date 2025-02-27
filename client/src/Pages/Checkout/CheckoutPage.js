import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clientAPI from "../../client-api/rest-client";
import axios from "axios";

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedItems = location.state?.selectedItems || [];

    // Form fields
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Bank");

    // Dropdown data
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    // Error states
    const [error, setError] = useState("");

    // Fetch provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://provinces.open-api.vn/api/p");
                setProvinces(response.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch districts based on province
    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedProvince) {
                try {
                    const response = await axios.get("https://provinces.open-api.vn/api/d/");
                    const filteredDistricts = response.data.filter(
                        (district) => String(district.province_code) === String(selectedProvince)
                    );
                    setDistricts(filteredDistricts);
                } catch (error) {
                    console.error("Error fetching districts:", error);
                }
            } else {
                setDistricts([]);
            }
        };
        fetchDistricts();
    }, [selectedProvince]);

    // Fetch wards based on district
    useEffect(() => {
        const fetchWards = async () => {
            if (selectedDistrict) {
                try {
                    const response = await axios.get("https://provinces.open-api.vn/api/w/");
                    const filteredWards = response.data.filter(
                        (ward) => String(ward.district_code) === String(selectedDistrict)
                    );
                    setWards(filteredWards);
                } catch (error) {
                    console.error("Error fetching wards:", error);
                }
            } else {
                setWards([]);
            }
        };
        fetchWards();
    }, [selectedDistrict]);

    const calculateTotalPrice = () => {
        return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const validateInputs = () => {
        if (!name.trim()) return "Tên không được để trống.";
        if (!phoneNumber.trim() || !/^\d{10,11}$/.test(phoneNumber))
            return "Số điện thoại không hợp lệ. (10-11 chữ số)";
        if (!shippingAddress.trim()) return "Địa chỉ giao hàng không được để trống.";
        if (!selectedProvince) return "Vui lòng chọn tỉnh/thành phố.";
        if (!selectedDistrict) return "Vui lòng chọn quận/huyện.";
        if (!selectedWard) return "Vui lòng chọn xã/phường.";
        return "";
    };

    const handleCheckoutSubmit = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(""); // Clear any existing errors

        const provinceName = provinces.find((p) => String(p.code) === String(selectedProvince))?.name || "";
        const districtName = districts.find((d) => String(d.code) === String(selectedDistrict))?.name || "";
        const wardName = wards.find((w) => String(w.code) === String(selectedWard))?.name || "";

        const fullShippingAddress = `${shippingAddress}, ${wardName}, ${districtName}, ${provinceName}`;

        const checkOutData = {
            nameOfCustomer: name,
            phone: phoneNumber,
            address: fullShippingAddress,
            payment_method: paymentMethod,
            products: selectedItems,
        };

        try {
            const data = await clientAPI.service("order").create(checkOutData);
            if (paymentMethod === "Cod") {
                navigate(`/order-pending/${data.data._id}`, { state: { orderId: data.data._id } });
            } else if (paymentMethod === "Bank") {
                navigate("/bank-transfer-qr-code", { state: { linkPayment: data.data.linkPayment } });
            } else {
                window.alert("Thanh toán thành công!");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi đặt hàng.";
            setError(errorMessage);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4">
            <h2 className="text-gray-900 text-2xl font-bold mb-4">Thanh toán</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Tên:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Nhập tên của bạn"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Số điện thoại:</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Nhập số điện thoại của bạn"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Tỉnh/Thành phố:</label>
                <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                            {province.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Quận/Huyện:</label>
                <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                            {district.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Xã/Phường:</label>
                <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                    <option value="">Chọn xã/phường</option>
                    {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                            {ward.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Địa chỉ giao hàng:</label>
                <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="Nhập địa chỉ của bạn"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Phương thức thanh toán:</label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                    <option value="Bank">Chuyển khoản ngân hàng</option>
                    <option value="Cod">Thanh toán khi nhận hàng (COD)</option>
                </select>
            </div>

            <div className="mb-4">
                <h3 className="font-bold text-gray-900">Danh sách sản phẩm:</h3>
                <ul className="list-disc pl-5">
                    {selectedItems.map((item, index) => (
                        <li key={index} className="text-gray-700">
                            {item.nameOfProduct} - Số lượng: {item.quantity} - Giá: {(item.price * item.quantity).toLocaleString()} VND
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-4">
                <h3 className="font-bold text-gray-900">
                    Tổng tiền: {calculateTotalPrice().toLocaleString()} VND
                </h3>
            </div>

            <button
                onClick={handleCheckoutSubmit}
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            >
                Đặt hàng
            </button>
        </div>
    );
};

export default CheckoutPage;
