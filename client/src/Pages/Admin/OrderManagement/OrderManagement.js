import React, { useState, useEffect } from 'react';
import SideNav from '../SideNav';
import OrderTable from './OrderTable';
import OrderForm from './OrderForm';
import clientAPI from '../../../client-api/rest-client';

const OrderManagement = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  const refreshOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientAPI.service('order').find();
      setOrders(response.data);
      setSelectedOrder(null); // Clear selection on refresh
    } catch (error) {
      console.error('Failed to load orders:', error);
      setError('Unable to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = (orderId) => {
    const order = orders.find((order) => order._id === orderId); // Find order by ID
    setSelectedOrder(order);
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  return (
    <div className="flex h-screen">
      <SideNav isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 h-full overflow-auto px-2 ${isOpen ? 'ml-1/5' : 'ml-1/6'}`}
      >
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <OrderTable orders={orders} onOrderSelect={handleOrderSelect} />
            <OrderForm selectedOrder={selectedOrder} onRefresh={refreshOrders} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
