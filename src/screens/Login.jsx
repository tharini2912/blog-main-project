import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
} from "../firebase/index.js";
import { useUser } from "../Context/UserContext.jsx";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { appAuth, appDB } from "../firebase";

const Login = () => {
  const navigate = useNavigate();
  const {
    formFields,
    setFormFields,
    setUser,
    logoutUser,
    userEmail,
    displayName,
    setDisplayNameNew,
    getUserDisplayNameFromFirestore,
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
          getUserDisplayNameFromFirestore(uid);
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

  //for getting Display Name from DB

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
        <button type="submit">Login</button>
        <h3>
          New user? <Link to="/signup">Signup</Link>
        </h3>
      </form>
    </section>
  );
};

export default Login;
