import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check token on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();

    // ✅ Listen for token injection from React Native
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.type === "storage") {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // ✅ IMPORTANT: Also listen for manual storage events
    // (WebContainer already dispatches this!)
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false);
  //   }
  //   setLoading(false);
  // }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    // 2. Notify the React Native app
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ action: "LOGOUT" })
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
