import React, { useState, useEffect } from 'react';
import SideNav from '../SideNav';
import ProviderTable from './ProviderTable'; // Ensure this component exists
import ProviderForm from './ProviderForm';
import clientAPI from '../../../client-api/rest-client';

const ProviderManagement = () => {
  const [isOpen, setIsOpen] = useState(true); // To toggle SideNav
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  const refreshProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientAPI.service('provider').find();
      setProviders(response.data);
      setSelectedProvider(null);
    } catch (error) {
      console.error('Không thể lấy nhà cung cấp:', error);
      setError('Không thể tải nhà cung cấp. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProviders();
  }, []);

  return (
    <div className="flex h-screen">
      <SideNav isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 h-full overflow-auto px-2 ${isOpen ? 'ml-1/5' : 'ml-1/6'}`}
      >
        {loading ? (
          <p>Đang tải nhà cung cấp...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <ProviderTable providers={providers} onProviderSelect={setSelectedProvider} />
            <ProviderForm selectedProvider={selectedProvider} onRefresh={refreshProviders} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderManagement;
