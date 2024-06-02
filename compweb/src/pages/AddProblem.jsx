import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation/Navigation";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import "./Add.css";
import axios from "axios";
import { uploadString } from "firebase/storage";
import { getStorage, ref } from "firebase/storage";
import { TablePagination } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Split from 'react-split'

import styles from '../components/styles/ProblemDescription.module.css';
import "../Fonts.css";
import '../components/styles/Workspace.css';
import "../components/styles/Paths.css";

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; 
import { Container } from "@mantine/core";

const ariaLabel = { 'aria-label': 'description' };

const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  }); 
  
const TODO = `
useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Questions"));
      const allDataDocRef = doc(db, "ProblemMetadata", "AllData");

      const questionsData = querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const updateData = {
          contest: data.contest,
          folder: data.folder,
          points: data.points,
          specificContest: data.specificContest,
          title: data.title,
          topics: data.topics,
        };

        // Update the All Data document with the new field
        await updateDoc(allDataDocRef, {
          [doc.id]: updateData,
        });

        return {
          id: doc.id,
          ...data,
        };
      });

      const resolvedQuestionsData = await Promise.all(questionsData);
      setQuestions(resolvedQuestionsData);
    } catch (error) {
      console.error("Error fetching questions: ", error);
      // Handle the error according to your application's requirements
    }
  };

  fetchQuestions();
}, []);
`

