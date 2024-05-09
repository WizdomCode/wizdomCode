import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, deleteField, updateDoc, arrayUnion } from "firebase/firestore";

const Challenges = () => {
  const [dailyReset, setDailyReset] = useState(false);
  const [monthlyReset, setMonthlyReset] = useState(false);
  const [dailyReset, setDailyReset] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const dailyChallengeArray = ["challenge 1sui dsiuasdfiju", "challenge 2 askdiasd", "challenge 3  jdas", "challenge 4 aujsds"];
  const [dailyChallenges, setDailyChallenges] = useState([]);

  const newDailyChallenges = async () => {
    const randomChallenges = dailyChallengeArray.sort(() => 0.5 - Math.random()).slice(0, 3).map(challenge => ({
      challenge,
      points: 10,
      users: []
    }));
    // Upload to Firestore
    const challengesRef = doc(db, "Challenges", "Daily");
    // Delete existing array if exists
    await deleteField(challengesRef, "dailyChallenges");
    // Set new challenges
    await setDoc(challengesRef, { dailyChallenges: randomChallenges });
    setDailyChallenges(randomChallenges);
    console.log("Daily challenges updated:", randomChallenges);
  };

  const solveChallenge = async (index, userName) => {
    // Update Firestore document to add the user's name to the users array of the challenge
    const challengeRef = doc(db, "Challenges", "Daily");
    await updateDoc(challengeRef, {
      [`dailyChallenges.${index}.users`]: arrayUnion(userName)
    });
    console.log(`User ${userName} solved challenge ${index + 1}`);
  };

  useEffect(() => {
    const checkResetTimings = async () => {
      const now = new Date();

      // Update current date
      setCurrentDate(now);

      // Daily reset at 12 AM
      const isDailyReset = now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0;
      if (isDailyReset) {
        setDailyReset(true);
        console.log("Daily reset!");
        await newDailyChallenges();
      } else {
        setDailyReset(false);
      }

      // Weekly reset on Sundays at 12 AM
      const isWeeklyReset = now.getDay() === 0 && isDailyReset;
      if (isWeeklyReset) {
        setWeeklyReset(true);
        console.log("Weekly reset!");
      } else {
        setWeeklyReset(false);
      }

      // Monthly reset at the end of the month at 12 AM
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const isMonthlyReset = now.getDate() === endOfMonth.getDate() && isDailyReset;
      if (isMonthlyReset) {
        setMonthlyReset(true);
        console.log("Monthly reset!");
      } else {
        setMonthlyReset(false);
      }
    };

    // Check for reset timings every minute
    const interval = setInterval(checkResetTimings, 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>Current Date: {currentDate.toLocaleDateString()}</div>
      <div>{currentDate.getHours()}:{currentDate.getMinutes()}:{currentDate.getSeconds()}</div>

      {dailyReset && <div>Daily reset occurred!</div>}
      {weeklyReset && <div>Weekly reset occurred!</div>}
      {monthlyReset && <div>Monthly reset occurred!</div>}
      
      <button onClick={newDailyChallenges}>Generate New Daily Challenges</button>
    </div>
  );
};

export default Challenges;
