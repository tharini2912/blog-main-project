import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../firebase/index.js";
import { useUser } from "../Context/UserContext.jsx";
import { useState } from "react";
import { imageDb } from "../firebase/index.js";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";


const SignUp = () => {
  const navigate = useNavigate();
  const { formFields, setFormFields, setUser, userEmail, avatar, setAvatar, avatarUrl, setAvatarUrl } =
    useUser();
  const { displayName, email, password, confirmPassword} = formFields;

  // const [avatarUrl, setAvatarUrl] = useState(null);
  // const [avatar, setAvatar] = useState(null);

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

    let imageRef;


if (!avatar) {
  console.log("No File Selected");
} else {
  const imageId = user.uid;
  imageRef = ref(imageDb, `images/${imageId}`);
  await uploadBytes(imageRef, avatar); 

  const imageUrl = await getDownloadURL(imageRef); 
  const userDocRef = await createUserDocumentFromAuth(user, {
    displayName,
    avatar: imageUrl,
  });

      if (userDocRef) {
        alert("SignUp Success");
        navigate("/login");
      }
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
  
    if (file) {
      setAvatar(file);
      setAvatarUrl(URL.createObjectURL(file));
    } else {
      console.log("No File Selected");
    }
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
        <label className="upload-photo">
          <span>Avatar</span>

          <input
            type="file"
            id="displayImage"
            name="displayImage"
            onChange={handleFileUpload}
          />
          {avatarUrl && (
            <img
              className="img-container-profile"
              src={avatarUrl}
              alt="Avatar Preview"
            />
          )}
        </label>
        <button type="submit">Signup</button>
        <h3>
          Already have an Account? <Link to="/login">Login</Link>
        </h3>
      </form>
    </section>
  );
};

export default SignUp;


