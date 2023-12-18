import { createContext, useContext, useState, useEffect } from "react";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { appAuth, appDB } from "../firebase/index.js";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [displayNameNew, setDisplayNameNew] = useState("");

  // const [uid, setUid] = useState("");
  const [uid, setUid] = useState(localStorage.getItem("uid") || "");

  const [formFields, setFormFields] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    uid: "",
  });

  const setUser = (email, name, uid) => {
    setDisplayName(name);
    setUserEmail(email);
    setUid(uid);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("displayName", name);
    localStorage.setItem("uid", uid);
  };
  const storedUserEmail = localStorage.getItem("userEmail");

  //getting name from db

  const getUserDisplayNameFromFirestore = async (uid) => {
    try {
      const userDocRef = doc(appDB, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const { displayName } = userDocSnapshot.data();
        console.log(displayName);

        setDisplayNameNew(displayName); // Set displayNameNew in state
        localStorage.setItem("displayNameNew", displayName);
      } else {
        console.log("User document not found in Firestore");
      }
    } catch (error) {
      console.error(
        "Error fetching user document from Firestore:",
        error.message
      );
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
        getUserDisplayNameFromFirestore,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
