import React from "react";
import { useUser } from "../Context/UserContext.jsx";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { displayNameNew, getUserDisplayNameFromFirestore, setUserEmail } =
    useUser();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      getUserDisplayNameFromFirestore(uid);
    }
  }, [getUserDisplayNameFromFirestore]);

  const handleSignOut = () => {
    window.localStorage.clear();
    navigate("/login");
  };
  return (
    <section className="for-header">
      <h1>Hello {displayNameNew}</h1>
      <h1>Blog Shine</h1>
      {/* <div className="logo-container">
        <img src="/images/logo.png" alt="logo" />
      </div> */}
      <button
        style={{ padding: "0.2rem", borderRadius: "0.2rem", cursor: "pointer" }}
        className="signout-btn"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </section>
  );
};

export default Header;
