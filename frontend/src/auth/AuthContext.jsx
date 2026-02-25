import { createContext, useContext, useState, useEffect } from "react";
import { postService, getService } from "../service/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

 
  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);



  
 const signup = async (data) => {
    const res = await postService("/admin/auth/signup", data);

    if (res.ok) {
        setUser(res.data?.data);
        localStorage.setItem("admin_session", JSON.stringify(res.data?.data));
        return "SUCCESS";
    }

   
    return res.message || "Signup failed";
};

  const login = async (email, password) => {
    const res = await postService("/admin/auth/login", { email, password });

    if (res.ok && res.data?.data) {
      setUser(res.data.data);
      localStorage.setItem("admin_session", JSON.stringify(res.data.data));
      return "SUCCESS";
    } else if (res.message === "Admin not found") {
      return "NO_ACCOUNT";
    } else {
      return "INVALID";
    }
  };

  const forgotPassword = async (email) => {
    const res = await postService("/admin/auth/forgot-password", { email });
    return res.ok ? "SUCCESS" : res.message || "Failed";
  };

  const fetchProfile = async () => {
    const res = await getService("/admin/auth/profile");

    if (res.ok && res.data?.data) {
      setUser(res.data.data);
      localStorage.setItem("admin_session", JSON.stringify(res.data.data));
      return res.data.data;
    }

    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("admin_session");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        forgotPassword,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);