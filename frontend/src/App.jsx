import { Routes, Route, Navigate } from "react-router-dom";

/* ================= CORE ================= */
import Homepage from "./Homepage";
import AppRoutes from "./routes/AppRoutes";

/* ================= USER PAGES ================= */
import Dashboard from "./pages/user/Dashboard";
import Profile from "./pages/user/Profile";
import Settings from "./pages/user/Settings";
import MyInquiries from "./pages/user/MyInquiries";
import InquiryDetail from "./pages/user/InquiryDetail";

/* BLOG PAGES */
import Blog from "./pages/blog/Blog";
import SingleBlog from "./pages/blog/SingleBlog";

/* ================= AUTH ================= */
import Login from "./pages/user/UserLogin";
import Signup from "./pages/user/UserSignup";
import ForgotPass from "./pages/user/ForgotPass";

/* ================= UI COMPONENTS ================= */
import FoodCarousel from "./components/FoodCarousel";

/* ================= PRODUCT SYSTEM ================= */
import MainCategory from "./pages/Products/MainCategory";
import CategoryProducts from "./pages/Products/CategoryProducts";
import PrductDetail from "./pages/Products/PrductDetail";
import Product from "./pages/Products/Product"


//Footer
import AboutUs from "./pages/user/AboutUs";
import ContactUs from "./pages/user/Contactus";
import Term_Services from "./pages/user/Term_Services";
import PrivacyPolicy from "./pages/user/Privacy_Policy";

function App() {
  
  return (
    <Routes>

      {/* ================================================= */}
      {/* HOME */}
      {/* ================================================= */}
      <Route path="/" element={<Homepage />} />


      {/* ================================================= */}
      {/* ADMIN PANEL & AUTH */}
      {/* ================================================= */}
      <Route path="/admin/*" element={<AppRoutes />} />
      {/* Direct admin login/signup routes for convenience */}
      {/* <Route path="/admin/login" element={<AppRoutes />} />


      {/* ================================================= */}
      {/* USER DASHBOARD */}
      {/* ================================================= */}
      <Route path="/user/dashboard" element={<Dashboard />} />
      <Route path="/user/profile" element={<Profile />} />
      <Route path="/user/settings" element={<Settings />} />
      <Route path="/user/myinquiries" element={<MyInquiries />} />
      <Route path="/user/inquiries/:id" element={<InquiryDetail />} />

      {/* BLOG ROUTES */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<SingleBlog />} />

      {/* ================================================= */}
      {/* AUTHENTICATION */}
      {/* ================================================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-pass" element={<ForgotPass />} />

      {/* ================================================= */}
      {/* UI DEMO PAGE */}
      {/* ================================================= */}
      <Route path="/food-carousel" element={<FoodCarousel />} />

      {/* ================================================= */}
      {/* PRODUCT SYSTEM */}
      {/* ================================================= */}

        {/* User Routes */}
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/user/settings" element={<Settings />} />

      {/* Category product listing */}
      {/* Valid IDs: food | spices | agri | industrial */}
      <Route path="/MainCategory" element={<MainCategory />} />
      <Route path="/CategoryProducts/:id" element={<CategoryProducts />} />
      <Route path="/products/:id" element={<Product/>} />
      <Route path="/productsDetail/:id" element={<PrductDetail />} /> 

      {/* Future product detail page */}
      {/* Example URL → /products/food/f1 */}
      {/* <Route path="/products/:id/:productId" element={<ProductDetails />} /> */}
      <Route path="/AboutUs" element={<AboutUs />} /> 
      <Route path="/ContactUs" element={<ContactUs />} /> 
      <Route path="/Term_Services" element={<Term_Services />} /> 
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} /> 
   
      {/* ================================================= */}
      {/* 404 FALLBACK */}
      {/* ================================================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;