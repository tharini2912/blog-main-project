import React from "react";
import { useUser } from "../Context/UserContext";
import Login from "../screens/Login";
import { Outlet, Navigate } from "react-router-dom";

const Private = () => {
  const { storedUserEmail } = useUser();
  const isAuthenticated = !!storedUserEmail;
  const isAtRootPath = window.location.pathname === "/";
  if (isAuthenticated && isAtRootPath) {
    return <Navigate to="/home" replace />;
  }
  return isAuthenticated ? <Outlet /> : <Login />;
};

export default Private;