const AddProblem = () => {
    const [title, setTitle] = useState("");
    const [contest, setContest] = useState("");
    const [description, setDescription] = useState("");
    const [folder, setFolder] = useState("");
    const [inputFormat, setInputFormat] = useState("");
    const [outputFormat, setOutputFormat] = useState("");
    const [constraints, setConstraints] = useState("");
    const [points, setPoints] = useState("");
    const [sample1, setSample1] = useState({input: "", output: "", explanation: ""});
    const [sample2, setSample2] = useState({input: "", output: "", explanation: ""});
    const [sample3, setSample3] = useState({input: "", output: "", explanation: ""});
    const [specificContest, setSpecificContest] = useState("");
    const [topics, setTopics] = useState([]);

    async function getFileContent(fileName) {
      try {
          const response = await fetch(`/TestCaseData/bessiesSnowCowPlat/${fileName}`);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const content = await response.text();
          return content;
      } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
      }
    }  

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
                constraints,
                points: Number(points),
                sample1,
                sample2,
                sample3,
                specificContest,
                topics
            });
    
            console.log("Question document updated successfully.");
        } catch (error) {
          console.error("Error updating question document: ", error);
        }

        try {
          const allDataDocRef = doc(db, "ProblemMetadata", "AllData");

          const updateData = {
            contest: contest,
            folder: folder,
            points: Number(points),
            specificContest: specificContest,
            title: title,
            topics: topics,
          };
  
          // Update the All Data document with the new field
          await updateDoc(allDataDocRef, {
            [title]: updateData,
          });

          console.log("AllData document updated successfully.");
        } catch (error) {
          console.error("Error updating AllData document: ", error);
        }

        const fetchTestCasesData = async () => {
          try {
              const storage = getStorage();
      
              let uploadPromises = [];
      
              const testCaseFolder = folder;
      
              if (testCaseFolder) {
                  let i = 1;
                  let fileCount = 1;
                  while (i < 20) {
                      const inputFileName = `${i}.in`;
                      const outputFileName = `${i}.out`;
      
                      try {
                          const inputResponse = await axios.get(`${import.meta.env.VITE_PUBLIC_URL}/TestCaseData/${testCaseFolder}/${inputFileName}`);
                          const outputResponse = await axios.get(`${import.meta.env.VITE_PUBLIC_URL}/TestCaseData/${testCaseFolder}/${outputFileName}`);
      
                          if (inputResponse.data.startsWith("<!DOCTYPE html>")) {
                            break;
                          } else {
                            console.log(i);
                          }

                          let inputRef = ref(storage, `/TestCaseData/${testCaseFolder}/${String(fileCount).padStart(4, '0')}.txt`);
                          let inputUploadPromise = uploadString(inputRef, String(inputResponse.data)).then((snapshot) => {
                            console.log(`/TestCaseData/${testCaseFolder}/${inputFileName} uploaded`);
                          });

                          fileCount++;
      
                          let outputRef = ref(storage, `/TestCaseData/${testCaseFolder}/${String(fileCount).padStart(4, '0')}.txt`);
                          let outputUploadPromise = uploadString(outputRef, String(outputResponse.data)).then((snapshot) => {
                            console.log(`/TestCaseData/${testCaseFolder}/${outputFileName} uploaded`);
                          });

                          fileCount++;
      
                          uploadPromises.push(inputUploadPromise, outputUploadPromise);
                      } catch (error) {
                          console.log("Error uploading test cases", error);
                      }
                      i++;
                  }
      
                  await Promise.all(uploadPromises);
                  console.log("All test cases uploaded successfully.");
              }
          } catch (error) {
              console.log("Error uploading test cases", error);
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
        
    
        if (search) {
          filtered = filtered.filter((q) => {
            if (q.title) {
              return q.title.toLowerCase().includes(search.toLowerCase());
            }
            return false; // return false if there's no title, so it doesn't get included in the filtered array
          });
        }    
    
        setFilteredQuestions(filtered);
      }, [questions, search, topics]);

    const currentPageData = filteredQuestions.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    function isList(str) {
      const regex = /^(- |\d+\. )/;
      return regex.test(str);
    }
    
    function parseText(str) {
      return str
        .split('\n')
        .map((str) => {
          if (str.startsWith('<img')) {
            console.log(str);
            return `<div class="${styles.descriptionImgWrapper}">${str}</div>`
          } else if (!isList(str)) {
            return `<span class="${styles.descriptionText}">${str}</span><br />`;
          } else {
            return `<span class="${styles.indent}">${str}</span>\n`;
          }
        })
        .join('\n')
    }

    function customParser(text) {
        const newText = text
          .split('!table')
          .map((str, index) => {
            if (index % 2 === 0) {
              return `${parseText(str)}`;
            } else {
              return str;
            }
          })
          .join('')
        return newText;
      }
      
      function cleanNewLines() {

        const regex = /(?<=[^\n.!?:])\n/g;
    
        setTitle(title.replace(regex, ""));
        setContest(contest.replace(regex, ""));
        setDescription(description.replace(regex, ""));
        setFolder(folder.replace(regex, ""));
        setInputFormat(inputFormat.replace(regex, ""));
        setOutputFormat(outputFormat.replace(regex, ""));
        setConstraints(constraints.replace(regex, ""));
        setPoints(points.replace(regex, ""));
        setSample1({...sample1, explanation: sample1.explanation.replace(regex, "")});
        setSample2({...sample2, explanation: sample2.explanation.replace(regex, "")});
        setSample3({...sample3, explanation: sample3.explanation.replace(regex, "")});
        setSpecificContest(specificContest.replace(regex, ""));
        setTopics(topics.map(topic => topic.replace(regex, "")));
    }

    useEffect(() => {
        function handleKeyDown(event) {
            // Replace "KeyK" with the key you want to use for the shortcut
            if (event.altKey && event.code === "KeyK") {
                cleanNewLines();
            }
        }
    
        window.addEventListener('keydown', handleKeyDown);
    
        // Cleanup when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [title, contest, description, folder, inputFormat, outputFormat, constraints, points, sample1, sample2, sample3, specificContest, topics]);    

    return (
        <>
            <Split
                className="split"
                style={{ display: 'flex', flexDirection: 'row' }}
                minSize={500}
            >
            <div id="split-0" style={{ height: "100vh", overflow: "auto", background: "#1B1B32", backgroundColor: "#1B1B32" }}>
              <Container>
                <br />
                {title && <h1 className={styles.title}>{title}</h1>}
                <br />
                <div className={styles.description}>
                  {description && (
                    <>
                      {specificContest && <h3>{specificContest}</h3>}
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]}
                        children={customParser(description.replace(/\\n/g, '\n'))}
                      />
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {inputFormat && (
                    <>
                      <h3>Input Format</h3>
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]} children={customParser(inputFormat.replace(/\\n/g, '\n'))} className={styles.reactMarkDown} />
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {outputFormat && (
                    <>
                      <h3>Output Format</h3>
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]} children={customParser(outputFormat.replace(/\\n/g, '\n'))} />
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {constraints && (
                    <>
                      <h3>Constraints</h3>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(constraints.replace(/\\n/g, '\n'))} />
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {sample1 && (
                    <>
                      { sample1.input && 
                        <>
                        <h3>Input for Sample Input 1</h3>
                        <pre className={styles.codeSnippet}>{sample1.input.replace(/\\n/g, '\n')}</pre>
                        <br />
                        </>
                      }
                      { sample1.output && 
                        <>
                        <h3>Output for Sample Input 1</h3>
                        <pre className={styles.codeSnippet}>{sample1.output.replace(/\\n/g, '\n')}</pre>
                        <br />
                        </>
                      }
                      {sample1.explanation && 
                        <>
                        <h3>Explanation for Sample 1</h3>
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]} children={customParser(sample1.explanation.replace(/\\n/g, '\n'))} />
                        <br />
                        </>
                      }
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {sample2 && (
                    <>
                      { sample2.input && 
                        <>
                        <h3>Input for Sample Input 2</h3>
                        <pre className={styles.codeSnippet}>{sample2.input.replace(/\\n/g, '\n')}</pre>
                        <br />
                        </>
                      }
                      { sample2.output && 
                        <>
                        <h3>Output for Sample Input 2</h3>
                        <pre className={styles.codeSnippet}>{sample2.output.replace(/\\n/g, '\n')}</pre>
                        <br />
                        </>
                      }
                      {sample2.explanation && 
                        <>
                        <h3>Explanation for Sample 2</h3>
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]} children={customParser(sample2.explanation.replace(/\\n/g, '\n'))} />
                        <br />
                        </>
                      }
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {sample3 && (
                    <>
                      { sample3.input && 
                        <>
                        <h3>Input for Sample Input 3</h3>
                        <pre className={styles.codeSnippet}>{sample3.input.replace(/\\n/g, '\n')}</pre>
                        <br />
                        </>
                      }
                      { sample3.output && 
                        <>
                        <h3>Output for Sample Input 3</h3>
                        <pre className={styles.codeSnippet}>{sample3.output.replace(/\\n/g, '\n')}</pre>
                        <br />
                        </>
                      }
                      {sample3.explanation && 
                        <>
                        <h3>Explanation for Sample 3</h3>
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]} children={customParser(sample3.explanation.replace(/\\n/g, '\n'))} />
                        <br />
                        </>
                      }
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {points && (
                    <>
                      <h3>Points</h3>
                      <p>{points}</p>
                    </>
                  )}
                </div>
                <br />
                <br />
                <button className={styles.runAll} style={{color: 'white'}}>Run All Tests (Ctrl + Enter)</button>
                <br />
              </Container>                
            </div>
            <div id="split-1">
            <section style={{ height: "100vh", overflow: "auto" }}>
                <h1>Add Problem</h1>
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
                                                   
                                                    if (q.title) setTitle(q.title);
                                                    if (q.contest) setContest(q.contest);
                                                    if (q.description) setDescription(q.description);
                                                    if (q.folder) setFolder(q.folder);
                                                    if (q.inputFormat) setInputFormat(q.inputFormat);
                                                    if (q.outputFormat) setOutputFormat(q.outputFormat);
                                                    if (q.constraints) setConstraints(q.constraints);
                                                    if (q.points) setPoints(Number(q.points));
                                                    if (q.sample1) setSample1(q.sample1);
                                                    if (q.sample2) setSample2(q.sample2);
                                                    if (q.sample3) setSample3(q.sample3);
                                                    if (q.specificContest) setSpecificContest(q.specificContest);
                                                    if (q.topics) setTopics(q.topics);
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
                                <label>constraints:</label>
                                <textarea
                                    value={constraints}
                                    onChange={(e) => setConstraints(e.target.value)}
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
            </div>
            </Split>
        </>
    );
}

export default AddProblem;
