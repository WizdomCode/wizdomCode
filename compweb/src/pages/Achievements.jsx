import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import SpiderChart from "./SpiderChart";

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
                    console.log(`Document ${documentId} does not exist.`);
                    return null;
                }
            } catch (error) {
                console.error("Error fetching achievements:", error);
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
            <div>
                {achievements[selectedCategory] ? (
                    <pre>{JSON.stringify(achievements[selectedCategory], null, 2)}</pre>
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
