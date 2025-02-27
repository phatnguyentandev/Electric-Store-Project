import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';

const ProductForm = ({ selectedProduct, onRefresh }) => {
  const [product, setProduct] = useState({
    idProduct: '',
    nameOfProduct: '',
    quantity: 1,
    price: '',
    typeProduct: '',
    image: null,
    status: 'Available',
    description: '',
  });

  const [warehouses, setWarehouses] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false); // Để theo dõi trạng thái upload

  // Fetch warehouse data and populate form if a product is selected
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await clientAPI.service('warehouse').find();
        setWarehouses(response.data);
      } catch (error) {
        console.error('Error fetching warehouse data:', error);
        setError('Error fetching warehouse data');
      }
    };

    fetchWarehouses();

    if (selectedProduct) {
      setProduct({
        idProduct: selectedProduct.idProduct || '',
        nameOfProduct: selectedProduct.nameOfProduct || '',
        quantity: selectedProduct.quantity || 1,
        price: selectedProduct.price || '',
        typeProduct: selectedProduct.typeProduct || '',
        image: selectedProduct.image || null,
        status: selectedProduct.status || 'Available',
        description: selectedProduct.description || '',
      });
      setImagePreview(selectedProduct.image ? selectedProduct.image : null);
    } else {
      resetForm();
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
    setError('');
  };

  const handleProductChange = (e) => {
    const selectedId = e.target.value;
    const selectedWarehouse = warehouses.find((item) => item.idProduct === selectedId);
    if (selectedWarehouse) {
      setProduct({
        idProduct: selectedWarehouse.idProduct || '',
        nameOfProduct: selectedWarehouse.nameOfProduct || '',
        quantity: selectedWarehouse.quantity || 0,
        price: selectedWarehouse.price || '',
        typeProduct: selectedWarehouse.typeProduct || '',
        image: selectedWarehouse.image || null,
        status: selectedWarehouse.status || 'Available',
        description: selectedWarehouse.description || '',
      });
      setImagePreview(selectedWarehouse.image || null);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      setError('No file selected for upload.');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Upload_image'); // Preset name
    formData.append('cloud_name', 'dfsxqmwkz'); // Cloudinary cloud name

    try {
      setUploading(true);
      const response = await fetch('https://api.cloudinary.com/v1_1/dfsxqmwkz/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setUploading(false);
      if (data.secure_url) {
        return data.secure_url; // Trả về URL của ảnh đã upload
      } else {
        setError('Failed to upload image to Cloudinary.');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      setError('Error uploading image.');
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.nameOfProduct || product.quantity <= 0 || !product.price || !product.typeProduct) {
      setError('Vui lòng điền đầy đủ thông tin sản phẩm!');
      return;
    }

    let imageUrl = product.image;
    if (product.image instanceof File) {
      imageUrl = await handleImageUpload(product.image); // Upload ảnh lên Cloudinary
      if (!imageUrl) return; // Dừng nếu upload thất bại
    }

    const productData = {
      ...product,
      image: imageUrl || '', // Sử dụng URL ảnh từ Cloudinary
    };

    try {
      const response = selectedProduct
        ? await clientAPI.service('product').patch(selectedProduct.idProduct, productData)
        : await clientAPI.service('product').create(productData);
      console.log('Sản phẩm đã được', selectedProduct ? 'cập nhật' : 'thêm', 'thành công:', response);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật sản phẩm:', error.response ? error.response.data : error.message);
      setError('Có lỗi xảy ra khi thêm/cập nhật sản phẩm!');
    }
  };

  const resetForm = () => {
    setProduct({
      idProduct: '',
      nameOfProduct: '',
      quantity: 1,
      price: '',
      typeProduct: '',
      image: null,
      status: 'Available',
      description: '',
    });
    setImagePreview(null);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleDelete = async () => {
    if (!selectedProduct || !selectedProduct._id) {
      setError('Không tìm thấy sản phẩm để xóa!');
      return;
    }
  
    try {
      const response = await clientAPI.service('product').remove(selectedProduct._id); // Make sure this ID is correct
      console.log('Sản phẩm đã được xóa thành công:', response);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error.response?.data || error.message);
      setError('Có lỗi xảy ra khi xóa sản phẩm!');
    }
  };
  

  return (
    <div className="product-form p-4 bg-white border ml-4 h-full flex flex-col">
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex-grow">
        <div className="mb-3">
          <label className="block mb-1 text-sm">ID SP</label>
          <select
            name="idProduct"
            value={product.idProduct || ''}
            onChange={handleProductChange}
            className="border py-1 px-2 w-full"
          >
            <option value="">Chọn sản phẩm</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.idProduct} value={warehouse.idProduct}>
                {warehouse.idProduct} - {warehouse.nameOfProduct} ({warehouse.quantity} còn)
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm">Tên sản phẩm</label>
          <input
            type="text"
            name="nameOfProduct"
            value={product.nameOfProduct || ''}
            onChange={handleChange}
            className="border py-1 px-2 w-full"
            disabled
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm">Số lượng</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity || 0}
            onChange={handleChange}
            className="border py-1 px-2 w-full"
            disabled
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm">Giá</label>
          <input
            type="text"
            name="price"
            value={product.price || ''}
            onChange={handleChange}
            className="border py-1 px-2 w-full"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm">Loại sản phẩm</label>
          <select
            name="typeProduct"
            value={product.typeProduct || ''}
            onChange={handleChange}
            className="border py-1 px-2 w-full"
          >
            <option value="">Chọn loại sản phẩm</option>
            <option value="Điện thoại">Điện thoại</option>
            <option value="Máy tính bản">Máy tính bản</option>
            <option value="Camera">Camera</option>
            <option value="Laptop">Laptop</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm">Mô tả sản phẩm</label>
          <textarea
            name="description"
            value={product.description || ''}
            onChange={handleChange}
            className="border py-1 px-2 w-full"
            rows="3"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm">Trạng thái</label>
          <select
            name="status"
            value={product.status || 'Available'}
            onChange={handleChange}
            className="border py-1 px-2 w-full"
          >
            <option value="Available">Còn hàng</option>
            <option value="Not Available">Hết hàng</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm">Hình ảnh</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="border py-1 px-2 w-full" />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover" />}
          {uploading && <p className="text-gray-500">Đang tải ảnh lên...</p>}
        </div>
        <div className="flex space-x-4 mt-4">
        <button
          type="submit"
          className={`bg-yellow-500 text-white px-3 py-1 text-sm rounded}`}
        >
          Thêm
        </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`bg-green-500 text-white px-3 py-1 text-sm rounded ${!product.idProduct ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!product.idProduct}
          >
            Sửa
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
          >
            Đặt lại
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 text-sm rounded"
          >
            Xóa
          </button>
        </div>
      </form>
    </div>
  );  
};

export default ProductForm;
