import React, { useState } from "react";
import Navigation from "../components/Navigation/Navigation";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "./Add.css";

const AddProblem = () => {
    const [title, setTitle] = useState("");
    const [contest, setContest] = useState("");
    const [description, setDescription] = useState("");
    const [folder, setFolder] = useState("");
    const [inputFormat, setInputFormat] = useState("");
    const [outputFormat, setOutputFormat] = useState("");
    const [points, setPoints] = useState("");
    const [sample1, setSample1] = useState({input: "", output: "", explanation: ""});
    const [sample2, setSample2] = useState({input: "", output: "", explanation: ""});
    const [sample3, setSample3] = useState({input: "", output: "", explanation: ""});
    const [specificContest, setSpecificContest] = useState("");
    const [topics, setTopics] = useState([]);

    const addProblem = async (e) => {
        e.preventDefault();
    
        try {
            const questionDocRef = doc(db, "Questions", title);
            await setDoc(questionDocRef, {
                title,
                contest,
                description,
                folder,
                inputFormat,
                outputFormat,
                points: Number(points),
                sample1,
                sample2,
                sample3,
                specificContest,
                topics
            });
    
            console.log("Writing...", {
                title,
                contest,
                description,
                folder,
                inputFormat,
                outputFormat,
                points: Number(points),
                sample1,
                sample2,
                specificContest,
                topics
            });

            console.log("Document written with ID: ", questionDocRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    return (
        <>
            <Navigation></Navigation>
            <h1>Add Problem</h1>
            <section>
                <div>
                    <h1 className="header">
                        Competitive Programming Website
                    </h1>

                    <div>
                        <form onSubmit={addProblem}>
                            <div>
                                <label>Title:</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
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
                                <label>Description:</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Folder:</label>
                                <input
                                    type="text"
                                    value={folder}
                                    onChange={(e) => setFolder(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Input Format:</label>
                                <textarea
                                    value={inputFormat}
                                    onChange={(e) => setInputFormat(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Output Format:</label>
                                <textarea
                                    value={outputFormat}
                                    onChange={(e) => setOutputFormat(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Points:</label>
                                <input
                                    type="number"
                                    value={points}
                                    onChange={(e) => setPoints(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Sample 1:</label>
                                <textarea
                                    type="text"
                                    placeholder="Input"
                                    value={sample1.input}
                                    onChange={(e) => setSample1({...sample1, input: e.target.value})}
                                />
                                <textarea
                                    type="text"
                                    placeholder="Output"
                                    value={sample1.output}
                                    onChange={(e) => setSample1({...sample1, output: e.target.value})}
                                />
                                <textarea
                                    placeholder="Explanation"
                                    value={sample1.explanation}
                                    onChange={(e) => setSample1({...sample1, explanation: e.target.value})}
                                />
                            </div>
                            <div>
                                <label>Sample 2:</label>
                                <textarea
                                    type="text"
                                    placeholder="Input"
                                    value={sample2.input}
                                    onChange={(e) => setSample2({...sample2, input: e.target.value})}
                                />
                                <textarea
                                    type="text"
                                    placeholder="Output"
                                    value={sample2.output}
                                    onChange={(e) => setSample2({...sample2, output: e.target.value})}
                                />
                                <textarea
                                    placeholder="Explanation"
                                    value={sample2.explanation}
                                    onChange={(e) => setSample2({...sample2, explanation: e.target.value})}
                                />
                            </div>
                            <div>
                                <label>Sample 3:</label>
                                <textarea
                                    type="text"
                                    placeholder="Input"
                                    value={sample3.input}
                                    onChange={(e) => setSample3({...sample3, input: e.target.value})}
                                />
                                <textarea
                                    type="text"
                                    placeholder="Output"
                                    value={sample3.output}
                                    onChange={(e) => setSample3({...sample3, output: e.target.value})}
                                />
                                <textarea
                                    placeholder="Explanation"
                                    value={sample3.explanation}
                                    onChange={(e) => setSample3({...sample3, explanation: e.target.value})}
                                />
                            </div>
                            <div>
                                <label>Specific Contest:</label>
                                <input
                                    type="text"
                                    value={specificContest}
                                    onChange={(e) => setSpecificContest(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Topics:</label>
                                <input
                                    type="text"
                                    value={topics}
                                    onChange={(e) => setTopics(e.target.value.split(','))}
                                />
                            </div>
                            <button type="submit">Add Problem</button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AddProblem;
