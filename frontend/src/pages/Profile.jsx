import React from 'react';
import Nav from '../components/Nav/Nav';
import ProfileDetails from '../components/Profile/ProfileDetails';
import ProfilePhotoSection from '../components/Profile/ProfilePhotoSection';
import '../styles/Profile.css';

const Profile = () => {
  return (
    <>
      <Nav />
      <div className="profile-page">
        <ProfileDetails />
        <ProfilePhotoSection />
      </div>
    </>
  );
};

export default Profile;