import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client'; // Ensure correct path

const ImportForm = ({ selectedImport, onRefresh }) => {
  const [importData, setImportData] = useState({
    idProduct: '',
    nameOfProduct: '',
    quantity: 0,
    priceImport: 0,
    idProvider: '',
    nameOfProvider: '' // Added to store the provider name
  });

  const [providers, setProviders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await clientAPI.service('provider').find();
        setProviders(response.data);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setError('Error fetching providers, please try again later.');
      }
    };

    fetchProviders();

    if (selectedImport) {
      setImportData(selectedImport);
    } else {
      resetForm();
    }
  }, [selectedImport]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'idProvider') {
      const selectedProvider = providers.find((provider) => provider.idProvider === value);
      setImportData((prevData) => ({
        ...prevData,
        idProvider: value,
        nameOfProvider: selectedProvider ? selectedProvider.nameOfProvider : '' // Update nameOfProvider based on selected idProvider
      }));
    } else {
      setImportData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    setError('');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
  
    // Kiểm tra đầu vào hợp lệ
    if (!importData.idProduct || !importData.nameOfProduct || importData.quantity < 0 || importData.priceImport < 0 || !importData.idProvider) {
      setError('Please fill in all required fields!');
      return;
    }
  
    try {
      // Loại bỏ idImport trước khi gửi yêu cầu
      const importDataWithoutIdImport = { ...importData };
      delete importDataWithoutIdImport.idImport;
  
      // Gửi yêu cầu tạo mới
      const response = await clientAPI.service('import').create(importDataWithoutIdImport);
      console.log('New import created successfully:', response);
  
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error adding import:', error.response ? error.response.data : error.message);
      setError('An error occurred while adding the import!');
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    // Kiểm tra đầu vào hợp lệ
    if (!importData.idProduct || !importData.nameOfProduct || importData.quantity < 0 || importData.priceImport < 0 || !importData.idProvider) {
      setError('Please fill in all required fields!');
      return;
    }
  
    try {
      // Loại bỏ idImport trước khi gửi yêu cầu
      const importDataWithoutIdImport = { ...importData };
      delete importDataWithoutIdImport.idImport;
  
      // Gửi yêu cầu cập nhật
      const response = await clientAPI.service('import').patch(selectedImport._id, importDataWithoutIdImport);
      console.log('Import updated successfully:', response);
  
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating import:', error.response ? error.response.data : error.message);
      setError('An error occurred while updating the import!');
    }
  };  

  const handleDelete = async () => {
    if (!selectedImport || !selectedImport._id) return;

    try {
      await clientAPI.service('import').remove(selectedImport._id);
      console.log('Import deleted successfully');
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting import:', error.response ? error.response.data : error.message);
      setError('An error occurred while deleting the import!');
    }
  };

  const resetForm = () => {
    setImportData({
      idProduct: '',
      nameOfProduct: '',
      quantity: 0,
      priceImport: 0,
      idProvider: '',
      nameOfProvider: ''
    });
    setError('');
  };

  return (
    <div className="import-form p-4 bg-white border ml-4 h-full flex flex-col">
      {error && <p className="text-red-500">{error}</p>}
      <form className="flex-grow">
        {[
          { label: 'ID Sản Phẩm', type: 'text', name: 'idProduct', required: true },
          { label: 'Tên Sản Phẩm', type: 'text', name: 'nameOfProduct', required: true },
          { label: 'Số Lượng', type: 'number', name: 'quantity', min: 0, required: true },
          { label: 'Giá Nhập Khẩu', type: 'number', name: 'priceImport', min: 0, required: true },
          { label: 'Nhà Cung Cấp', type: 'select', name: 'idProvider', required: true, options: providers.map((provider) => ({ value: provider.idProvider, label: provider.idProvider })) },
          { label: 'Tên Nhà Cung Cấp', type: 'text', name: 'nameOfProvider', disabled: true }
        ].map(({ label, type, options, ...inputProps }, index) => (
          <div key={index} className="mb-3">
            <label className="block mb-1 text-sm">{label}</label>
            {type === 'select' ? (
              <select {...inputProps} className="border py-1 px-2 w-full" value={importData[inputProps.name] || ''} onChange={handleChange}>
                <option value="">{`Chọn ${label.toLowerCase()}`}</option>
                {options?.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input type={type} {...inputProps} className="border py-1 px-2 w-full" onChange={handleChange} value={importData[inputProps.name] || ''} />
            )}
          </div>
        ))}
        <div className="flex space-x-4 mt-4">
          {[
            { label: 'Thêm', onClick: handleAdd, color: 'yellow-500' },
            { label: 'Sửa', onClick: handleUpdate, color: 'green-500', disabled: !selectedImport || !selectedImport._id },
            { label: 'Xóa', onClick: handleDelete, color: 'red-500', disabled: !selectedImport || !selectedImport._id },
            { label: 'Làm mới', onClick: () => { resetForm(); if (onRefresh) onRefresh(); }, color: 'blue-500' }
          ].map(({ label, onClick, color, disabled }, idx) => (
            <button key={idx} type="button" onClick={onClick} className={`bg-${color} text-white px-3 py-1 text-sm rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={disabled}>
              {label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default ImportForm;
