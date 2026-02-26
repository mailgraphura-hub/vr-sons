import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import ProtectedRoute from "../auth/ProtectedRoute";

import AdminDashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
import SubCategories from "../pages/admin/SubCategories";
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
import Blogs from "../pages/admin/Blogs";
import Promotion from "../pages/admin/Promotion";

import AdminLogin from "../pages/admin/Login";
import AdminSignup from "../pages/admin/Signup";
import ForgotPasswordOTP from "../pages/admin/ForgotPasswordOTP";
import VerifyOTP from "../pages/admin/VerifyOTP";
import ResetPassword from "../pages/admin/ResetPassword";


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

      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignup />} />
      <Route path="/forgot-password" element={<ForgotPasswordOTP />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password-otp" element={<ResetPassword />} />

      {/* ================= PROTECTED ROUTES ================= */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/sub-categories" element={<SubCategories />} />

        <Route path="/products" element={<ProductManagement />} />
        <Route path="/product-images" element={<ProductImageManager />} />

        <Route path="/inquiries" element={<InquiryManagement />} />

        <Route path="/customers" element={<Customer />} />
        <Route path="/customers/:id" element={<CustomerView />} />

        <Route path="/team-roles" element={<TeamRoles />} />
        <Route path="/team-roles/:id" element={<TeamRolesDetails />} />

        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/general" element={<GeneralSettings />} />
        <Route path="/settings/profile" element={<ProfileSettings />} />
        <Route path="/settings/notifications" element={<NotificationSettings />} />
        <Route path="/settings/website" element={<WebsiteSettings />} />

        <Route path="/promotion/blogs" element={<Blogs />} />
        <Route path="/promotion/managePromotion" element={<Promotion />} />
      </Route>

    </Routes>
  );
}