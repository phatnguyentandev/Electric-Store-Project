import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client'; // Đảm bảo đường dẫn chính xác

const ProviderForm = ({ selectedProvider, onRefresh }) => {
  const [provider, setProvider] = useState({
    idProvider: '',
    nameOfProvider: '',
    phone: '',
    address: '',
    gmail: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedProvider) {
      setProvider({
        idProvider: selectedProvider.idProvider,
        nameOfProvider: selectedProvider.nameOfProvider,
        phone: selectedProvider.phone,
        address: selectedProvider.address,
        gmail: selectedProvider.gmail,
      });
    } else {
      resetForm();
    }
  }, [selectedProvider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProvider((prevProvider) => ({
      ...prevProvider,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!provider.idProvider || !provider.nameOfProvider || !provider.phone) {
      setError('Vui lòng điền đầy đủ thông tin nhà cung cấp!');
      return;
    }

    try {
      const response = selectedProvider
        ? await clientAPI.patch(provider.idProvider, provider)
        : await clientAPI.create(provider);
      console.log('Nhà cung cấp đã được', selectedProvider ? 'cập nhật' : 'thêm', 'thành công:', response);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật nhà cung cấp:', error.response ? error.response.data : error.message);
      setError('Có lỗi xảy ra khi thêm/cập nhật nhà cung cấp!');
    }
};


  const handleDelete = async () => {
    if (!selectedProvider) return;
    try {
      await clientAPI.remove(provider.idProvider);
      console.log('Nhà cung cấp đã được xóa thành công');
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Lỗi khi xóa nhà cung cấp:', error.response ? error.response.data : error.message);
      setError('Có lỗi xảy ra khi xóa nhà cung cấp!');
    }
  };

  const resetForm = () => {
    setProvider({
      idProvider: '',
      nameOfProvider: '',
      phone: '',
      address: '',
      gmail: '',
    });
    setError('');
  };

  return (
    <div className="provider-form p-4 bg-white border ml-4 h-full flex flex-col">
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex-grow">
        {[
          { label: 'ID Nhà Cung Cấp', type: 'text', name: 'idProvider', disabled: !!selectedProvider },
          { label: 'Tên Nhà Cung Cấp', type: 'text', name: 'nameOfProvider' },
          { label: 'Số Điện Thoại', type: 'text', name: 'phone' },
          { label: 'Địa Chỉ', type: 'text', name: 'address' },
          { label: 'Gmail', type: 'email', name: 'gmail' }
        ].map(({ label, type, ...inputProps }, index) => (
          <div key={index} className="mb-3">
            <label className="block mb-1 text-sm">{label}</label>
            <input
              type={type}
              {...inputProps}
              value={provider[inputProps.name] || ''}
              onChange={handleChange}
              className="border py-1 px-2 w-full"
            />
          </div>
        ))}
  
        <div className="flex space-x-4 mt-4">
          {[
            { label: 'Thêm', onClick: handleSubmit, color: 'yellow-500', disabled: !!selectedProvider },
            { label: 'Sửa', onClick: handleSubmit, color: 'green-500', disabled: !selectedProvider },
            { label: 'Xóa', onClick: handleDelete, color: 'red-500', disabled: !selectedProvider },
            { label: 'Làm mới', onClick: () => { resetForm(); onRefresh(); }, color: 'blue-500' }
          ].map(({ label, onClick, color, disabled }, idx) => (
            <button
              key={idx}
              type="button"
              onClick={onClick}
              className={`bg-${color} text-white px-3 py-1 text-sm rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default ProviderForm;
