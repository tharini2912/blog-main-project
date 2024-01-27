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
import ModalWindow from "../Modal/Modal.jsx";


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



  const [isModalOpen, setIsModalOpen] = useState(true);

  // Other code...

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
        
        
          <div className="c-flex">
            <div className="banner">
              <h4>Test Credentials</h4>
              <h5>darien.milton@gmail.com</h5>
              <h5>tdx@444</h5>
            </div>
          </div>
        
      </form>
      {isModalOpen && (
        <ModalWindow
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default Login;
