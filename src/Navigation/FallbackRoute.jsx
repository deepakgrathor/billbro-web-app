import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const FallbackRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen bg-theme-base" />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-theme-base">
      <div className="text-6xl font-black text-theme-muted">404</div>
      <h1 className="mt-4 text-xl font-bold text-theme-primary">Page not found</h1>
      <p className="mt-2 text-sm text-theme-secondary">
        The page you are looking for does not exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-2xl active:scale-[0.98] transition"
      >
        Go Home
      </button>
    </div>
  );
};

export default FallbackRoute;
