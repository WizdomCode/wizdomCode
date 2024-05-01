import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import Navigation from "../components/Navigation/Navigation";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import SpiderChart from "./SpiderChart";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);

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

  // Log user data whenever it changes
  useEffect(() => {
    console.log("User Data:", userData);
  }, [userData]);

  return (
    <>
      <h1>User Profile</h1>
      {userData && (
        <div>
          <p>User: {userData.username}</p>
          <p>First Name: {userData.firstName}</p>
          <p>Last Name: {userData.lastName}</p>
          <p>Points: {userData.points}</p>
          <p>Country: {userData.country}</p>
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
