import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./Achievements.css"; // Make sure to create this CSS file for styling

const Achievements = () => {
    const [achievements, setAchievements] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("General");

    useEffect(() => {
        const fetchAchievements = async (documentId) => {
            try {
                const achievementsRef = doc(db, "Achievements", documentId);
                const achievementsDoc = await getDoc(achievementsRef);

                if (achievementsDoc.exists()) {
                    return achievementsDoc.data();
                } else {
                    return null;
                }
            } catch (error) {
                return null;
            }
        };

        const fetchAllAchievements = async () => {
            const documentIds = ["General", "Challenges", "ComputingContest", "Community", "Miscellaneous"];
            const allData = {};

            for (const docId of documentIds) {
                const data = await fetchAchievements(docId);
                if (data) {
                    allData[docId] = data;
                }
            }

            setAchievements(allData);
        };

        fetchAllAchievements();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const calculateStars = (userPoints, totalPoints) => {
        let stars = 0;
        let relevantTotal = totalPoints[0];

        for (let i = 0; i < totalPoints.length; i++) {
            if (userPoints >= totalPoints[i]) {
                stars++;
                if (i < totalPoints.length - 1) {
                    relevantTotal = totalPoints[i + 1];
                } else {
                    relevantTotal = totalPoints[i];
                }
            }
        }

        const progress = Math.min(userPoints, relevantTotal);

        return { stars, starCount: totalPoints.length, progress, relevantTotal };
    };

    const addPointsToCategory = async (category, points) => {
        try {
            const currentUser = auth.currentUser.uid;
            let achievementFound = false;

            for (const docId of Object.keys(achievements)) {
                const achievement = achievements[docId];
                
                if (achievement.category === category) {
                    const achievementRef = doc(db, "Achievements", docId);
                    const currentPoints = achievement.points[currentUser] || 0;
                    const newPoints = currentPoints + points;

                    await updateDoc(achievementRef, {
                        [`points.${currentUser}`]: newPoints
                    });

                    setAchievements((prevAchievements) => ({
                        ...prevAchievements,
                        [docId]: {
                            ...prevAchievements[docId],
                            points: {
                                ...prevAchievements[docId].points,
                                [currentUser]: newPoints
                            }
                        }
                    }));

                    achievementFound = true;
                    break;
                }
            }

            if (!achievementFound) {
            }
        } catch (error) {
        }
    };

    return (
        <div>
            <h1>Achievements</h1>
            <div>
                {["General", "Challenges", "ComputingContest", "Community", "Miscellaneous"].map((category) => (
                    <button key={category} onClick={() => handleCategoryChange(category)}>
                        {category}
                    </button>
                ))}
            </div>
            <div className="achievement-cards">
                {achievements[selectedCategory] ? (
                    Object.keys(achievements[selectedCategory]).map((achievementName) => {
                        const achievement = achievements[selectedCategory][achievementName];
                        const currentUser = auth.currentUser.uid;

                        const userPoints = achievement.points[currentUser]; // Replace <USER_ID> with actual user ID
                        const totalPoints = achievement.total; // Assuming total points is an array

                        const { stars, starCount, progress, relevantTotal } = calculateStars(userPoints, totalPoints);

                        return (
                            <div key={achievementName} className="achievement-card">
                                <h2>{achievementName}</h2>
                                <p>
                                    {stars}/{starCount} stars
                                </p>
                                <p>
                                    {progress}/{relevantTotal}
                                </p>
                                <p>
                                    {achievement.p1}
                                    {achievement.p2 && ` ${relevantTotal} ${achievement.p2}`}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            {/* If you want to use SpiderChart component to display the data, you can pass the data as props */}
            {/* {achievements[selectedCategory] && <SpiderChart data={achievements[selectedCategory]} />} */}
        </div>
    );
};

export default Achievements;
