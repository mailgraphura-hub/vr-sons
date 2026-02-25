import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import ProtectedRoute from "../auth/ProtectedRoute";

import AdminDashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
//import SubCategory from "../pages/Products/SubCategory";
import ProductManagement from "../pages/admin/ProductManagement";
import ProductImageManager from "../pages/admin/ProductImageManager";
import InquiryManagement from "../pages/admin/InquiryManagement";
import Customer from "../pages/admin/Customer";
import CustomerView from "../pages/admin/CustomerView";
import TeamRoles from "../pages/admin/TeamRoles";
import TeamRolesDetails from "../pages/admin/TeamRolesDetails";
import Settings from "../pages/admin/Settings";
import GeneralSettings from "../pages/admin/GeneralSettings";
import ProfileSettings from "../pages/admin/ProfileSettings";
import NotificationSettings from "../pages/admin/NotificationSettings";
import WebsiteSettings from "../pages/admin/WebsiteSettings";
import AdminLogin from "../pages/admin/Login";
import AdminSignup from "../pages/admin/Signup";
import ForgotPasswordOTP from "../pages/admin/ForgotPasswordOTP";
import VerifyOTP from "../pages/admin/VerifyOTP";
import SubCategories from "../pages/admin/SubCategories"
// import ResetPasswordOTP from "../pages/admin/ResetPasswordOTP";
import ResetPassword from "../pages/admin/ResetPassword";
import Blogs from "../pages/admin/Blogs";
import Promotion from "../pages/admin/Promotion";
// User Dashboard 
import UserLayout from "../layout/UserLayout";
import UserDashboard from "../pages/user/Dashboard";
import MyInquiries from "../pages/user/MyInquiries";
import Profile from "../pages/user/Profile";
import UserSettings from "../pages/user/Settings";


// Layout for Protected Admin Pages
function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignup />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/sub-categories" element={<SubCategories />} />
      <Route path="/customers" element={<Customer />} />
      <Route path="/customers/:id" element={<CustomerView />} />
      <Route path="/products" element={<ProductManagement />} />
      <Route path="/product-images" element={<ProductImageManager />} />
      <Route path="/inquiries" element={<InquiryManagement />} />
      <Route path="/team-roles" element={<TeamRoles />} />
      <Route path="/team-roles/:id" element={<TeamRolesDetails />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/general" element={<GeneralSettings />} />
      <Route path="/settings/profile" element={<ProfileSettings />} />
      <Route path="/promotion/blogs" element={<Blogs />} />
      <Route path="/promotion/managPromotion" element={<Promotion />} />

      <Route path="/forgot-password" element={<ForgotPasswordOTP />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password-otp" element={<ResetPassword />} />

      <Route
        path="/settings/notifications"
        element={<NotificationSettings />}
      />
      <Route path="/settings/website" element={<WebsiteSettings />} />

      {/* AUTH ROUTES (NO SIDEBAR) */}
      <Route path="login" element={<AdminLogin />} />
      <Route path="signup" element={<AdminSignup />} />
      
      {/* OTP-Based Forgot Password Flow */}
      <Route path="forgot-password" element={<ForgotPasswordOTP />} />
      <Route path="verify-otp" element={<VerifyOTP />} />
      {/* <Route path="reset-password-otp" element={<ResetPasswordOTP />} /> */}

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>

        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="categories" element={<Categories />} />
        {/* //<Route path="sub-categories" element={<SubCategory />} /> */}

        <Route path="products" element={<ProductManagement />} />
        <Route path="product-images" element={<ProductImageManager />} />

        <Route path="inquiries" element={<InquiryManagement />} />

        <Route path="customers" element={<Customer />} />
        <Route path="customers/:id" element={<CustomerView />} />

        <Route path="team-roles" element={<TeamRoles />} />
        <Route path="team-roles/details" element={<TeamRolesDetails />} />

        <Route path="settings" element={<Settings />} />
        <Route path="settings/general" element={<GeneralSettings />} />
        <Route path="settings/profile" element={<ProfileSettings />} />
        <Route path="settings/notifications" element={<NotificationSettings />} />
        <Route path="settings/website" element={<WebsiteSettings />} />

      </Route>

    </Routes>
  );
}