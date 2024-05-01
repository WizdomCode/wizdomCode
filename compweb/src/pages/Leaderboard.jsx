import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import styles from './Leaderboard.module.css';
import ViewUser from "./ViewUser";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(db, "Users");
        const usersQuery = query(usersCollectionRef, orderBy("points", "desc"));
        const querySnapshot = await getDocs(usersQuery);
        const userData = querySnapshot.docs.map(doc => doc.data());
        const rankedUsers = assignRanks(userData);
        setUsers(rankedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const assignRanks = (usersData) => {
    let currentRank = 1;
    let currentPoints = usersData[0].points;

    for (let i = 0; i < usersData.length; i++) {
      if (usersData[i].points < currentPoints) {
        currentRank = i + 1;
        currentPoints = usersData[i].points;
      }
      usersData[i].rank = currentRank;
    }

    return usersData;
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
  user.username?.toLowerCase().includes(searchQuery.toLowerCase())
);

  const handleUserClick = (userData) => {
    setSelectedUser(userData);
  };

  const handleCloseUser = () => {
    setSelectedUser(null);
  };

  return (
    <div className={styles.leaderboardWrapper}>
      <h1 className={styles.leaderboardHeader}>Global Rankings</h1>
      <input
        type="text"
        placeholder="Search by username"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {selectedUser ? (
        <ViewUser userData={selectedUser} onClose={handleCloseUser} />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Points</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} onClick={() => handleUserClick(user)}>
                <td>{user.rank}</td>
                <td>{user.username}</td>
                <td>{user.points}</td>
                <td>{user.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;