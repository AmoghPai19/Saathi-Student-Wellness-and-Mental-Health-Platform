import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

interface DecodedToken {
  id: string;
  role: string;
  exp: number; // expiry timestamp in seconds
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token → redirect to login
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Check token expiration
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return <Navigate to="/login" replace />;
    }

    const role = decoded.role.toLowerCase(); // ensure lowercase for comparison

    // Check if role is allowed
    if (!allowedRoles.map(r => r.toLowerCase()).includes(role)) {
      // Role not allowed → redirect to home
      return <Navigate to="/" replace />;
    }

    // Everything fine → render the child component
    return <>{children}</>;
  } catch (err) {
    // Invalid token → remove and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
