import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation/Navigation";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import "./Add.css";
import axios from "axios";
import { uploadString } from "firebase/storage";
import { getStorage, ref } from "firebase/storage";
import { TablePagination } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';

const ariaLabel = { 'aria-label': 'description' };

const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });  

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

        const fetchTestCasesData = async () => {
            try {
                const storage = getStorage();
        
                let uploadPromises = [];
        
                const testCaseFolder = folder;
        
                if (testCaseFolder) {
                    const fileListResponse = await axios.get(`${process.env.PUBLIC_URL}/TestCaseData/${testCaseFolder}`);
                    const fileList = fileListResponse.data;
                    
                    fileList.sort();
        
                    for (let i = 0; i < fileList.length; i += 2) {
                        const inputFileName = fileList[i];
                        const outputFileName = fileList[i + 1];
        
                        try {
                            const inputResponse = await axios.get(`${process.env.PUBLIC_URL}/TestCaseData/${testCaseFolder}/${inputFileName}`);
                            const outputResponse = await axios.get(`${process.env.PUBLIC_URL}/TestCaseData/${testCaseFolder}/${outputFileName}`);
        
                            console.log("inputResponse", inputResponse);
                            console.log("outputResponse", outputResponse);
        
                            let inputRef = ref(storage, `/TestCaseData/${testCaseFolder}/${String(i + 1).padStart(4, '0')}.txt`);
                            let inputUploadPromise = uploadString(inputRef, String(inputResponse.data)).then((snapshot) => {
                                console.log("Uploaded input");
                            });
        
                            let outputRef = ref(storage, `/TestCaseData/${testCaseFolder}/${String(i + 2).padStart(4, '0')}.txt`);
                            let outputUploadPromise = uploadString(outputRef, String(outputResponse.data)).then((snapshot) => {
                                console.log("Uploaded output");
                            });
        
                            uploadPromises.push(inputUploadPromise, outputUploadPromise);
                        } catch (error) {
                            console.error("Error processing files:", inputFileName, outputFileName, error);
                        }
                    }

                    await Promise.all(uploadPromises);
                    console.log("All files have been successfully uploaded to Firebase Storage.");
                }
            } catch (error) {
                console.error("Error fetching test cases: ", error);
            }
        };        
    
        fetchTestCasesData();
    }

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const [search, setSearch] = useState("");
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    
    useEffect(() => {
        const fetchQuestions = async () => {
          const querySnapshot = await getDocs(collection(db, "Questions"));
          const questionsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setQuestions(questionsData);
        };
    
        fetchQuestions();
      }, []);    

    useEffect(() => {
        let filtered = questions;
        
        console.log("search", search);
    
        if (search) {
          filtered = filtered.filter((q) => {
            if (q.title) {
              console.log("q", q);
              return q.title.toLowerCase().includes(search.toLowerCase());
            }
            return false; // return false if there's no title, so it doesn't get included in the filtered array
          });
        }    
    
        setFilteredQuestions(filtered);
      }, [questions, search, topics]);

    const currentPageData = filteredQuestions.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <>
            <Navigation></Navigation>
            <h1>Add Problem</h1>
            <section>
                <div>
                    <h1 className="header">
                        Competitive Programming Website
                    </h1>
                    <div className="search-rect">
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%', m: 1 }}>
                        <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }}/>
                        <Input fullWidth placeholder="Search problems..." inputProps={ariaLabel} sx={{ color: 'black', width: '100%' }} style={{ color: 'black' }} theme={lightTheme} value={search} onChange={(e) => setSearch(e.target.value)}/>
                      </Box>
                    </div>
                    <div className="question-list">
                        <div className="wrapper">
                            <div className="question-list-rect">
                                <div>
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Points</th>
                                        <th>Topics</th>
                                        <th>Contest</th>
                                        <th>Problems</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentPageData.map((q) => (
                                        <tr key={q.id}>
                                        <td>{q.title}</td>
                                        <td>{q.points}</td>
                                        <td>{q.topics.join(", ")}</td>
                                        <td>{q.contest}</td>
                                        <td>
                                            <button
                                            type="button"
                                            className='open-question'
                                            onClick={() => {
                                                console.log("SELECTED PROBLEM:", q);
                                            }}
                                            >
                                            <img src='/open.png' alt='open' style={{background:'transparent', maxHeight: '20px'}}/>
                                            </button>
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='pagination'>
                        <ThemeProvider theme={lightTheme}>
                            <TablePagination
                                component="div"
                                count={filteredQuestions.length} // Update the total count
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </ThemeProvider>
                    </div>
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
