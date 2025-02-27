import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogIn from './Pages/Account/LogIn';
import SignUp from "./Pages/Account/SignUp";
import Header from "./Header";
import Footer from "./Footer";
import HomePage from "./Pages/HomePage/HomePage";
import ForgetPassWord from "./Pages/Account/ForgetPassword";
import ProductDetail from "./Pages/Product/ProductDetail";
import InfoUser from "./Pages/Account/InfoUser";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./Pages/NotFound"; // Import trang NotFound
import SideNav from "./Pages/Admin/SideNav";
import ProductManagement from "./Pages/Admin/ProductManagement/ProductManagement";
import ProviderManagement from "./Pages/Admin/ProviderManagement/ProviderManagement";
import WarehouseManagement from "./Pages/Admin/WarehouseManagement/WarehouseManagement";
import OrderManagement from "./Pages/Admin/OrderManagement/OrderManagement";
import ImportManagement from "./Pages/Admin/ImportManagement/ImportManagement";
import UserManagement from "./Pages/Admin/UserManagement/UserManagement";
import AccountManagement from "./Pages/Admin/AccountManagement/AccountManagement";
import CartPage from "./Pages/Cart/CartPage";
import CheckoutPage from "./Pages/Checkout/CheckoutPage";
import ProductListing from "./Pages/Product/ProductListing";
import VerificationSuccess from "./Pages/VertificationSuccess";
import OrderPending from "./Pages/Checkout/OrderPending";
import BankTransferQRCode from "./Pages/Checkout/BankTransferQRCode";
import OrdersPage from "./Pages/Order/OrdersPage";
import OrderDetailPage from "./Pages/Order/OrderDetailPage";
import ResetPassword from "./Pages/Account/ResetPassword";
import ChangePassword from "./Pages/Account/ChangePassword";
import StatisticsManagement from "./Pages/Admin/StatisticsManagement/StatisticsManagement";
import ExpressCompanyManagement from "./Pages/Admin/ExpressCompanyManagement/ExpressCompanyManagement";
import OrderStaffForm from "./Pages/Staff/OrderStaffForm";
function App() {
  const role = JSON.parse(localStorage.getItem('user'))?.data.role || "admin";
  console.log(role);
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/ForgetPassword" element={<ForgetPassWord />} />
          <Route path="/ResetPassword/:token" element={<ResetPassword/>} />
          <Route path="/ChangePassword" element ={<ChangePassword/>} />
          <Route 
            path="/ProductManagement" 
            element={
              <ProtectedRoute role={role} allowedRoles={["admin"]}>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/ProviderManagement" 
            element={
              <ProtectedRoute role={role} allowedRoles={["admin"]}>
                <ProviderManagement />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/WarehouseManagement" 
            element={
              <ProtectedRoute role={role} allowedRoles={["admin"]}>
                <WarehouseManagement />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/OrderManagement" 
            element={
              <ProtectedRoute role={role} allowedRoles={["admin"]}>
                <OrderManagement />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/ImportManagement" 
            element={
              <ProtectedRoute role={role} allowedRoles={["admin"]}>
                <ImportManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/UserManagement" element={
            <ProtectedRoute role={role} allowedRoles={["admin"]}>
              <UserManagement/>
            </ProtectedRoute>
          }/>
          <Route path="/AccountManagement" element={
            <ProtectedRoute role={role} allowedRoles={["admin"]}>
              <AccountManagement/>
            </ProtectedRoute>
            }/>
          <Route path="/ExpressCompanyManagement" element={
            <ProtectedRoute role={role} allowedRoles={["admin"]}>
              <ExpressCompanyManagement/>
            </ProtectedRoute>
            }/>
          <Route path ="/CartPage" element = {<CartPage/>}/>
          <Route path ="/CheckoutPage" element = {<CheckoutPage/>}/>
          <Route path = "/products/:type" element = {<ProductListing/>} />
          <Route path = "/info" element = {<InfoUser/>}/>
          <Route path = "/order-pending/:orderIdParams" element = {<OrderPending/>} />
          <Route path="/bank-transfer-qr-code" element={<BankTransferQRCode />} />
          <Route path="/orders-page" element = {<OrdersPage/>} />
          <Route path="/OrderDetail/:id" element = {<OrderDetailPage/>} />
          <Route path="/OrderDetailStaff/:id" element = {<OrderDetailPage/>} />

          <Route path="/product/:id" element={<ProductDetail/>}/>
          <Route path="/orders-staff-page" element={<OrderStaffForm/>}/>

          <Route 
            path="/nav" 
            element={
              <ProtectedRoute role={role} allowedRoles={["admin"]}>
                <SideNav />
              </ProtectedRoute>
            }
          />
          
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} /> {/* Định tuyến tất cả các URL không khớp */}
          <Route path="/verification-success" element={<VerificationSuccess/>} />
          <Route path="/StatisticsManagement"
            element={
            <ProtectedRoute role={role} allowedRoles={["admin"]}>
              <StatisticsManagement/>
            </ProtectedRoute>
            }
          />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;