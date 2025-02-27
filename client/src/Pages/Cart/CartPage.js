import React, { useEffect, useState } from "react";
import clientAPI from "../../client-api/rest-client";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const idCart = user?.idCart;
    const loadForm = async () => {
        try {
            const data = await clientAPI.service('cart').get(idCart);
            if (Array.isArray(data.data.products)) {
                setCartItems(data.data.products);
            } else {
                console.error("Expected an array but got:", data.data.products);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                window.alert(`Error: ${error.response.data.message}`);
            } else {
                window.alert("Error: Something went wrong");
            }
            console.log(error);
        }
    };

    useEffect(() => {
        loadForm();
    }, []);

    const handleCheckout = () => {
        // Filter only the selected items
        const selectedItems = cartItems.filter(product => product.isSelected);
        
        if (selectedItems.length === 0) {
            window.alert("Vui lòng chọn sản phẩm để tiếp tục.");
            return;
        }

        // Navigate to the checkout page with selected items
        navigate("/CheckoutPage", { state: { selectedItems } });
    };

    const handleProductClick = (idProduct) => {
        // Handle clicking on a product here
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            window.alert("Số lượng không thể nhỏ hơn 1.");
            return;
        }
    
        // Update the cartItems state locally
        const updatedCartItems = cartItems.map(product => {
            if (product.idProduct === productId) {
                return {
                    ...product,
                    quantity: newQuantity,
                };
            }
            return product;
        });
    
        setCartItems(updatedCartItems);
        // Send an API request to update the quantity in the backend
        try {
            await clientAPI.service('cart').patch(idCart, {
                idProduct: productId, quantity: newQuantity
            });
            window.location.reload();
        } catch (error) {
            console.error("Failed to update quantity:", error);
            window.alert("Đã có lỗi xảy ra khi cập nhật số lượng.");
        }
    };
    
    const handleSelectItem = (productId) => {
        const updatedCartItems = cartItems.map(product => {
            if (product.idProduct === productId) {
                return {
                    ...product,
                    isSelected: !product.isSelected,
                };
            }
            return product;
        });
    
        setCartItems(updatedCartItems);
    };

    const handleDelete = async (productId) => {
        // Remove the item locally
        const updatedCartItems = cartItems.filter(product => product.idProduct !== productId);
        setCartItems(updatedCartItems);
    
        // Find the cart item associated with the given productId for the API call
        const cartItem = cartItems.find(product => product.idProduct === productId);
        if (!cartItem) {
            console.error("Product not found in the cart.");
            return;
        }
    
        // Concatenate idCart and productId into a single string
        const objectId = `${idCart}-${productId}`;  // Use a separator like `-` or `/`
    
        // Send an API request to delete the product from the backend
        try {
            await clientAPI.remove(objectId);  // Pass the combined objectId to remove
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete product:", error);
            window.alert(error.message);
        }
    };
    
    

    return (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
                <h2 className="text-gray-900 text-2xl font-bold mb-4">Giỏ hàng của bạn</h2>
                {cartItems.length === 0 ? (
                    <p className="text-gray-600">Giỏ hàng của bạn đang trống.</p>
                ) : (
                    cartItems.map((product) => (
                        <div key={product._id} className="flex items-center justify-between border-b border-gray-200 py-4">
                            <img
                                className="w-20 h-20 object-cover rounded"
                                src={product.image ? product.image : "https://via.placeholder.com/150"}
                                alt={product.nameOfProduct}
                                onClick={() => handleProductClick(product.idProduct)}
                            />
                            <div className="flex-1 ml-4">
                                <h3 className="text-gray-900 text-lg font-bold">{product.nameOfProduct}</h3>
                                <p className="text-red-500 text-md font-semibold">{product.price} ₫</p>
                                <p className="text-gray-600 text-sm">Mã sản phẩm: {product.idProduct}</p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => handleQuantityChange(product.idProduct, product.quantity - 1)}
                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2 text-gray-800">{product.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(product.idProduct, product.quantity + 1)}
                                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-pink-500"
                                    checked={product.isSelected || false}
                                    onChange={() => handleSelectItem(product.idProduct)}
                                />
                                <button
                                    onClick={() => handleDelete(product.idProduct)}
                                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}
                {cartItems.length > 0 && (
                    <div className="mt-4">
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
                        >
                            Mua sản phẩm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
