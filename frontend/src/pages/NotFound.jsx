import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-6 relative overflow-hidden">
      
      {/* Soft Orange Glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#C46A4A]/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C46A4A]/20 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-10 max-w-xl w-full text-center"
      >
        {/* 404 Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-extrabold"
        >
          <span className="text-white">4</span>
          <span className="text-[#C46A4A]">0</span>
          <span className="text-white">4</span>
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-white mt-6"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 mt-4 leading-relaxed"
        >
          The export product or page you are looking for might have been
          removed, renamed, or is temporarily unavailable.
          Please return to continue browsing.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-[#C46A4A] hover:bg-[#b85c3f] text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            to="/ContactUs"
            className="flex items-center justify-center gap-2 border border-[#C46A4A] text-[#C46A4A] px-6 py-3 rounded-xl hover:bg-[#C46A4A] hover:text-white transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Contact Support
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;