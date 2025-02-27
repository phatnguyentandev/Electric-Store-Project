import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client'; // Ensure the path is correct

const WarehouseForm = ({ selectedWarehouse, onRefresh }) => {
  const [warehouse, setWarehouse] = useState({
    idProduct: '',
    nameOfProduct: '',
    quantity: 0,
    idProvider: '',
    nameOfProvider: '',
  });

  const [providers, setProviders] = useState([]);
  const [error, setError] = useState('');

  // Fetch providers on component mount
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

    if (selectedWarehouse) {
      setWarehouse(selectedWarehouse);
    } else {
      resetForm();
    }
  }, [selectedWarehouse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouse((prevWarehouse) => ({
      ...prevWarehouse,
      [name]: value,
    }));
    setError('');

    if (name === 'idProvider') {
      // Find the selected provider and update the nameOfProvider
      const selectedProvider = providers.find(provider => provider.idProvider === value);
      setWarehouse((prevWarehouse) => ({
        ...prevWarehouse,
        nameOfProvider: selectedProvider ? selectedProvider.nameOfProvider : '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!warehouse.idProduct || !warehouse.nameOfProduct || warehouse.quantity < 0 || !warehouse.idProvider) {
      setError('Vui lòng điền đầy đủ thông tin kho!');
      return;
    }

    try {
      const response = selectedWarehouse
        ? await clientAPI.service('warehouse').patch(selectedWarehouse.idProduct, warehouse)
        : await clientAPI.service('warehouse').create(warehouse);
      console.log('Kho đã được', selectedWarehouse ? 'cập nhật' : 'thêm', 'thành công:', response);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật kho:', error.response ? error.response.data : error.message);
      setError('Có lỗi xảy ra khi thêm/cập nhật kho!');
    }
  };

  const handleDelete = async () => {
    if (!selectedWarehouse) return;
    try {
      await clientAPI.service('warehouse').remove(selectedWarehouse.idProduct);
      console.log('Kho đã được xóa thành công');
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Lỗi khi xóa kho:', error.response ? error.response.data : error.message);
      setError('Có lỗi xảy ra khi xóa kho!');
    }
  };

  const resetForm = () => {
    setWarehouse({
      idProduct: '',
      nameOfProduct: '',
      quantity: 0,
      idProvider: '',
      nameOfProvider: '',
    });
    setError('');
  };

  return (
    <div className="warehouse-form p-4 bg-white border ml-4 h-full flex flex-col">
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex-grow">
        {[
          { label: 'ID Sản Phẩm', type: 'text', name: 'idProduct', disabled: !!selectedWarehouse },
          { label: 'Tên Sản Phẩm', type: 'text', name: 'nameOfProduct' },
          { label: 'Số Lượng', type: 'number', name: 'quantity', min: 0 },
          {
            label: 'Nhà Cung Cấp', 
            type: 'select', 
            name: 'idProvider', 
            options: providers.map(provider => ({ value: provider.idProvider, label: provider.idProvider }))
          },
          { label: 'Tên Nhà Cung Cấp', type: 'text', name: 'nameOfProvider', disabled: true }
        ].map(({ label, type, options, ...inputProps }, index) => (
          <div key={index} className="mb-3">
            <label className="block mb-1 text-sm">{label}</label>
            {type === 'select' ? (
              <select {...inputProps} className="border py-1 px-2 w-full" onChange={handleChange} value={warehouse[inputProps.name] || ''}>
                <option value="">{`Chọn ${label.toLowerCase()}`}</option>
                {options?.map((opt, idx) => (
                  <option key={idx} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                {...inputProps}
                value={warehouse[inputProps.name] || ''}
                onChange={handleChange}
                className="border py-2 px-3 w-full"
              />
            )}
          </div>
        ))}
  
        <div className="flex space-x-4 mt-4">
          {[
            { label: 'Thêm', onClick: handleSubmit, color: 'yellow-500', disabled: !!selectedWarehouse },
            { label: 'Sửa', onClick: handleSubmit, color: 'green-500', disabled: !selectedWarehouse },
            { label: 'Xóa', onClick: handleDelete, color: 'red-500', disabled: !selectedWarehouse },
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

export default WarehouseForm;
