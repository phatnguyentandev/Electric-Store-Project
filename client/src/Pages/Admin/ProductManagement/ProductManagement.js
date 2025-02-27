import React, { useState, useEffect } from 'react';
import SideNav from '../SideNav';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import clientAPI from '../../../client-api/rest-client';

const ProductManagement = () => {
  const [isOpen, setIsOpen] = useState(true); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(prevState => !prevState); 
  };

  const refreshProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientAPI.service('product').find();
      setProducts(response.data);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Không thể lấy sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <div className="flex h-screen">
      <SideNav isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 h-full overflow-auto px-2 ${isOpen ? 'ml-1/5' : 'ml-1/6'}`} >
        {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="spinner-border animate-spin w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full" />
        </div>
        ) : error ? (
          <div className="bg-red-100 text-red-600 p-4 rounded-md shadow-md">
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4"> {/* Adjusted gap to match previous structure */}
            <ProductTable products={products} onProductSelect={setSelectedProduct} />
            <ProductForm selectedProduct={selectedProduct} onRefresh={refreshProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
