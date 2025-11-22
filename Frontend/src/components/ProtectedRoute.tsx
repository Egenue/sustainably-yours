import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute = ({ redirectTo = "/login" }: { redirectTo?: string }) => {
  const auth = useAuth();
  const location = useLocation();
  if (auth.loading) return null;
  if (!auth.isAuthenticated()) return <Navigate to={redirectTo} state={{ from: location }} replace />;
  return <Outlet />;
};