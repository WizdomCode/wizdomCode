import React, {useState} from "react";
import Navigation from "../components/Navigation/Navigation";
import { auth, app, db } from "../firebase";
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import "./Add.css";

const AddProblem = () => {
    const [title, setTitle] = useState("");
    const [contest, setContest] = useState("");
    const [constraints, setConstraints] = useState("");
    const [description, setDescription] = useState("");
    const [folder, setFolder] = useState("");
    const [inputFormat, setInputFormat] = useState("");
    const [outputFormat, setOutputFormat] = useState("");
    const [points, setPoints] = useState("");
    const [topics, setTopics] = useState([]);
    const addProblem = async (e) => {
        e.preventDefault();
    
        try {
            const questionDocRef = doc(db, "Questions", title);
            await setDoc(questionDocRef, {
                constraints,
                points: Number(points),
                contest,
                description,
                folder,
                inputFormat,
                outputFormat,
                topics
            });
    
            console.log("Document written with ID: ", questionDocRef.id); // Access the generated ID via docRef.id
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
    return (
        <>
            <Navigation></Navigation>
            <h1>Add Problem</h1>
            <section className="todo-container">
                <div className="todo">
                    <h1 className="header">
                        Competitive Programming Website
                    </h1>

                    <div>
                        <form>
                            <div>
                                <label>Title:</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Constraints:</label>
                                <input
                                    type="text"
                                    value={constraints}
                                    onChange={(e) => setConstraints(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Points</label>
                                <input
                                    type="text"
                                    value={points}
                                    onChange={(e) => setPoints(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Contest:</label>
                                <input
                                    type="text"
                                    value={contest}
                                    onChange={(e) => setContest(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Decription:</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>InputFormat:</label>
                                <input
                                    type="text"
                                    value={inputFormat}
                                    onChange={(e) => setInputFormat(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>OutputFormat:</label>
                                <input
                                    type="text"
                                    value={outputFormat}
                                    onChange={(e) => setOutputFormat(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>FOlder:</label>
                                <input
                                    type="text"
                                    value={folder}
                                    onChange={(e) => setFolder(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Topic(s):</label>
                                <input
                                type="text"
                                value={topics.join(", ")} // Convert array to comma-separated string
                                onChange={(e) => setTopics(e.target.value.split(", "))} // Convert string to array
                                />
                            </div>

                            <div className="btn-container">
                                <button
                                    type="submit"
                                    className="btn"
                                    onClick={addProblem}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AddProblem;