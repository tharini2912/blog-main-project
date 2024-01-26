import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
} from "../firebase/index.js";
import { useUser } from "../Context/UserContext.jsx";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { appAuth, appDB } from "../firebase";
import { FaGoogle } from "react-icons/fa";


const Login = () => {
//Google Sign in Popup
  const signInWithGoogle = async (event) => {
    event.preventDefault();
    const { user } = await signInWithGooglePopup();
    const userDocRef = await createUserDocumentFromAuth(user);
    setUser(user.email, user.displayName, user.uid);
          // getUserDisplayNameFromFirestore(uid);
          getUserProfileInfoFromFirestore(uid);
          navigate("/home");
  };


  const navigate = useNavigate();
  const {
    formFields,
    setFormFields,
    setUser,
    logoutUser,
    userEmail,
    displayName,
    setDisplayNameNew,
    getUserProfileInfoFromFirestore,
  } = useUser();
  const { email, uid, password, confirmPassword } = formFields;

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("hit");
    if (email && password) {
      try {
        const { user } = await signInAuthUserWithEmailAndPassword(
          email,
          password
        );
        console.log({ user });
        setFormFields({ email: "", password: "", confirmPassword: "" });

        if (user) {
          const { uid, displayName, email } = user;

          setUser(email, displayName, uid);
          getUserProfileInfoFromFirestore(uid);
          navigate("/home");
          console.log(user.email);
          console.log(user.displayName);
          console.log(user.uid);
        }
      } catch (err) {
        console.log("Error Occurd while Login", err.message);
        console.log(err.code);
        if (err.code === "auth/invalid-credential") {
          alert("Invalid Credentials");
        }
      }
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  //Model Window Open and Close

  const [openWindow, setOpenWindow] = useState(false);

  const windowHandler = () => {
    setOpenWindow(!openWindow);
  };

  return (
    <section className="for-signup-bg">
      <form action="" onSubmit={submitHandler}>
        <h2>Login</h2>
        <input
          type="email"
          id="email"
          name="email"
          onChange={changeHandler}
          placeholder="Email"
        />
        <input
          type="password"
          id="password"
          name="password"
          onChange={changeHandler}
          placeholder="Password"
        />
        
        <button className="credential" type="submit">
          Login
        </button>
        <button className="credential google-btn" type="submit" onClick={signInWithGoogle}>
          <FaGoogle/> Sign in with Google
        </button>
        <h3>
          New user? <Link to="/signup">Signup</Link>
        </h3>
        <button className="credential" onClick={windowHandler}>
          View Test Credentials
        </button>
        {openWindow && (
          <div className="c-flex">
            <div className="banner">
              <h3>Username : user@test.com</h3>
              <h3>Password : tdx@444</h3>
            </div>
          </div>
        )}
      </form>
    </section>
  );
};

export default Login;
