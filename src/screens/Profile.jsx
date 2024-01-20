import React from "react";
import { useUser } from "../Context/UserContext";

const Profile = () => {
  const { avatar, displayNameNew, avatarUrl, setAvatarUrl, setAvatar, updateProfileDocument, uploadAvatar, uid } = useUser();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const newName = e.target.elements.changeName.value;
    const newAvatar = e.target.elements.newPicture.files[0];
    const userId = uid;
    const updatedProfile = await updateProfileDocument(userId, { displayName: newName });
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
    <section className="profile-page">
      <div className="profile-detail">
        {avatar && <img className="profile-page-img" src={avatar} alt="" />}
        <h1>Hello {displayNameNew}</h1>
      </div>
      <div className="update-profile-detail">
        <h1 className="clr-profile-update">Update Profile</h1>
        <form onSubmit={handleProfileUpdate}>
          <label className="clr-profile-update" htmlFor="changeName">
            Change Display Name
          </label>
          <input className="up-input" type="text" id="changeName" name="changeName" />

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
