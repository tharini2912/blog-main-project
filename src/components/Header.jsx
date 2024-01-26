import React, { useEffect } from "react";
import { useUser } from "../Context/UserContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  // const { displayNameNew, fetchAvatarURL, getUserDisplayNameFromFirestore, setUserEmail, avatar } = useUser();

  const {
    displayNameNew,
    fetchAvatarURL,
    getUserProfileInfoFromFirestore,
    setUserEmail,
    avatar,
  } = useUser();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      getUserProfileInfoFromFirestore(uid);
      fetchAvatarURL(uid);
    }
  }, [getUserProfileInfoFromFirestore, fetchAvatarURL]);

  const handleSignOut = () => {
    window.localStorage.clear();
    navigate("/login");
  };

  return (
    <section className="for-header">
      <Link className="none-deco" to="/updateProfile">
        <div className="avatar">
          {avatar && <img className="avatar-img" src={avatar} alt="" />}
          <h1>Hello {displayNameNew}</h1>
        </div>
      </Link>
      <Link className="none-deco" to="/Home">
        <h1>Blog Shine</h1>
      </Link>

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
