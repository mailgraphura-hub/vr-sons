import { createContext, useContext, useEffect, useState } from "react";
import { getService } from "../service/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const apiResponse = await getService("/customer/auth/myprofile");

      if (apiResponse?.ok) {
        localStorage.setItem("username", apiResponse.data.data.name)
        setUser(apiResponse.data.data);      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const userProfile = () => useContext(UserContext);