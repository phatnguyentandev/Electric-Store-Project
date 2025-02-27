import React, { useState, useEffect } from 'react';
import SideNav from '../SideNav';
import ImportTable from './ImportTable';
import ImportForm from './ImportForm';
import clientAPI from '../../../client-api/rest-client';

const ImportManagement = () => {
  const [isOpen, setIsOpen] = useState(true); // Toggle sidebar state
  const [selectedImport, setSelectedImport] = useState(null);
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(prevState => !prevState); // Toggle sidebar visibility
  };

  const refreshImports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientAPI.service('import').find();
      setImports(response.data);
      setSelectedImport(null);
    } catch (error) {
      console.error('Error fetching imports:', error);
      setError('Unable to load imports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshImports();
  }, []);

  return (
    <div className="flex h-screen">
      <SideNav isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 h-full overflow-auto px-2 ${isOpen ? 'ml-1/5' : 'ml-1/6'}`}> 
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="spinner-border animate-spin w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full" />
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-600 p-4 rounded-md shadow-md">
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <ImportTable imports={imports} onImportSelect={setSelectedImport} />
            <ImportForm selectedImport={selectedImport} onRefresh={refreshImports} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportManagement;
