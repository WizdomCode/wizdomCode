import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import "./index.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const addUserIdToPointsArray = async (userId) => {
    const documentIds = ["General", "Challenges", "ComputingContest", "Community", "Miscellaneous"];

    for (const documentId of documentIds) {
        try {
            const docRef = doc(db, "Achievements", documentId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                let updated = false;

                // Iterate over each key in the document data
                for (const key in data) {
                    if (data.hasOwnProperty(key) && typeof data[key] === 'object' && data[key] !== null) {
                        // Check if the object has a points property and it's an array
                        if (Array.isArray(data[key].points)) {
                            // Add the userId: 0 to the points array
                            data[key].points.push({ [userId]: 0 });
                            updated = true;
                        }
                    }
                }

                // If any updates were made, update the document
                if (updated) {
                    await updateDoc(docRef, data);
                    console.log(`Updated ${documentId} document.`);
                } else {
                    console.log(`No updates needed for ${documentId} document.`);
                }
            } else {
                console.log(`Document ${documentId} does not exist.`);
            }
        } catch (error) {
            console.error(`Error updating document ${documentId}:`, error);
        }
    }
};
  const signUp = async (e) => {
    e.preventDefault();
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User UID:", user.uid);
  
      // Set user information with the same ID as the user's authentication UID
      const userDocRef = doc(db, "Users", user.uid);
  
      // Create an empty array called "solved" for each new user
      const skills = {
        "Ad Hoc": 0,
        "Data Structures": 0,
        "Dynamic Programming": 0,
        "Graph Theory": 0,
        "Greedy Algorithms": 0,
        "Math": 0,
        "String Algorithms": 0
        // Add more skills here if needed
      };
  
      const userData = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        country: country,
        city: city,
        age: parseInt(age, 10),
        points: 0,
        coins: 0,
        solved: [], // Empty array for solved problems
        solvedCategories: [],
        streak: 0,
        skills: skills // Assign the skills map to userData
      };
  
      await setDoc(userDocRef, userData);
      addUserIdToPointsArray(user.uid);
      console.log("User information added to Firestore successfully!");
      
      // Redirect to the home page after successful sign-up
      navigate("/"); // Replace "/" with the path of your home page
  
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
  

  return (
    <>
      <div className="container-signin">
        <section className="wrapper">
          <div className="heading">
            <h1 className="text text-large">
              <strong>Sign Up</strong>
            </h1>
            <p className="text text-normal">
              Already a user?
              <span>
                <a href="/login" className="text text-links">
                  Log In
                </a>
              </span>
            </p>
          </div>
          <form onSubmit={signUp}>
                        <div class="input-control">
                            <input
                                type = "text" placeholder="Enter username" value={username} onChange = {(e) => setUsername(e.target.value)} class="input-field">
                            </input>
                        </div>
                        <div class="input-control">
                            <input
                                type = "text" placeholder="Enter your first name" value={firstName} onChange = {(e) => setFirstName(e.target.value)} class="input-field">
                            </input>
                        </div>
                        <div class="input-control">
                            <input
                                type = "text" placeholder="Enter your last name" value={lastName} onChange = {(e) => setLastName(e.target.value)} class="input-field">
                            </input>
                        </div>
                        <div class="input-control">
                            <input
                                type = "text" placeholder="Enter your country" value={country} onChange = {(e) => setCountry(e.target.value)} class="input-field">
                            </input>
                        </div>
                        <div class="input-control">
                            <input
                                type = "text" placeholder="Enter your city" value={city} onChange = {(e) => setCity(e.target.value)} class="input-field">
                            </input>
                        </div>
                        <div className="input-control">
                            <input
                                type="number" // Change the input type for age
                                placeholder="Enter your age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div class="input-control">
                            <input
                                type = "email" placeholder="Enter your email" value={email} onChange = {(e) => setEmail(e.target.value)} class="input-field">
                            </input>
                        </div>
                        <div class="input-control">
                            <input
                                type = "password" placeholder="Enter your password" value={password} onChange = {(e) => setPassword(e.target.value)} class="input-field">
                            </input>
                        </div>
                        <button type = "submit" name = "submit" class = "input-submit" value = "Sign In">Submit</button>
                    </form>
                </section>
            </div>
        </>
    );
};

export default SignUp;