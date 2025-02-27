import React, { useEffect, useState } from "react";
import clientAPI from "../../client-api/rest-client";
import { useNavigate, useParams } from "react-router-dom"; // Sử dụng hook để điều hướng

const ProductListing = () => {
    const par = useParams();
    const [products, setProducts] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [sortOption, setSortOption] = useState("name"); // 'name' or 'price'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await clientAPI.service("product").find(`typeProduct=${par.type}`);
            if (Array.isArray(response.data)) {
                // Lọc sản phẩm trạng thái "Available"
                const availableProducts = response.data.filter(product => product.status === "Available");
                setProducts(availableProducts);
                setSortedProducts(availableProducts);
            } else {
                console.error("Expected an array but got:", response.data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleSortChange = (event) => {
        const sortBy = event.target.value;
        setSortOption(sortBy);
        let sortedArray = [...products];

        if (sortBy === "name") {
            sortedArray.sort((a, b) => a.nameOfProduct.localeCompare(b.nameOfProduct));
        } else if (sortBy === "price") {
            sortedArray.sort((a, b) => a.price - b.price);
        }
        setSortedProducts(sortedArray);
    };

    // Pagination control
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const currentProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleProductDetailClick = (id) => {
        console.log(id);
        navigate(`/product/${id}`); // Điều hướng tới trang chi tiết sản phẩm
    };

    return (
        <div className="max-w-screen-lg mx-auto bg-white p-4">
            <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>

            {/* Sorting Dropdown */}
            <div className="flex justify-end mb-4">
                <label className="mr-2">Sort by:</label>
                <select value={sortOption} onChange={handleSortChange} className="p-2 border rounded">
                    <option value="name">Name (A-Z)</option>
                    <option value="price">Price (Low to High)</option>
                </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-4 gap-4">
                {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                        <div
                            key={product._id}
                            className="border rounded-lg p-4 shadow cursor-pointer"
                            onClick={() => handleProductDetailClick(product._id)}
                        >
                            <div className="w-full h-32 mb-2 rounded overflow-hidden">
                                <img
                                    src={product.image ? product.image : "https://via.placeholder.com/150"}
                                    alt={product.nameOfProduct}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h3 className="text-lg font-semibold">{product.nameOfProduct}</h3>
                            <p className="text-gray-700">{product.price} ₫</p>
                        </div>
                    ))
                ) : (
                    <p className="col-span-4 text-center">Không có sản phẩm nào</p>
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
                        className={`px-4 py-2 ${
                            currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                        } rounded hover:bg-gray-300 mx-1`}
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
    );
};

export default ProductListing;
