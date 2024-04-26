import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation/Navigation";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import "./NewIDE.css";

const NewIDE = () => {
    const [showFileForm, setShowFileForm] = useState(false);
    const [fileTypeInputValue, setFileTypeInputValue] = useState("");
    const [showFolderForm, setShowFolderForm] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isContentSaved, setIsContentSaved] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [editedContent, setEditedContent] = useState("");
    const [currentFolder, setCurrentFolder] = useState("ide"); // Default folder is "ide"

    const handleFileSubmit = async (event) => {
        event.preventDefault();
        const uid = auth.currentUser.uid;
        const ideRef = doc(db, "IDE", uid);
        try {
            const ideSnapshot = await getDoc(ideRef);
            if (ideSnapshot.exists()) {
                const existingIdeMap = ideSnapshot.data().ide || {};
                const folderPath = currentFolder !== "ide" ? `${currentFolder}.` : "";
                const updatedIdeMap = {
                    ...existingIdeMap,
                    [`${folderPath}${inputValue}`]: "blank"
                };
                const updatedFileTypes = {
                    ...ideSnapshot.data().fileTypes, // Existing file types map
                    [`${folderPath}${inputValue}`]: fileTypeInputValue // Add file type to fileTypes map
                };
                await setDoc(ideRef, { ide: updatedIdeMap, fileTypes: updatedFileTypes }, { merge: true });
                console.log("Document successfully written!");
            } else {
                console.log("No such document!");
            }
            setInputValue("");
            setFileTypeInputValue(""); // Clear file type input value
            setShowFileForm(false);
            fetchUserData();
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    };
    
    const handleFolderSubmit = async (event) => {
        event.preventDefault();
        const uid = auth.currentUser.uid;
        const ideRef = doc(db, "IDE", uid);
        try {
            const ideSnapshot = await getDoc(ideRef);
            if (ideSnapshot.exists()) {
                const existingIdeMap = ideSnapshot.data().ide || {};
                const folderPath = currentFolder !== "ide" ? `${currentFolder}.` : ""; // Add folder path if it's not the root folder
                if (inputValue.trim() !== "") { // Check if inputValue is not empty
                    const updatedIdeMap = {
                        ...existingIdeMap,
                        [`${folderPath}${inputValue}`]: {} // Create an empty object for the folder
                    };
                    await setDoc(ideRef, { ide: updatedIdeMap }, { merge: true });
                    console.log("Document successfully written!");
                }
            } else {
                console.log("No such document!");
            }
            setInputValue("");
            setShowFolderForm(false);
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
                console.log(itemName)
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
                setIsContentSaved(true);
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
    const renderFileOrFolder = (itemName, isFolder) => {
        if (isFolder) {
            return (
                <li key={itemName} onClick={() => handleItemClick(itemName)}>
                    <strong>Folder:</strong> {itemName}
                    <ul>
                        {userData && userData.ide && Object.keys(userData.ide).map((itemName, index) => (
                            renderFileOrFolder(itemName, userData.ide[itemName].__isFolder)
                        ))}
                    </ul>
                </li>
            );
        } else {
            return (
                <li key={itemName} onClick={() => handleItemClick(itemName)}>
                    {itemName}
                </li>
            );
        }
    };
    useEffect(() => {
        // Compare edited content with content saved in Firebase
        const checkContentSaved = async () => {
            try {
                //const uid = auth.currentUser.uid;
                const ideRef = doc(db, "IDE", userId);
                const ideSnapshot = await getDoc(ideRef);
                if (ideSnapshot.exists()) {
                    const savedContent = ideSnapshot.data().ide[selectedItem];
                    setIsContentSaved(savedContent === editedContent);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error checking content saved:", error);
            }
        };

        checkContentSaved(); // Call the function on component mount and whenever editedContent or selectedItem changes
    }, [editedContent, selectedItem]);
    
    return (
        <>
            <Navigation />
            <h1>IDE</h1>
            <p>TEST IDE</p>
            <h1>IDE</h1>
            <p>TEST IDE</p>
            <h1>IDE</h1>
            <p>TEST IDE</p>
            {!showFileForm && (
                <button onClick={() => setShowFileForm(true)}>Create File</button>
            )}
            {showFileForm && (
                <form onSubmit={handleFileSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                    />
                    <input
                        type="text"
                        value={fileTypeInputValue}
                        onChange={(e) => setFileTypeInputValue(e.target.value)}
                        placeholder="File Type"
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
            {!showFolderForm && (
                <button onClick={() => setShowFolderForm(true)}>Create Folder</button>
            )}
            {showFolderForm && (
                <form onSubmit={handleFolderSubmit}>
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
                    renderFileOrFolder(itemName, userData.ide[itemName].__isFolder)
                ))}
            </ul>
            {selectedItem && (
                <div>
                    {isContentSaved ? (
                        <h3>Saved</h3>
                    ) : (
                        <h3>Not Saved</h3>
                    )}
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
