import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import Navigation from "../components/Navigation/Navigation";
import { doc, getDoc } from "firebase/firestore";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, "Users", auth.currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserData(userDocSnapshot.data());
          } else {
            console.log("User document does not exist.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []); // Empty dependency array

  return (
    <>
      <Navigation />
      <h1>User Profile</h1>
      {userData ? (
        <div>
          <p>Name: {userData.firstName} {userData.lastName}</p>
          <p>Points: {userData.points}</p>
          <p>Age: {userData.age}</p>
          {/* Add more fields as needed */}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </>
  );
};

export default UserProfile;
