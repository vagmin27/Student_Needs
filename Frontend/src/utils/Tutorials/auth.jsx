import React, { useState, createContext, useContext, useEffect } from "react";
import { BASE_URL } from "./api";


const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/user`, {
        credentials: "include",
      });


      if (res.status !== 200) return;

      const data = await res.json();
      setUser(data.user);
    } catch (err) {}
  };

  useEffect(() => {
    fetchUser();
  }, []);


  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

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