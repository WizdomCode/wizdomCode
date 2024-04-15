import React, { useState, useRef, useEffect } from "react";
import "../../../Fonts.css";
import { Link } from "react-router-dom";
import '../../styles/Workspace.css';
import "../../styles/Paths.css";
import { useDispatch, useSelector } from 'react-redux';
import { collection, getDocs, addDoc, getDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, app, db } from "../../../firebase.js";
import styles from '../../styles/ProblemDescription.module.css';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import axios from "axios";
import Tab from "./Tab.jsx";
import { initializeAnalytics } from "firebase/analytics";

const LessonBackgroundRect = ({ onButtonClick, isFocused, ...props }) => {

    return (
        <div className="universal">
            <div 
                className={`lesson-background-rect ${ isFocused ? 'hovered' : ''}`}
                onClick={() => {
                    onButtonClick();
                }}
                tabIndex="0" // Add this to make the div focusable
            >
                <h4 className='lesson-category'>{ props.category }</h4>
                <img className="lesson-icon" src={ props.imgPath } alt="sad"></img>
                <h3 className={ props.lessonName.length > 20 ? 'long-lesson-name' : 'lesson-name'}>{ props.lessonName }</h3>
                <div>
                    <button className="bottom-rectangle" onClick={onButtonClick}>View problems</button>
                </div>
            </div>
        </div>
    );
};

