import { createContext, useContext, useState, useEffect } from "react";
import { collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { appAuth, appDB } from "../firebase/index.js";
import "firebase/firestore";
import { imageDb } from "../firebase/index.js";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [displayNameNew, setDisplayNameNew] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [pinCode, setPinCode] = useState(null);

  const [blogImage, setBlogImage] = useState(null);
  const [blogImageUrl, setBlogImageUrl] = useState(null);

  // const [uid, setUid] = useState("");
  const [uid, setUid] = useState(localStorage.getItem("uid") || "");

  // const [formFields, setFormFields] = useState({
  //   displayName: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  //   uid: "",
  //   avatar: "",
  // });

  const [formFields, setFormFields] = useState({
    displayName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    uid: "",
    avatar: "",
  });

  const setUser = (email, name, uid) => {
    setDisplayName(name);
    setUserEmail(email);
    setUid(uid);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("displayName", name);
    localStorage.setItem("uid", uid);
    fetchAvatarURL(uid);
  };
  const storedUserEmail = localStorage.getItem("userEmail");

  //getting user profile info

  const getUserProfileInfoFromFirestore = async (uid) => {
    try {
      const userDocRef = doc(appDB, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const {
          displayName,
          lastName,
          email,
          address,
          city,
          state,
          phoneNumber,
          pinCode,
        } = userDocSnapshot.data();
        console.log(displayName);
        console.log(lastName);
        console.log(email);
        console.log(address);
        console.log(city);
        console.log(state);
        console.log(phoneNumber);
        setDisplayNameNew(displayName);
        setLastName(lastName);
        setAddress(address);
        setCity(city);
        setState(state);
        setPhoneNumber(phoneNumber);
        setEmail(email);
        setPinCode(pinCode);
        localStorage.setItem("displayNameNew", displayName);
      } else {
        console.log("user document is not found in fs");
      }
    } catch (error) {
      console.error("firestore fetching error", error.message);
    }
  };

  //for fetching displayImage

  const fetchAvatarURL = async (uid) => {
    try {
      const userDocRef = doc(appDB, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const { avatar } = userDocSnapshot.data();
        setAvatar(avatar);
      } else {
        console.log("User document not found in Firestore");
      }
    } catch (error) {
      console.error("Error fetching avatar URL:", error.message);
    }
  };

  //function for uploading blog image:

  const uploadBlogPhoto = async (file, blogUniqueId) => {
    try {
      const path = `blogImages/${blogUniqueId}.jpg`;
      const storageRef = ref(imageDb, path);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading blog photo:", error.message);
      throw error;
    }
  };

  //for fetching blogImage url

  const fetchBlogImageURL = async (uid) => {};

  //for updating profile
  const updateProfileDocument = async (userId, data) => {
    try {
      const userRef = doc(appDB, "users", userId);
      await setDoc(userRef, data, { merge: true });
      const updatedProfile = await getDoc(userRef);
      return updatedProfile.data();
    } catch (error) {
      console.error("Error updating profile document:", error.message);
      throw error;
    }
  };

  //profile displayImage update

  const uploadAvatar = async (file, userId) => {
    try {
      const path = "userId" + ".jpg";
      const storageRef = ref(imageDb, `images/${path}`);
      await uploadBytes(storageRef, file);
      const avatarUrl = await getDownloadURL(storageRef);
      return avatarUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error.message);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        setUser,
        userEmail,
        displayName,
        formFields,
        setFormFields,
        storedUserEmail,
        uid,
        displayNameNew,
        setDisplayNameNew,
        avatar,
        setAvatar,
        fetchAvatarURL,
        avatarUrl,
        setAvatarUrl,
        updateProfileDocument,
        uploadAvatar,
        blogImage,
        setBlogImage,
        blogImageUrl,
        setBlogImageUrl,
        fetchBlogImageURL,
        uploadBlogPhoto,
        getUserProfileInfoFromFirestore,
        lastName,
        address,
        city,
        state,
        phoneNumber,
        email,
        pinCode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
