import React, { useState, createContext, useContext, useEffect } from "react";
import API from "./api";


const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const fetchUser = async () => {
    try {
      const { data } = await API.get("/user");
      setUser(data.user);
    } catch (err) {}
  };

  // useEffect(() => {
  //   fetchUser();
  // }, []);


  const logout = async () => {
    try {
      await API.post("/logout");

    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
