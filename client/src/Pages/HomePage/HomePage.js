import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAPI from "../../client-api/rest-client";
import BannerImage from '../../images/BannerHomepages.png';

const HomePage = () => {
  const [product, setProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16; // Số sản phẩm trên mỗi trang
  const navigate = useNavigate();

  const loadForm = async () => {
    try {
      const data = await clientAPI.service('product').find();
      if (Array.isArray(data.data)) {
        setProduct(data.data);
      } else {
        console.error("Expected an array but got:", data.data);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(`Error: ${error.response.data.message}`);
      } else {
        console.log("Error: Something went wrong");
      }
      console.log(error);
    }
  };

  useEffect(() => {
    loadForm();
  }, []);

  const handleProductDetailClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleProductClick = (type) => {
    navigate(`/products/${type}`);
  };

  // Lọc sản phẩm trạng thái Available
  const availableProducts = product.filter(item => item.status === 'Available');

  // Logic phân trang
  const totalPages = Math.ceil(availableProducts.length / itemsPerPage);
  const currentProducts = availableProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Thanh danh mục sản phẩm */}
      <div className="flex">
        <div className="w-1/4">
          <h2 className="text-lg font-bold mb-4">DANH MỤC SẢN PHẨM</h2>
          <ul className="space-y-2">
            <li className="flex items-center hover:underline cursor-pointer" onClick={() => handleProductClick("Điện thoại")}>
              <i className="fas fa-mobile-alt"></i>
              <span className="ml-2">Điện thoại</span>
            </li>
            <li className="flex items-center hover:underline cursor-pointer" onClick={() => handleProductClick("Laptop")}>
              <i className="fas fa-laptop"></i>
              <span className="ml-2">Laptop</span>
            </li>
            <li className="flex items-center hover:underline cursor-pointer" onClick={() => handleProductClick("Camera")}>
              <i className="fas fa-camera"></i>
              <span className="ml-2">Camera</span>
            </li>
            <li className="flex items-center hover:underline cursor-pointer" onClick={() => handleProductClick("Máy tính bảng")}>
              <i className="fas fa-tablet-alt"></i>
              <span className="ml-2">Máy tính bảng</span>
            </li>
          </ul>

          
        </div>

        {/* Phần banner */}
        <div className="w-3/4 ml-4">
          <div className="mb-4">
            <img
              src={BannerImage}
              alt="Banner"
              className="rounded-lg"
              style={{ width: '800px', height: '350px' }}
            />
          </div>

          {/* Phần danh sách sản phẩm */}
          <h2 className="text-lg font-bold mb-4">SẢN PHẨM</h2>
          <div className="grid grid-cols-4 gap-4">
            {currentProducts.length > 0 ? (
              currentProducts.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-md cursor-pointer"
                  onClick={() => handleProductDetailClick(item._id)}
                >
                  <img
                    src={item.image ? item.image : "https://via.placeholder.com/150"} 
                    alt={item.nameOfProduct}
                    className="w-full mb-4"
                  />
                  <h3 className="text-lg font-semibold">{item.nameOfProduct}</h3>
                  <p className="text-red-500 font-bold">{item.price} đ</p>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm nào</p>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mx-1"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"} rounded hover:bg-gray-300 mx-1`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mx-1"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
