import React, {useState} from "react";
import Navigation from "../components/Navigation/Navigation";
import { auth, app, db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const AddProblem = () => {
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [contest, setContest] = useState("");
    const [description, setDescription] = useState("");
    const [folder, setFolder] = useState("");
    const [inputFormat, setInputFormat] = useState("");
    const [outputFormat, setOutputFormat] = useState("");
    const [points, setPoints] = useState("");
    const [topics, setTopics] = useState([]);
    const [problems, setProblems] = useState([]);
    const addProblem = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "Questions"), {
                id,
                title,
                points: Number(points),
                contest,
                description,
                folder,
                inputFormat,
                outputFormat,
                topics
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
    return (
        <>
            <Navigation></Navigation>
            <h1>Add Problem</h1>
            <p>Learn comeptitve programming today!</p>
        </>
    );
};

export default AddProblem;