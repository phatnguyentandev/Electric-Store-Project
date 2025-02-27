import React, { useState, useEffect } from "react";
import clientAPI from "../../client-api/rest-client";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dfsxqmwkz/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "Upload_image"; // Thay bằng preset thực tế của bạn

const InfoUser = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    photo: "", // URL ảnh lưu từ Cloudinary
  });

  const [previewImage, setPreviewImage] = useState(null); // Ảnh preview
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.idUser;
    const role = user.data.role === "staff" ? "staff" : "user";

    const fetchUserInfo = async () => {
      try {
        const data = await clientAPI.service(role).get(userId);
        setUserInfo(data.data); // Cập nhật thông tin user từ API
        setPreviewImage(data.data.photo); // Hiển thị ảnh nếu có
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          setUserInfo((prevState) => ({
            ...prevState,
            photo: data.secure_url, // Lưu URL ảnh từ Cloudinary
          }));
          setPreviewImage(data.secure_url); // Hiển thị ảnh preview
        } else {
          setError("Ảnh không thể tải lên Cloudinary!");
        }
      } catch (error) {
        console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
        setError("Lỗi khi tải ảnh lên!");
      }
    }
  };

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user.data.role === "staff" ? "staff" : "user";

    try {
      await clientAPI.service(role).patch(user.idUser, userInfo);
      window.alert("Thông tin người dùng đã được lưu thành công!"); // Thông báo thành công
    } catch (error) {
      console.error("Error saving user information:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">THÔNG TIN CÁ NHÂN</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 flex justify-center items-center">
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="object-cover w-full h-full" />
          ) : (
            <span className="text-gray-400">Chưa có ảnh</span>
          )}
        </div>
        <label
          htmlFor="photo"
          className="mt-2 text-blue-500 cursor-pointer hover:underline"
        >
          Chọn ảnh
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Form Fields */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Họ và tên
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={userInfo.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
          Giới tính
        </label>
        <select
          id="gender"
          name="gender"
          value={userInfo.gender}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Số điện thoại
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          value={userInfo.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={userInfo.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
          Địa chỉ
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={userInfo.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
      >
        Lưu
      </button>
    </div>
  );
};

export default InfoUser;
