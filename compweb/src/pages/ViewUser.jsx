// ViewUser.jsx

import React from "react";
import styles from './ViewUser.module.css';
import SpiderChart from "./SpiderChart";

const ViewUser = ({ userData, onClose }) => {
    return (
        <div className={styles.viewUserWrapper}>
            <div className={styles.viewUserHeader}>
                <h2>User Profile</h2>
                <button onClick={onClose}>X</button>
            </div>
            <div className={styles.userInfo}>
                <p>User: {userData.username}</p>
                <p>First Name: {userData.firstName}</p>
                <p>Last Name: {userData.lastName}</p>
                <p>About:</p>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{userData.about}</pre>
                <p>Points: {userData.points}</p>
                <p>Country: {userData.country}</p>
                <p>Solved Questions:</p>
                <ul>
                    {userData.solved && userData.solved.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
            {userData.skills && <SpiderChart skills={userData.skills} />}
        </div>
    );
};

export default ViewUser;
