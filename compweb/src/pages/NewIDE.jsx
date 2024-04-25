import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation/Navigation";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import "./NewIDE.css";

const NewIDE = () => {
    const [showForm, setShowForm] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const uid = auth.currentUser.uid;
        const ideRef = doc(db, "IDE", uid);
        try {
            const ideSnapshot = await getDoc(ideRef);
            if (ideSnapshot.exists()) {
                const existingIdeMap = ideSnapshot.data().ide || {};
                const updatedIdeMap = {
                    ...existingIdeMap,
                    [inputValue]: "blank"
                };
                await setDoc(ideRef, { ide: updatedIdeMap }, { merge: true });
                console.log("Document successfully written!");
            } else {
                console.log("No such document!");
            }
            setInputValue("");
            setShowForm(false);
            fetchUserData(); // Call fetchUserData to update the file list
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    };

    const handleItemClick = async (itemName) => {
        try {
            const uid = auth.currentUser.uid;
            const ideRef = doc(db, "IDE", uid);
            const ideSnapshot = await getDoc(ideRef);
            if (ideSnapshot.exists()) {
                const itemData = ideSnapshot.data().ide[itemName];
                setSelectedItem(itemName);
                setEditedContent(itemData); // Set the edited content to the selected item data
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching item data:", error);
        }
    };

    const handleSave = async () => {
        try {
            const uid = auth.currentUser.uid;
            const ideRef = doc(db, "IDE", uid);
            const ideSnapshot = await getDoc(ideRef);
            if (ideSnapshot.exists()) {
                const existingIdeMap = ideSnapshot.data().ide || {};
                const updatedIdeMap = {
                    ...existingIdeMap,
                    [selectedItem]: editedContent // Update the content of the selected item
                };
                await setDoc(ideRef, { ide: updatedIdeMap }, { merge: true });
                console.log("Document successfully updated!");
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    useEffect(() => {
        fetchUserData(); // Call fetchUserData on component mount
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserData(); // Call fetchUserData when auth state changes
            }
        });
        return unsubscribe;
    }, []);

    const fetchUserData = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUserId(currentUser.uid);
                const userDocRef = doc(db, "IDE", currentUser.uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setUserData(userData);
                } else {
                    console.log("No such document!");
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <>
            <Navigation />
            <h1>IDE</h1>
            <p>TEST IDE</p>
            {!showForm && (
                <button onClick={() => setShowForm(true)}>Create File</button>
            )}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
            <p>Files and Folders:</p>
            <ul>
                {userData && userData.ide && Object.keys(userData.ide).map((itemName, index) => (
                    <li key={index} onClick={() => handleItemClick(itemName)}>
                        {itemName}
                    </li>
                ))}
            </ul>
            {selectedItem && (
                <div>
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    ></textarea>
                    <button onClick={handleSave}>Save</button>
                </div>
            )}
        </>
    );
};

export default NewIDE;
