import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clientAPI from "../../client-api/rest-client";

const ProductDetail = () => {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0,0);
    const fetchProductDetail = async () => {
      try {
        const data = await clientAPI.service('product').get(id);
        setProductDetail(data.data);

        // Fetch all products and filter for related ones by name similarity
        const allProducts = await clientAPI.service('product').find({});
        
        // Filter products by name containing part of the current product's name
        const related = allProducts.data.filter(p => 
          p.nameOfProduct.toLowerCase().includes(data.data.nameOfProduct.split(" ")[0].toLowerCase()) && p._id !== id
        );
        
        // If fewer than 3 related products, pick random ones from the remaining products
        let randomProducts = [];
        if (related.length < 3) {
          const remainingProducts = allProducts.data.filter(p => !related.some(rp => rp._id === p._id) && p._id !== id);
          const remainingCount = 3 - related.length;
          randomProducts = shuffleArray(remainingProducts).slice(0, remainingCount);
        }

        // Set related products (original + random ones if needed)
        setRelatedProducts([...related, ...randomProducts].slice(0, 3)); // Show up to 3 related products
      } catch (error) {
        console.error("Failed to fetch product details or related products", error);
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleAddToCart = async () => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      navigate('/login');
    } else {
      try {
        const response = await clientAPI.service('cart').create({
          idProduct: productDetail.idProduct,
          quantity: 1,
          nameOfProduct: productDetail.nameOfProduct,
          image: productDetail.image,
          price: productDetail.price,
        });
        console.log("Product added to cart successfully:", response.data);
      } catch (error) {
        console.error("Error adding product to cart:", error);
      }
    }
  };

  const shuffleArray = (array) => {
    // Shuffle the array randomly
    return array.sort(() => Math.random() - 0.5);
  };

  if (!productDetail) {
    return <div>Loading...</div>;
  }

  const stockStatus = productDetail.quantity > 0 ? "Còn hàng" : "Hết hàng";
  const statusColor = productDetail.quantity > 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
      {/* Top Section */}
      <div className="w-3/4 py-2 px-4 text-black text-left">
        <h2 className="text-3xl font-bold ml-14">{productDetail.nameOfProduct}</h2>
      </div>

      {/* Middle Section */}
      <div className="flex">
        <div className="w-3/4 flex p-6">
          {/* Product Image */}
          <div className="w-1/3 p-4">
            <div className="w-full h-64 overflow-hidden relative">
              <img
                className="w-full h-full object-cover"
                src={productDetail.image ? productDetail.image : "https://via.placeholder.com/150"}
                alt={productDetail.nameOfProduct}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-2/3 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Mã sản phẩm: {productDetail.idProduct}</p>
              <p className={`text-sm font-medium ${statusColor}`}>Tình trạng: {stockStatus}</p>
            </div>

            <div className="mt-4">
              <p className="text-gray-600 text-sm">Giá sản phẩm:</p>
              <p className="text-red-500 text-xl font-semibold mt-1">{productDetail.price} ₫</p>
            </div>

            <button
              onClick={handleAddToCart}
              className={`py-2 px-4 rounded mt-4 ${
                productDetail.quantity === 0
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
              disabled={productDetail.quantity === 0}
            >
              Chọn mua
            </button>

            <div className="mt-4">
              <h3 className="text-gray-900 text-lg font-semibold">Thông tin chi tiết</h3>
              <p className="text-gray-700 mt-2">{productDetail.description || "Chưa có mô tả cho sản phẩm này."}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="w-1/5 bg-gray-100 p-2">
          <h3 className="text-sm font-bold mb-3">CÓ THỂ BẠN QUAN TÂM</h3>
          {relatedProducts.map((product) => (
            <div
              key={product._id}
              className="mb-2 border p-2 rounded cursor-pointer hover:shadow-lg"
              onClick={() => navigate(`/product/${product._id}`)} 
            >
              <img
                className="w-full h-24 object-contain mb-2 ml-0"
                src={product.image || "https://via.placeholder.com/100"}
                alt={product.nameOfProduct}
              />
              <p className="text-xs font-semibold">{product.nameOfProduct}</p>
              <p className="text-red-500 text-xs">{product.price} ₫</p>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default ProductDetail;
