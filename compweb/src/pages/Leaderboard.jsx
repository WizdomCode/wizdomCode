import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation/Navigation";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Sidebar from "../components/Navigation/Sidebar";
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Get a reference to the Users collection
                const usersCollectionRef = collection(db, "Users");
                
                // Create a query to get all users ordered by points
                const usersQuery = query(usersCollectionRef, orderBy("points", "desc"));
                
                // Fetch users from Firestore
                const querySnapshot = await getDocs(usersQuery);
                
                // Map through the query snapshot to extract user data
                const userData = querySnapshot.docs.map(doc => doc.data());
                
                // Assign ranks to users
                const rankedUsers = assignRanks(userData);
                
                // Set the users state
                setUsers(rankedUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Function to assign ranks to users considering ties
    const assignRanks = (usersData) => {
        let currentRank = 1;
        let currentPoints = usersData[0].points;
        
        // Assign ranks based on points
        for (let i = 0; i < usersData.length; i++) {
            if (usersData[i].points < currentPoints) {
                currentRank = i + 1;
                currentPoints = usersData[i].points;
            }
            usersData[i].rank = currentRank;
        }
        
        return usersData;
    };

    return (
        <div className={styles.leaderboardWrapper}>
            <h1 className={styles.leaderboardHeader}>Leaderboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Points</th>
                        <th>Country</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.rank}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.points}</td>
                            <td>{user.country}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
