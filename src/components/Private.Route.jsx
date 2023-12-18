import React from "react";
import { useUser } from "../Context/UserContext";
import Login from "../screens/Login";
import App from "../App";
import { Outlet } from "react-router-dom";

const Private = () => {
  const { storedUserEmail } = useUser();
  return storedUserEmail ? <Outlet /> : <Login />;
};

export default Private;
