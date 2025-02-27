import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client'; // Ensure this path is correct

const OrderForm = ({ selectedOrder, onRefresh }) => {
  const [order, setOrder] = useState({
    _id: '',
    idCustomer: '',
    nameOfCustomer: '',
    phone: '',
    address: '',
    dateOrder: '',
    dateReceived: '',
    totalPrice: '',
    payment_method: 'Momo',
    isPayment: false,
    idCart: '',
    status: 'Chờ thanh toán',
    idStaff: null, // Thêm trường deliveryStaff
  });

  const [error, setError] = useState('');
  const [staffList, setStaffList] = useState([]); // Danh sách nhân viên giao hàng

  // Function to format date to 'YYYY-MM-DD'
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Converts to YYYY-MM-DD format
  };

  useEffect(() => {
    // Lấy thông tin nhân viên giao hàng từ API
    const fetchStaffList = async () => {
      try {
        const response = await clientAPI.service('staff').find(); // Đảm bảo API path chính xác
        if (response.success) {
          setStaffList(response.data); // Giả sử data chứa danh sách nhân viên
        } else {
          console.error('Error fetching staff list:', response.message);
          setError(response.message);
        }
      } catch (error) {
        console.error('Error fetching staff list:', error);
        setError('An error occurred while fetching staff list!');
      }
    };

    fetchStaffList();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setOrder({
        _id: selectedOrder._id,
        idCustomer: selectedOrder.idCustomer,
        nameOfCustomer: selectedOrder.nameOfCustomer,
        phone: selectedOrder.phone,
        address: selectedOrder.address,
        dateOrder: selectedOrder.dateOrder ? formatDate(selectedOrder.dateOrder) : '',
        dateReceived: selectedOrder.dateReceived ? formatDate(selectedOrder.dateReceived) : '',
        totalPrice: selectedOrder.totalPrice,
        payment_method: selectedOrder.payment_method,
        isPayment: selectedOrder.isPayment,
        idCart: selectedOrder.idCart,
        status: selectedOrder.status,
        idStaff: selectedOrder.idStaff || null, // Lấy nhân viên giao hàng nếu có
      });
    } else {
      resetForm();
    }
  }, [selectedOrder]);      

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // If the status is changed to "Đã thanh toán", set dateReceived to current date
    if (name === 'status' && value === 'Đã thanh toán') {
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: value,
        dateReceived: formatDate(new Date()), // Set current date for "dateReceived"
      }));
    } else {
      setOrder((prevOrder) => ({
        ...prevOrder,
        [name]: value,
      }));
    }
  
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderId = order._id;

    try {
      if (orderId) {
        const response = await clientAPI.service('order').patch(orderId, order); // Use correct API path
        if (response.success) {
          console.log('Order updated successfully');
          if (onRefresh) onRefresh();
        } else {
          console.error('Error updating order:', response.message);
          setError(response.message);
        }
      } else {
        const response = await clientAPI.service('order').create(order); // Use correct API path for new order
        if (response.success) {
          console.log('Order added successfully');
          if (onRefresh) onRefresh();
        } else {
          console.error('Error adding order:', response.message);
          setError(response.message);
        }
      }
    } catch (error) {
      console.error('Error adding/updating order:', error.response ? error.response.data : error);
      setError('An error occurred while adding/updating order!');
    }
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;
    try {
      await clientAPI.service('order').remove(order._id); // Use _id for delete action
      console.log('Order has been deleted successfully');
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting order:', error.response ? error.response.data : error.message);
      setError('An error occurred while deleting order!');
    }
  };

  const resetForm = () => {
    setOrder({
      _id: '',
      idCustomer: '',
      nameOfCustomer: '',
      phone: '',
      address: '',
      dateOrder: '', // Ensure this is cleared correctly
      dateReceived: '',
      totalPrice: '',
      payment_method: 'Momo',
      isPayment: false,
      idCart: '',
      status: 'Chờ thanh toán',
      idStaff: null, // Clear deliveryStaff
    });
    setError('');
  };

  return (
    <div className="order-form p-4 bg-white border ml-4 h-full flex flex-col">
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex-grow">
        {[ 
          { label: 'Tên Khách hàng', type: 'text', name: 'nameOfCustomer', required: true },
          { label: 'Số điện thoại', type: 'text', name: 'phone', required: true },
          { label: 'Địa chỉ', type: 'text', name: 'address', required: true },
          { label: 'Ngày đặt', type: 'date', name: 'dateOrder', required: true },
          { label: 'Ngày nhận', type: 'date', name: 'dateReceived' },
          { label: 'Tổng tiền', type: 'number', name: 'totalPrice', required: true },
        ].map(({ label, type, ...inputProps }, index) => (
          <div key={index} className="mb-3">
            <label className="block mb-1 text-sm font-medium">{label}</label>
            <input
              type={type}
              {...inputProps}
              value={order[inputProps.name] || ''}
              onChange={handleChange}
              className="border py-1 px-2 w-full text-sm rounded-md"
            />
          </div>
        ))}

        {/* Payment Method Dropdown */}
        <div className="mb-3">
          <label className="block mb-1 text-sm">Phương thức thanh toán</label>
          <select
            name="payment_method"
            value={order.payment_method}
            onChange={handleChange}
            className="border py-1 px-2 w-full"
          >
            <option value="Bank">Bank</option>
            <option value="Cod">Cod</option>
            <option value="Momo">Momo</option>
          </select>
        </div>
  
        {/* Order Status Dropdown */}
        <div className="mb-3">
          <label className="block mb-1 text-sm">Trạng thái thanh toán</label>
          <select
            name="status"
            value={order.status}
            onChange={handleChange}
            className="border py-1 px-2 w-full"
          >
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Chờ lấy hàng">Chờ lấy hàng</option>
            <option value="Đang vận chuyển">Đang vận chuyển</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã giao">Đã giao</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>

        {/* Delivery Staff Dropdown */}
        <div className="mb-3">
          <label className="block mb-1 text-sm">Nhân viên giao hàng</label>
          <select
            name="idStaff"
            value={order.idStaff || ''}
            onChange={handleChange}
            className="border py-1 px-2 w-full"
          >
            <option value="">Chọn nhân viên giao hàng</option>
            {staffList.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>
  
        {/* Action Buttons */}
        <div className="flex space-x-4 mt-4">
          {[ 
            { label: 'Thêm', onClick: handleSubmit, color: 'yellow-500', disabled: !!order._id },
            { label: 'Sửa', onClick: handleSubmit, color: 'green-500', disabled: !order._id },
            { label: 'Xóa', onClick: handleDelete, color: 'red-500', disabled: !order._id },
          ].map(({ label, onClick, color, disabled }, index) => (
            <button
              key={index}
              onClick={onClick}
              className={`px-4 py-2 text-white bg-${color} rounded-md ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default OrderForm;