const ScrollRow = ({ lessons, unitTitle, unitDescription, division }) => {

    const scrollContainer = useRef(null);
    const scrollDistance = 200;
    const scrollDuration = 30;
    const scrollInterval = 1;

    const [questions, setQuestions] = useState([]);
    const [lastPressed, setLastPressed] = useState(null);
    const [isQuestionListOpen, setIsQuestionListOpen] = useState(false); // Add this line

    const tabIndex = useSelector(state => state.lessonTabIndex);
    
    const dispatch = useDispatch();

    const handleButtonClick = (lessonIndex) => {
        if (lessonIndex === lastPressed) {
            setIsQuestionListOpen(!isQuestionListOpen); // Toggle question list state when clicked
        } else {
            setLastPressed(lessonIndex);
            setIsQuestionListOpen(true); // Open question list when a new LessonBackgroundRect is clicked
        }
        console.log("Last pressed:", lessonIndex);
    };    

    const smoothScroll = (end) => {
        if (scrollContainer.current) {
            let start = scrollContainer.current.scrollLeft;
            let change = end - start;
            let currentTime = 0;

            const animateScroll = () => {
                currentTime += scrollInterval;
                const val = Math.easeInOutQuad(currentTime, start, change, scrollDuration);
                scrollContainer.current.scrollLeft = val;
                if(currentTime < scrollDuration) {
                    setTimeout(animateScroll, scrollInterval);
                }
            };
            animateScroll();
        }
    };

    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    const scrollLeft = () => {
        if (scrollContainer.current) {
            smoothScroll(scrollContainer.current.scrollLeft - scrollDistance);
        }
    };

    const scrollRight = () => {
        if (scrollContainer.current) {
            smoothScroll(scrollContainer.current.scrollLeft + scrollDistance);
        }
    };

    const fetchProblemData = async (questionID) => {
        if (questionID) {
          try {
            const docRef = await getDoc(doc(db, "Questions", questionID));
            if (docRef.exists()) {
                let problemData = docRef.data();
                return problemData;
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching document: ", error);
          }
        }
      };

    const addGroup = async (problemIds) => {
        const problemDataPromises = problemIds.map(problem_id => fetchProblemData(problem_id));
        const problemsData = await Promise.all(problemDataPromises);
        problemsData.forEach((problemData, index) => {
            console.log(`Problem data for id ${problemIds[index]}:`, problemData);
        });
        return problemsData;
    };

    useEffect(() => {
        const fetchData = async () => {
            console.log("what", lessons);
            console.log("what", lessons[lastPressed]);
            console.log("what", lessons[lastPressed].problemIds);
            const data = await addGroup(lessons[lastPressed].problemIds);
            setQuestions(data);
        };
    
        fetchData();
    }, [lastPressed]);
    
    return (
        <div className="universal">
            <div className="hero">
                <div className="wrapper">
                    <div className="unit-header">
                        <div className="unit-header-left">
                            <h1 className='unit-title'>{unitTitle}</h1>
                            <br />
                            <p>{unitDescription}</p>
                        </div>
                        <div className="unit-header-right"><button className="start-button">Start</button></div>
                    </div>
                </div>
            </div>
            <div className='scroll-row'>
                <button onClick={scrollLeft} className="scroll-button left">
                    <img src='/leftarrow.png' alt='Left' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/>
                </button>
                <div className="lesson-wrapper" ref={scrollContainer}>
                    {lessons.map((lesson, index) => (
                        <LessonBackgroundRect key={index} {...lesson} onButtonClick={() => handleButtonClick(index)} isFocused={index === lastPressed && isQuestionListOpen}/>
                    ))}
                </div>
                <button onClick={scrollRight} className="scroll-button right">
                    <img src='/rightarrow.png' alt='Right' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/>
                </button>
            </div>
            {isQuestionListOpen && questions.length !== 0 && (
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
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {questions.map((q) => (
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
                                    window.scrollTo(0, 0); // This will scroll the page to the top
                                    dispatch({
                                        type: 'SET_LESSON_META_DATA',
                                        index: tabIndex,
                                        payload: {
                                            division: division,
                                            lesson: lastPressed,
                                            problem_id: q.title // TODO: This becomes problem if question id in firebase differs from question title
                                        },
                                    })
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
            )}
        </div>
    );
};

const Paths = (props) => {

    const lessonMetaData = useSelector(state => state.lessonMetaData); // This is what is actually used to keep track of which problem is active, contains all problem data
    const code = useSelector(state => state.codeState);
    const currentlyClickedTab = useSelector(state => state.lessonActiveTab); // Something like this: {type: 'division', data: 'Junior'}, used to keep track of active tab
    const tabs = useSelector(state => state.lessonTabs); // Array of currentlyClickedTabs
    const lessonProblemData = useSelector(state => state.lessonProblemData);
    const [testCases, setTestCases] = useState([]);
    const [results, setResults] = useState([]);
    
    const defaultTabs = props.currentPage === 'ccc' ? [
        { type: 'division', data: 'Junior'},
        { type: 'division', data: 'Senior'}
    ] : [
        { type: 'division', data: 'Bronze'},
        { type: 'division', data: 'Silver'},
        { type: 'division', data: 'Gold'},
        { type: 'division', data: 'Platinum'}
    ];

    const tabIndex = useSelector(state => state.lessonTabIndex);

    console.log("Default tabs:", defaultTabs);
    console.log("Default tab ind:", tabIndex);
    console.log("Default tab data:", defaultTabs[tabIndex]['data']);

    console.log("State after fetch:", useSelector(state => state)); // Log the state after dispatch

    const dispatch = useDispatch();

    useEffect(() => {
        let initialTabs = [];
        let initialTab = {};
        if (props.currentPage === 'ccc') {
            initialTabs = [
                { type: 'division', data: 'Junior'},
                { type: 'division', data: 'Senior'}
            ];
            initialTab = initialTabs[0];
        }
        else {
            initialTabs = [
                { type: 'division', data: 'Bronze'},
                { type: 'division', data: 'Silver'},
                { type: 'division', data: 'Gold'},
                { type: 'division', data: 'Platinum'}
            ];
            initialTab = initialTabs[0];
        }

        let addedTabs = [];
        initialTabs.forEach(tab => {
            if (!addedTabs.some(addedTab => addedTab.type === tab.type && addedTab.data === tab.data)) {
                dispatch({
                    type: 'ADD_LESSON_TAB',
                    payload: tab
                });
                addedTabs.push(tab);
            }
        });   

        dispatch({
            type: 'UPDATE_ARRAY_SIZE',
            payload: initialTabs.length
        })

        dispatch({
            type: 'SET_LESSON_TAB',
            payload: initialTab
        })
    }, []); 

    const fetchProblemData = async (questionID) => {
        if (questionID) {
          try {
            const docRef = await getDoc(doc(db, "Questions", questionID));
            if (docRef.exists()) {
              let problemData = docRef.data();
      
              // Fetch test cases data from TestCaseReader
              const fetchTestCasesData = async () => {
                try {
                  let testCaseArray = [];
                  const testCaseFolder = problemData.folder; // Get the testCaseFolder from the problemData
      
                  if (testCaseFolder) {  // Add this check
                    const fileListResponse = await axios.get(`${process.env.PUBLIC_URL}/TestCaseData/${testCaseFolder}`);
                    const fileList = fileListResponse.data;
                    fileList.sort();
      
                    for (let i = 0; i < fileList.length; i += 2) {
                      const inputFileName = fileList[i];
                      const outputFileName = fileList[i + 1];
      
                      try {
                        const inputResponse = await axios.get(`${process.env.PUBLIC_URL}/TestCaseData/${testCaseFolder}/${inputFileName}`);
                        const outputResponse = await axios.get(`${process.env.PUBLIC_URL}/TestCaseData/${testCaseFolder}/${outputFileName}`);
      
                        testCaseArray.push({
                          key: (i / 2) + 1,
                          input: inputResponse.data,
                          output: outputResponse.data,
                        });
                      } catch (error) {
                        console.error("Error processing files:", inputFileName, outputFileName, error);
                      }
                    }
      
                    console.log("Test Cases from problemdesc:", testCaseArray);
                    setTestCases(testCaseArray);
                  }
                } catch (error) {
                  console.error("Error fetching test cases: ", error);
                }
              };
      
              await fetchTestCasesData(); // Call the fetchTestCasesData function here
      
              return problemData;
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching document: ", error);
          }
        }
      };
      
      const addGroup = async (problemId) => {
        const problemData = await fetchProblemData(problemId);
        console.log(`Problem data for id ${problemId}:`, problemData);
        return problemData;
      };    
      
      useEffect(() => {
        const fetchData = async () => {
          const data = await addGroup(lessonMetaData[tabIndex].problem_id);
          dispatch({
            type: 'SET_LESSON_PROBLEM_DATA',
            index: tabIndex,
            payload: {
              data: data
            }
          });
        };
      
        fetchData();
      }, [lessonMetaData]);      

    const state = useSelector(state => state); // Access the state

    useEffect(() => {
    console.log("State after dispatch:", state); // Log the state after dispatch
    }, [state]); // Add state as a dependency to useEffect

    const lessons = [
        { category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png" },
        { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png" },
        { category: "7 Problems", lessonName: "Conditions", imgPath: "/open.png" },
        { category: "1 Problem", lessonName: "Arrays", imgPath: "/open.png" },
        { category: "4 Problems", lessonName: "Basic String Manipulation", imgPath: "/open.png" },
        { category: "6 Problems", lessonName: "Arithmetic operations", imgPath: "/open.png" },
        { category: "4 Problems", lessonName: "Nested Loops", imgPath: "/open.png" },
    ];

    const unitTitle = "J1 & J2 & J3: Basic Programming";
    const JUINOR_UNIT_TITLES = ["J1, J2, J3: Basic Programming", "J4: Problem Solving", "J5: Advanced Topics"];
    const JUINOR_UNIT_DESCRIPTIONS = ["", "", ""];
    const JUNIOR_UNIT_LESSONS = [
        [
            { category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png", problemIds: ["Next in line", "Cupcake Party", "Conveyor Belt Sushi", "Squares", "Who is in the Middle?"] },
            { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png", problemIds: ["Next in line", "Cupcake Party", "Conveyor Belt Sushi", "Squares", "Who is in the Middle?"] },
            { category: "7 Problems", lessonName: "Conditions", imgPath: "/open.png", problemIds: ["Next in line", "Cupcake Party", "Conveyor Belt Sushi", "Squares", "Who is in the Middle?"] },
            { category: "1 Problem", lessonName: "Arrays", imgPath: "/open.png", problemIds: ["Next in line", "Cupcake Party", "Conveyor Belt Sushi", "Squares", "Who is in the Middle?"] },
            { category: "4 Problems", lessonName: "Basic String Manipulation", imgPath: "/open.png", problemIds: ["Next in line", "Cupcake Party", "Conveyor Belt Sushi", "Squares", "Who is in the Middle?"] },
            { category: "6 Problems", lessonName: "Arithmetic operations", imgPath: "/open.png", problemIds: ["Next in line", "Cupcake Party", "Conveyor Belt Sushi", "Squares", "Who is in the Middle?"] },
            { category: "4 Problems", lessonName: "Nested Loops", imgPath: "/open.png", problemIds: ["Next in line", "Cupcake Party", "Conveyor Belt Sushi", "Squares", "Who is in the Middle?"] },
        ],
        [
            { category: "5 Problems", lessonName: "TEst", imgPath: "/open.png", problemIds: [] },
            { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png", problemIds: [] },
            { category: "7 Problems", lessonName: "Conditions", imgPath: "/open.png", problemIds: [] },
            { category: "1 Problem", lessonName: "Arrays", imgPath: "/open.png", problemIds: [] },
            { category: "4 Problems", lessonName: "Basic String Manipulation", imgPath: "/open.png", problemIds: [] },
            { category: "6 Problems", lessonName: "Arithmetic operations", imgPath: "/open.png", problemIds: [] },
            { category: "4 Problems", lessonName: "Nested Loops", imgPath: "/open.png", problemIds: [] },
        ], 
        [
            { category: "4 Problems", lessonName: "BFS", imgPath: "/open.png", problemIds: [] },
            { category: "5 Problems", lessonName: "DFS", imgPath: "/open.png", problemIds: [] },
            { category: "4 Problems", lessonName: "Recursion", imgPath: "/open.png", problemIds: [] },
            { category: "2 Problems", lessonName: "Dynamic Programming 1", imgPath: "/open.png", problemIds: [] }
        ]
    ];

    const unitDescription = "lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs. lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs. lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.";

    const submitCode = async () => {
        console.log("sent data:", JSON.stringify({
          language: code.language,
          code: code.code,
          test_cases: testCases
        }));
    
        // Start the timer
        const startTime = performance.now();
    
        const response = await fetch('https://e816-66-22-164-190.ngrok-free.app/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            language: code.language,
            code: code.code,
            test_cases: testCases
          })
        });
    
        // End the timer and calculate the elapsed time
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        console.log(`Execution time: ${elapsedTime} milliseconds`);
    
        console.log("sent code");
        const data = await response.json();
        console.log(data);
    
        setResults(data);
      };

      useEffect(() => {
        // Define a function to update the user's document
        const updateUserSolvedQuestions = async (userUid, questionName, points) => {
            try {
                // Get a reference to the user's document
                const userDocRef = doc(db, "Users", userUid);
                
                // Check if the question is already solved by the user
                const userDocSnapshot = await getDoc(userDocRef);
                const solvedQuestions = userDocSnapshot.data().solved || [];
    
                if (!solvedQuestions.includes(questionName)) {
                    // Update the user's document to add the solved question and increment points
                    await updateDoc(userDocRef, {
                        solved: arrayUnion(questionName), // Add the question name to the solved array
                        points: points + (userDocSnapshot.data().points || 0) // Increment points
                    });
                    console.log(`Question "${questionName}" solved! Points updated.`);
                } else {
                    console.log(`Question "${questionName}" already solved.`);
                }
            } catch (error) {
                console.error("Error updating user document:", error);
            }
        };
    
        // Example parsing
        const problemPassed = () => {
            for (let test of results) {
                if (test.status.description !== 'Accepted') {
                    return false;
                }
            }
            return true;
        };
    
        console.log("Problem passed:", problemPassed());
    
        // If the problem is solved, update the user's document
        if (problemPassed()) {
            const questionName = lessonProblemData[tabIndex].data.title; // Assuming the question name is stored here
            const pointsEarned = lessonProblemData[tabIndex].data.points; // Assuming the points earned for solving the question are stored here
            const userUid = auth.currentUser.uid; // Get the current user's UID
    
            updateUserSolvedQuestions(userUid, questionName, pointsEarned);
        }
    }, [results, lessonProblemData, tabIndex, db, auth]);

      function findProblem(data, currentProblemId, direction) {
        for (let unit of data) {
            for (let lesson of unit) {
                let problemIds = lesson.problemIds;
                let currentIndex = problemIds.indexOf(currentProblemId);
                if (currentIndex !== -1) {
                    if (direction === 'next' && currentIndex < problemIds.length - 1) {
                        return problemIds[currentIndex + 1];
                    } else if (direction === 'previous' && currentIndex > 0) {
                        return problemIds[currentIndex - 1];
                    }
                }
            }
        }
        return null;
    }    

    const scrollLeft = () => {
        dispatch({
            type: 'SET_LESSON_META_DATA',
            index: tabIndex,
            payload: {
                problem_id: findProblem(JUNIOR_UNIT_LESSONS, lessonMetaData[tabIndex].problem_id, "previous")
            }
        });
    };

    const scrollRight = () => {
        dispatch({
            type: 'SET_LESSON_META_DATA',
            index: tabIndex,
            payload: {
                problem_id: findProblem(JUNIOR_UNIT_LESSONS, lessonMetaData[tabIndex].problem_id, "next")
            }
        });
    };

    return (
        <div className="universal">
            <div className={styles.paths}>
                <div className={styles.tabWrapper}>
                    <div className={styles.buttonRow}>
                        {defaultTabs.map((tab, index) => (
                            <Tab
                                key={index}
                                index={index}
                                tab={tab}
                                isActive={tabIndex === index}
                                type='lesson'
                            />
                        ))}
                        <div className={styles.rightAlign}>
                        </div>
                    </div>
                </div>
                {!lessonProblemData[tabIndex].data ? (
                    defaultTabs[tabIndex].data === 'Junior' ? (
                        <>
                            {JUNIOR_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={JUNIOR_UNIT_LESSONS[index]} unitTitle={JUINOR_UNIT_TITLES[index]} unitDescription={JUINOR_UNIT_DESCRIPTIONS[index] } division='Junior'/>
                                    <br />
                                </React.Fragment>
                            ))}
                            <Link to = "/computercontest">CCC junior</Link> 
                        </>
                    ) : defaultTabs[tabIndex].data === 'Senior' ? (
                        <>
                            {JUNIOR_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={JUNIOR_UNIT_LESSONS[index]} unitTitle={JUINOR_UNIT_TITLES[index]} unitDescription={JUINOR_UNIT_DESCRIPTIONS[index] } division='Junior'/>
                                    <br />
                                </React.Fragment>
                            ))}
                            <Link to = "/computercontest">CCC senior</Link>
                        </>
                    
                    ) : defaultTabs[tabIndex].data === 'Bronze' ? (
                        <>
                            <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                            <br />
                            <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                            <br />
                            <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                            <br />
                            <Link to = "/computercontest">USACO bronze</Link> 
                        </>
                    ) : defaultTabs[tabIndex].data === 'Silver' ? (
                        <>
                            <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                            <br />
                            <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                            <br />
                            <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                            <br />
                            <Link to = "/computercontest">USACO silver</Link> 
                        </>
                    ) : defaultTabs[tabIndex].data === 'Gold' ? (
                        <>
                            <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                            <br />
                            <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                            <br />
                            <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                            <br />
                            <Link to = "/computercontest">USACO gold</Link> 
                        </>
                    ) : (
                    <>
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <Link to = "/computercontest">USACO plat</Link> 
                    </>
                    )
                ) : (
                    <>
                        { true && (
                        <div className={styles.wrapper}>
                            <br />
                                <div className={styles.problemTitleRow}>
                                    <button onClick={scrollLeft} className="scroll-button left">
                                        <img src='/leftarrow.png' alt='Left' style={{maxWidth: "15px", maxHeight: "15px", background: "transparent"}}/>
                                    </button>
                                    <h1 className={styles.title}>{lessonProblemData[tabIndex].data.title}</h1>
                                    <button onClick={scrollRight} className="scroll-button right">
                                        <img src='/rightarrow.png' alt='Right' style={{maxWidth: "15px", maxHeight: "15px", background: "transparent"}}/>
                                    </button>
                                </div>
                            <br />
                            <div className={styles.description}>
                            <h3>Problem Description</h3>
                            <ReactMarkdown className={styles.descriptionText} rehypePlugins={[rehypeKatex]} children={lessonProblemData[tabIndex].data.description.replace(/\\n/g, '\n')} />
                            <div className={styles.divider}></div>
                            <br />
                            <h3>Input Format</h3>
                            <pre className={styles.descriptionText}>{lessonProblemData[tabIndex].data.inputFormat.replace(/\\n/g, '\n')}</pre>
                            <div className={styles.divider}></div>
                            <br />
                            <h3>Constraints</h3>
                            <ul>
                                {false && lessonProblemData[tabIndex].data.constraints &&
                                Object.entries(lessonProblemData[tabIndex].data.constraints).map(([key, value]) => (
                                    <li key={key}>
                                    <strong>{key}:</strong> {value}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.divider}></div>
                            <br />
                            <h3>Output Format</h3>
                            <p>{lessonProblemData[tabIndex].data.outputFormat}</p>
                            <div className={styles.divider}></div>
                            <br />
                            <h3>Points</h3>
                            <p>{lessonProblemData[tabIndex].data.points}</p>
                            </div>
                            <br />
                            <br />
                            <button className={styles.runAll} onClick={submitCode}>Run All Tests (Ctrl + Enter)</button>
                            <br />
                            <div className={styles.testCases}>
                            {testCases.map((testCase, index) => {
                                const status = results[index]?.status?.description;
                                const className = status === 'Accepted' ? styles.testCasePassed : status === 'Wrong Answer' ? styles.testCaseFailed : index % 2 === 0 ? styles.testCaseEven : styles.testCaseOdd;

                                return (
                                <div key={testCase.key} className={className}>
                                    <br />
                                    <h3 className={className}>
                                    Case {testCase.key}
                                    {results[index] && results[index].status.description === 'Accepted' && <span className={styles.passIcon}>✔️</span>}
                                    {results[index] && results[index].status.description === 'Wrong Answer' && <span className={styles.failIcon}>❌</span>}
                                    </h3>
                                    {results[index] && (
                                        <>
                                            <h5 className={className}>[ {results[index].time}s ]</h5>
                                        </>
                                    )}
                                    <br />
                                    <h4 className={className}>Input:</h4>
                                    <pre className={styles.codeSnippet}>{String(testCase.input).replace(/\\r\\n/g, '\n')}</pre>
                                    <br />
                                    <h4 className={className}>Expected Output:</h4>
                                    <pre className={styles.codeSnippet}>{String(testCase.output).replace(/\\r\\n/g, '\n')}</pre>
                                    {results[index] && results[index].status.description === 'Wrong Answer' && (
                                    <>
                                        <br />
                                        <h4 className={className}>Actual Output:</h4>
                                        <pre className={styles.codeSnippet}>{results[index].stdout ? results[index].stdout.replace(/\\r\\n/g, '\n') : "No output"}</pre>
                                    </>
                                    )}
                                </div>
                                );                
                            })}
                            </div>
                        </div>
                        )} 
                    </>
                )}
            </div>
        </div>
    );
};

export default Paths;
