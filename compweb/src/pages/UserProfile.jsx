import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import SpiderChart from "./SpiderChart";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false); // State to track edit mode
  const [editedUserData, setEditedUserData] = useState(null); // State to hold edited user data

  const authenticatedUser = useSelector(state => state.authenticatedUser);
  const skills = {
    JavaScript: 0.9,
    HTML: 0.85,
    CSS: 0.95,
    React: 0.8,
    Nodejs: 0.7,
    Git: 0.9,
    Communication: 0.95,
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current user
        const currentUser = auth.currentUser;

        if (currentUser) { // Check if currentUser is not null
          setUserId(currentUser.uid); // Set the user ID

          // Get the document reference for the current user from Firestore
          const userDocRef = doc(db, "Users", currentUser.uid);

          // Fetch user data from Firestore
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            // Extract required user information from the snapshot
            const userData = userSnapshot.data();
            setUserData(userData); // Set the user data in the state
            setEditedUserData(userData); // Initialize editedUserData with user data
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [auth.currentUser]); // Empty dependency array ensures the effect runs only once when the component mounts

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      // Update user data in Firestore
      const userDocRef = doc(db, "Users", userId);
      await updateDoc(userDocRef, editedUserData);
      setUserData(editedUserData); // Update userData with edited data
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false); // Exit edit mode without saving changes
    setEditedUserData(userData); // Reset editedUserData to original user data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <>
      <h1>User Profile</h1>
      {userData && (
        <div>
{editMode ? (
  <>
    <p>User: <input type="text" name="username" value={editedUserData.username} onChange={handleInputChange} /></p>
    <p>First Name: <input type="text" name="firstName" value={editedUserData.firstName} onChange={handleInputChange} /></p>
    <p>Last Name: <input type="text" name="lastName" value={editedUserData.lastName} onChange={handleInputChange} /></p>
    <p>About Me: <textarea name="about" value={editedUserData.about} onChange={handleInputChange} /></p>
    <p>Country: <input type="text" name="country" value={editedUserData.country} onChange={handleInputChange} /></p>
    <button onClick={handleSaveClick}>Save</button>
    <button onClick={handleCancelClick}>Cancel</button>
  </>
) : (
  <>
    <p>User: {userData.username}</p>
    <p>First Name: {userData.firstName}</p>
    <p>Last Name: {userData.lastName}</p>
    <p>About:</p>
    <pre style={{ whiteSpace: 'pre-wrap' }}>{userData.about}</pre>
    <p>Points: {userData.points}</p>
    <p>Country: {userData.country}</p>
    <button onClick={handleEditClick}>Edit Profile</button>
  </>
)}


          <p>Solved Questions:</p>
          <ul>
            {userData.solved && userData.solved.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <SpiderChart skills={userData.skills} />
        </div>
      )}
    </>
  );
};

export default UserProfile;
