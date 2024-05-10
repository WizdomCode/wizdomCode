import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import SpiderChart from "./SpiderChart";
import { Tabs, rem, Avatar, Button, Group, Table, Fieldset, TextInput, Textarea } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings, IconMapPin } from '@tabler/icons-react';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const iconStyle = { width: rem(12), height: rem(12) };

  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false); // State to track edit mode
  const [editedUserData, setEditedUserData] = useState(null); // State to hold edited user data

  const authenticatedUser = useSelector(state => state.authenticatedUser);
  
  const [problemData, setProblemData] = useState(null);

  useEffect(() => {
    
    async function getProblemData() {
      let documentsData = [];

      async function getDocumentData(db, collectionName, docId) {
        const docRef = doc(db, collectionName, docId);
        const snapshot = await getDoc(docRef);
    
        if (snapshot.exists()) {
            return snapshot.data();
        } else {
            console.log(`Document with ID ${docId} does not exist.`);
            return null;
        }
      }

      for (let docId of userData.solved) {
        let docData = await getDocumentData(db, "Questions", docId);
        if (docData !== null) {
            documentsData.push(docData);
        }
      }
      
      return documentsData;
    }

    if (!problemData) getProblemData().then(data => { console.log("Problemdata", data); setProblemData(data); });
  }, [userData]);

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
            console.log("Fetched userData", userData);
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
      <div style={{ height: '160px', backgroundColor: 'var(--navbar)', borderRadius: '8px' }}/>
      <div>
        <div className={styles.marginSpacing}>
          <Group justify="space-between">
            <div>
              <Avatar src={userData && userData.avatar} style={{ width: '100px', height: '100px', marginTop: '-50px' }}/>
              <div style={{ display: 'flex', direction: 'row', alignItems: 'center', gap: '10px' }}>
                { userData && (
                  userData.firstName && userData.lastName ? (
                    <div>
                      <h1>{`${userData.firstName} ${userData.lastName}`}</h1>
                      <p style={{ fontSize: '16px', marginTop: '-6px', color: 'gray'}}>{userData.username}</p>
                    </div>
                  ) : (
                    <h1>{userData.username}</h1>
                  )
                )}
              </div>

              <br />

              <Group>
                <div style={{ display: 'flex', direction: 'row' }}>
                  <h4>{userData && userData.points}</h4>
                  <p style={{ fontSize: '16px', color: 'gray', marginLeft: '6px' }}> Points</p>
                </div>

                <div style={{ display: 'flex', direction: 'row' }}>
                  <h4>{userData && userData.solved.length}</h4>
                  <p style={{ fontSize: '16px', color: 'gray', marginLeft: '6px' }}> Problems solved</p>
                </div>
              </Group>

              <div style={{ height: '10px' }}/>

              <Group>
                <IconMapPin />
                <p style={{ marginTop: '1px'}}>{userData && userData.country}</p>
              </Group>
            </div>
            <div>
              <Button>hello</Button>
            </div>
          </Group>
        </div>
        <br />
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconPhoto style={iconStyle} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="solved" leftSection={<IconMessageCircle style={iconStyle} />}>
              Solved
            </Tabs.Tab>
            <Tabs.Tab value="edit" leftSection={<IconSettings style={iconStyle} />}>
              Edit
            </Tabs.Tab>
          </Tabs.List>

          <br />

          <Tabs.Panel value="overview">
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
                    <h3>About</h3>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{userData.about}</pre>
                  </>
                )}
                <br />
                <h3>Skill Distribution</h3>
                <SpiderChart skills={userData.skills} />
              </div>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="solved">
            <h3>Solved Problems</h3>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Points</Table.Th>
                  <Table.Th>Topics</Table.Th>
                  <Table.Th>Contest</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                { problemData && 
                  problemData.map((problem) => (
                    <Table.Tr key={problem.title}>
                      <Table.Td>{problem.title}</Table.Td>
                      <Table.Td>{problem.points}</Table.Td>
                      <Table.Td>{problem.topics}</Table.Td>
                      <Table.Td>{problem.specificContest}</Table.Td>
                    </Table.Tr>
                  ))
                }
              </Table.Tbody>
            </Table>
          </Tabs.Panel>

          <Tabs.Panel value="edit">
            { editedUserData && 
              <Fieldset legend="Personal information">
                <TextInput label="Username" placeholder="Username" name="username" value={editedUserData.username} onChange={handleInputChange}/>
                <TextInput label="First name" placeholder="First name" mt="md" name="firstName" value={editedUserData.firstName} onChange={handleInputChange}/>
                <TextInput label="Last name" placeholder="Last name" mt="md" name="lastName" value={editedUserData.lastName} onChange={handleInputChange}/>
                <Textarea
                  label="About me"
                  placeholder=""
                  mt="md"
                  name="about" 
                  value={editedUserData.about} 
                  onChange={handleInputChange}
                />
                <TextInput label="Country" placeholder="Country" mt="md" name="country" value={editedUserData.country} onChange={handleInputChange}/>

                <Group justify="flex-end" mt="md">
                  <Button onClick={handleSaveClick}>Submit</Button>
                  <Button onClick={handleCancelClick}>Clear changes</Button>
                </Group>
              </Fieldset>
            }
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
};

export default UserProfile;
