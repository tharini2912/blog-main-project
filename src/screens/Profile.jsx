import React from "react";
import { useUser } from "../Context/UserContext";
import { useEffect } from "react";
import {getAuth, reauthenticateWithCredential, EmailAuthProvider, updateEmail} from "firebase/auth"

const Profile = () => {
  const {
    avatar,
    displayNameNew,
    avatarUrl,
    setAvatarUrl,
    setAvatar,
    updateProfileDocument,
    uploadAvatar,
    uid,
    formFields,
    lastName,
    address,
    getUserProfileInfoFromFirestore,
    email,
    city,
    state,
    phoneNumber,
    pinCode,
  } = useUser();

  useEffect(() => {
    getUserProfileInfoFromFirestore(uid);
  }, [uid, getUserProfileInfoFromFirestore]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const newName = e.target.elements.changeName.value;
    const newLastName = e.target.elements.changeLastName.value;
    const newAddress = e.target.elements.changeAddress.value;
    const newCity = e.target.elements.changeCity.value;
    const newState = e.target.elements.changeState.value;
    const newPhoneNumber = e.target.elements.changeNumber.value;
    const newPinCode = e.target.elements.changePinCode.value;
    const newEmail = e.target.elements.changeEmail.value;
    const newAvatar = e.target.elements.newPicture.files[0];
    const userId = uid;

    // ////////////////////////////////////////////////
    const auth = getAuth();
const user = auth.currentUser;
const promptForCredentials = () => {
  const password = prompt('Please enter your password:');
  return EmailAuthProvider.credential(user.email, password);
};

const credential = promptForCredentials();

try {
  await reauthenticateWithCredential(user, credential);

} catch (error) {
  console.error('Error reauthenticating user:', error.message);
  return;
}

// Update email in Firebase Authentication
try {
  await updateEmail(user, newEmail);
} catch (error) {
  console.error('Error updating email:', error.message);
  return;
}


    //////////////////////////////////////////////////
    const updatedProfile = await updateProfileDocument(userId, {
      displayName: newName,
      lastName: newLastName,
      address: newAddress,
      city: newCity,
      state: newState,
      phoneNumber: newPhoneNumber,
      pinCode: newPinCode,
      email: newEmail,
    });
    if (newAvatar) {
      const avatarUrl = await uploadAvatar(newAvatar, userId);
      setAvatarUrl(avatarUrl);
      setAvatar(newAvatar);
      await updateProfileDocument(userId, { avatar: avatarUrl });
    }

    e.target.reset();
    window.alert("Profile Details Updated Successfully");
  };

  return (
    <section className="main-profile">
      <div className="title-head">
      <h1 className="title-profile">Hello {displayNameNew}</h1>
      </div>
       
      <div className="profile-page">
     
      <div className="profile-detail">
      
        {avatar && <img className="profile-page-img" src={avatar} alt="" />}
        
        
      </div>
      <div className="user-detail">
        <h2>Profile Information</h2>
      <p>{`${displayNameNew}${" "}${lastName}`}</p>


<p>{email}</p>
<p>{address}</p>
<p>{city}</p>
<p>{state}</p>
<p>{pinCode}</p>
<p>{phoneNumber}</p>
      </div>
      </div>
      
      <div className="update-profile-detail">
        <h1 className="clr-profile-update">Update Profile</h1>
        <form onSubmit={handleProfileUpdate}>
          <div className="for-row-fix cntr">
            <div className="test-flr">
            <label className="clr-profile-update" htmlFor="changeName">
            First Name
          </label>
          <input
            className="up-input"
            type="text"
            id="changeName"
            name="changeName"
            required
          />
            </div>
          <div className="test-flr">
          <label className="clr-profile-update" htmlFor="changeName">
            Last Name
          </label>
          <input
            className="up-input"
            type="text"
            id="changeLastName"
            name="newLastName"
            required
          />
          </div>
          
          </div>

          {/*  */}
          <div className="for-row-fix cntr">
            <div className="test-flr">
            <label className="clr-profile-update" htmlFor="changeName">
            Email
          </label>
          <input
            className="up-input"
            type="text"
            id="changeEmail"
            name="newEmail"
            required
          />
            </div>
          <div className="test-flr">
          <label className="clr-profile-update" htmlFor="changeName">
            Address
          </label>
          <input
            className="up-input"
            type="text"
            id="changeAddress"
            name="newAddress"
            required
          />
          </div>
          
          </div>
          {/*  */}

          {/*  */}
          <div className="for-row-fix cntr">
            <div className="test-flr">
            <label className="clr-profile-update" htmlFor="changeName">
            City
          </label>
          <select
              id="changeCity"
              className=""
              required
              name="newCity"
            >
              <option value="" disabled selected>
                Select a city
              </option>
              <option value="Chennai">Chennai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Trichy">Trichy</option>
              <option value="Tirunelveli">Tirunelveli</option>
              <option value="Kanyakumari">Kanyakumari</option>
            </select>
            </div>
          <div className="test-flr">
          <label className="clr-profile-update" htmlFor="changeName">
            State
          </label>
          <input
            className="up-input"
            type="text"
            id="changeState"
            name="newState"
            required
          />
          </div>
          
          </div>
          {/*  */}

          {/*  */}
          <div className="for-row-fix cntr">
            <div className="test-flr">
            <label className="clr-profile-update" htmlFor="changeName">
            Phone Number
          </label>
          <input
            className="up-input"
            type="text"
            id="changeNumber"
            name="newNumber"
            required
          />
            </div>
          <div className="test-flr">
          <label className="clr-profile-update" htmlFor="changeName">
            Pincode
          </label>
          <input
            className="up-input"
            type="text"
            id="changePinCode"
            name="newPinCode"
            required
          />
          </div>
          
          </div>
          {/*  */}
          

          <label htmlFor="newPicture" className="newPicture">
            <span className="clr-profile-update">Avatar</span>
            <input type="file" id="newPicture" name="newPicture" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
};

export default Profile;
