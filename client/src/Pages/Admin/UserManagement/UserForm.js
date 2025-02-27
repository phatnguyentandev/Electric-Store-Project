import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client'; // Ensure this path is correct

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dfsxqmwkz/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "Upload_image"; // Replace with your actual preset

const UserForm = ({ selectedUser, onRefresh }) => {
  const [user, setUser] = useState({
    _id: '', // Change idAccount to _id
    name: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    photo: '', // Holds Cloudinary image URL
    role: '',
  });

  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null); // For image preview

  useEffect(() => {
    if (selectedUser) {
      setUser({
        _id: selectedUser._id,
        name: selectedUser.name,
        gender: selectedUser.gender,
        phone: selectedUser.phone,
        email: selectedUser.email,
        address: selectedUser.address,
        photo: selectedUser.photo, // Lưu ảnh từ user đã chọn
        role: selectedUser.role,
      });
      setPreviewImage(selectedUser.photo); // Hiển thị ảnh đã lưu nếu có
    } else {
      resetForm();
    }
  }, [selectedUser]);
  
  // Đảm bảo ảnh preview được cập nhật đúng URL từ Cloudinary
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
          setUser((prevUser) => ({
            ...prevUser,
            photo: data.secure_url, // Lưu ảnh từ Cloudinary
          }));
          setPreviewImage(data.secure_url); // Cập nhật ảnh preview
        } else {
          setError('Ảnh không thể tải lên Cloudinary!');
        }
      } catch (error) {
        console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
        setError('Lỗi khi tải ảnh lên!');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let targetService = '';
    // Log dữ liệu để kiểm tra trước khi gửi
    console.log("User Data to Submit:", user);
    
    // Kiểm tra các trường bắt buộc
    if (!user.name || !user.email) {
      setError('Please fill in all required fields!');
      return;
    }
    if(user.role === 'staff'){
      targetService = 'staff';
    }
    else {targetService = 'user';}
  
    try {
      let response;
      const userDataWithoutId = { ...user };
      delete userDataWithoutId._id; // Loại bỏ _id khỏi dữ liệu gửi
      // Phân biệt theo role
      console.log(targetService);
      if (selectedUser && selectedUser._id) {
        // Nếu đang sửa, gửi yêu cầu cập nhật
        response = await clientAPI.service(targetService).patch(selectedUser._id, userDataWithoutId);
        console.log(`${targetService} updated successfully:`, response);
      } else {
        // Nếu đang tạo mới, gửi yêu cầu tạo
        response = await clientAPI.service(targetService).create(userDataWithoutId);
        console.log(`New ${targetService} created successfully:`, response);
      }
  
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error adding/updating user:', error.response ? error.response.data : error.message);
      setError('An error occurred while adding/updating the user!');
    }
  };
  
  

  const resetForm = () => {
    setUser({
      _id: '', 
      name: '',
      gender: 'Male',
      phone: '',
      email: '',
      address: '',
      photo: '', // Reset photo field
      role:'',
    });
    setPreviewImage(null);
    setError('');
  };

  

  return (
    <div className="user-form p-4 bg-white border ml-4 h-full flex flex-col">
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex-grow">
        {/* Dynamic form fields */}
        {[
          { label: 'Tên', type: 'text', name: 'name' }
        ].map(({ label, type, ...inputProps }, index) => (
          <div key={index} className="mb-3">
            <label className="block mb-1 text-sm">{label}</label>
            <input
              type={type}
              {...inputProps}
              value={user[inputProps.name] || ''}
              onChange={handleChange}
              className="border py-1 px-2 w-full"
            />
          </div>
        ))}
  
        {/* Gender field with dropdown */}
        <div className="mb-3">
          <label className="block mb-1 text-sm">Giới tính</label>
          <select
            name="gender"
            value={user.gender || ''}
            onChange={handleChange}
            className="border py-1 px-2 w-full"
          >
            <option value="">Chọn giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
        </div>
  
        {[
          { label: 'Số điện thoại', type: 'text', name: 'phone' },
          { label: 'Email', type: 'email', name: 'email' },
          { label: 'Địa chỉ', type: 'text', name: 'address' }
        ].map(({ label, type, ...inputProps }, index) => (
          <div key={index} className="mb-3">
            <label className="block mb-1 text-sm">{label}</label>
            <input
              type={type}
              {...inputProps}
              value={user[inputProps.name] || ''}
              onChange={handleChange}
              className="border py-1 px-2 w-full"
            />
          </div>
        ))}
  
        {/* File input for photo */}
        <div className="mb-3">
          <label className="block mb-1 text-sm">Ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border py-1 px-2 w-full"
          />
        </div>
  
        {/* Image preview with frame */}
        <div className="mb-3 flex justify-center items-center">
          <div className="w-32 h-32 bg-gray-200 flex justify-center items-center border border-dashed border-gray-400">
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600">Không có ảnh</span>
            )}
          </div>
        </div>
  
        {/* Button actions */}
        <div className="flex justify-center space-x-4 mt-4">
          {[
            { label: 'Sửa', onClick: handleSubmit, color: 'green-500', disabled: !selectedUser },
            { label: 'Làm mới', onClick: () => { resetForm(); onRefresh(); }, color: 'blue-500' },
          ].map(({ label, onClick, color, disabled }, idx) => (
            <button
              key={idx}
              type="button"
              onClick={onClick}
              className={`bg-${color} text-white px-4 py-2 text-sm font-medium rounded-md w-32 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={disabled}
            >
              {label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );  
};

export default UserForm;
