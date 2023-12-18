import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../firebase/index.js";
import { useUser } from "../Context/UserContext.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const { formFields, setFormFields, setUser, userEmail } = useUser();
  const { displayName, email, password, confirmPassword } = formFields;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password do not Match");
      return;
    }
    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      const userDocRef = await createUserDocumentFromAuth(user, {
        displayName,
      });
      if (userDocRef) {
        alert("SignUp Success");
        navigate("/login");
      }
    } catch (err) {
      console.log("Something Happened", err.message);
      console.log(err.code);
      if (err.code === "auth/email-already-in-use") {
        alert("Email Already Exists Please use alternate Email");
      } else if (err.code === "auth/weak-password") {
        alert("Password must be at least 6 characters long");
      }
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <section className="for-signup-bg">
      <form action="" onSubmit={submitHandler}>
        <h2>Signup</h2>
        <input
          type="text"
          id="display-name"
          name="displayName"
          required
          onChange={changeHandler}
          placeholder="Username"
        />
        <input
          type="email"
          id="email"
          name="email"
          required
          onChange={changeHandler}
          placeholder="Email"
        />
        <input
          type="password"
          id="password"
          name="password"
          required
          onChange={changeHandler}
          placeholder="Password"
        />
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          onChange={changeHandler}
          placeholder="Confirm Password"
        />
        <button type="submit">Signup</button>
        <h3>
          Already have an Account? <Link to="/login">Login</Link>
        </h3>
      </form>
    </section>
  );
};

export default SignUp;
