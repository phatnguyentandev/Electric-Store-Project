// src/Pages/ProductManagement/SideNav.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(true); // state to track if the sidebar is open
  const location = useLocation();

  const routes = [
    { path: '/ProductManagement', label: 'Quản lý sản phẩm' },
    { path: '/ImportManagement', label: 'Quản lý nhập hàng' },
    { path: '/ProviderManagement', label: 'Quản lý nhà cung cấp' },
    { path: '/WarehouseManagement', label: 'Quản lý kho' },
    { path: '/OrderManagement', label: 'Quản lý hóa đơn' },
    { path: '/UserManagement', label: 'Quản lý thông tin người dùng' },
    { path: '/AccountManagement', label: 'Quản lý tài khoản' },
    { path: '/ExpressCompanyManagement', label: 'Quản lý công ty giao hàng'},
    { path: '/StatisticsManagement', label: 'Thống kê' },
  ];

  const toggleSidebar = () => {
    setIsOpen(prevState => !prevState); // toggle the sidebar open/close state
  };

  return (
    <div className={`bg-white border-r h-screen shadow-md ${isOpen ? 'w-80' : 'w-10'} relative`}>
      <button
        onClick={toggleSidebar}
        className="absolute top-250 right-0 bg-gray-200 p-1 rounded-full hover:bg-gray-300"
      >
        {isOpen ? '<' : '>'}
      </button>
      {isOpen && (
        <ul className="flex flex-col p-4">
          {routes.map(route => (
            <li
              key={route.path}
              className={`mb-2 cursor-pointer rounded-md transition-colors duration-300 ${
                location.pathname === route.path
                  ? 'bg-pink-500 text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              <Link
                to={route.path}
                className="block p-3 no-underline text-inherit"
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SideNav;
