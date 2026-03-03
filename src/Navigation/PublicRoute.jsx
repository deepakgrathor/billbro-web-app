import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import SplashScreen from "../Components/SplashScreen";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <SplashScreen />;

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;
