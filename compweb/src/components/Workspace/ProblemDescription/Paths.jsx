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
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import axios from "axios";
import Tab from "./Tab.jsx";
import { initializeAnalytics } from "firebase/analytics";
import { JUINOR_UNIT_TITLES, JUINOR_UNIT_DESCRIPTIONS, JUNIOR_UNIT_LESSONS } from '../lessons.js';
import { SENIOR_UNIT_DESCRIPTIONS, SENIOR_UNIT_LESSONS, SENIOR_UNIT_TITLES } from "../lessons.js";
import { TEST_UNIT_LESSONS } from "../lessons.js";
import { BRONZE_UNIT_DESCRIPTIONS, BRONZE_UNIT_LESSONS, BRONZE_UNIT_TITLES } from "../lessons.js";
import { SILVER_UNIT_DESCRIPTIONS, SILVER_UNIT_LESSONS, SILVER_UNIT_TITLES } from "../lessons.js";
import { GOLD_UNIT_DESCRIPTIONS, GOLD_UNIT_LESSONS, GOLD_UNIT_TITLES } from "../lessons.js";
import { PLAT_UNIT_DESCRIPTIONS, PLAT_UNIT_LESSONS, PLAT_UNIT_TITLES } from "../lessons.js";
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { dark } from "@mui/material/styles/createPalette.js";

const Item = styled(Paper)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 'none',
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
      width: '100%',
      height: '100%',
    },
  }));  

const LessonBackgroundRect = ({ onButtonClick, isFocused, ...props }) => {
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          // Get the current user
          const currentUser = auth.currentUser;
  
          if (currentUser) { // Check if currentUser is not null
  
            // Get the document reference for the current user from Firestore
            const userDocRef = doc(db, "Users", currentUser.uid);
  
            // Fetch user data from Firestore
            const userSnapshot = await getDoc(userDocRef);
            if (userSnapshot.exists()) {
              // Extract required user information from the snapshot
              const userData = userSnapshot.data();
              console.log("LESSONBACKGROUND RECT userData", userData);
              setUserData(userData); // Set the user data in the state
            } else {
              console.log("No such document!");
            }
          }
          else {
            console.log("NO CURRENT USER UH OH", currentUser)
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();
    }, [auth.currentUser]); // Empty dependency array ensures the effect runs only once when the component mounts  

    useEffect(() => {
        console.log("CHANGE IN USERDATA PATHS BGRECT", userData);
    }, [userData]);

    const [open, setOpen] = React.useState(false);
    const [questions, setQuestions] = useState([]);
    const tabIndex = useSelector(state => state.lessonTabIndex);

    const dispatch = useDispatch();

    const handleTooltipClose = () => {
      setOpen(false);
    };
  
    const handleTooltipOpen = () => {
      setOpen(true);
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
        if (open) {
            const fetchData = async () => {
                const data = await addGroup(props.problemIds);
                setQuestions(data);
            };
        
            fetchData();
        }
    }, [open]);

    return (
        <div className="universal">
            <ClickAwayListener onClickAway={handleTooltipClose}>
                <div>
                    <HtmlTooltip
                        title={
                            <React.Fragment>
                                {questions.length !== 0 && (
                                    <div className="question-list-rect">
                                        <div>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Points</th>
                                                <th>Topics</th>
                                                <th>Contest</th>
                                                <th>Solved</th>
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
                                                { userData && userData.solved ? <td>{userData.solved.includes(q.title) ? "yes" : "no"}</td> : <td>no</td> }
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
                                                                division: props.division,
                                                                lesson: props.lessonName,
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
                                )}
                            </React.Fragment>
                        }
                        PopperProps={{
                            disablePortal: true,
                        }}
                        onClose={handleTooltipClose}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        arrow
                    >
                        <div 
                            className={`lesson-background-rect ${ open ? 'hovered' : ''}`}
                            onClick={handleTooltipOpen}
                            tabIndex="0" // Add this to make the div focusable
                        >
                            <img className="lesson-icon" src={ props.imgPath } alt="sad"></img>
                            <div>
                                <Item className={`bottom-rectangle ${props.lessonName.length > 12 ? 'long-lesson-name' : 'lesson-name'}`} onClick={onButtonClick}>{ props.lessonName }</Item>
                            </div>
                        </div>
                    </HtmlTooltip>
                </div>
            </ClickAwayListener>
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
            <div className="hero" style={{background: false ? "url('/val.png') no-repeat center center" : ""}}>
                <ThemeProvider theme={darkTheme}>
                    <Item elevation={5}>
                        <div className="unit-header">
                            <div className="unit-header-left">
                                <h1 className='unit-title'>{unitTitle}</h1>
                                <br />
                                <p>{unitDescription}</p>
                            </div>
                            {true && <div className="unit-header-right"><button className="start-button">Start</button></div>}
                        </div>
                    </Item>
                </ThemeProvider>
            </div>
                { false && <button onClick={scrollLeft} className="scroll-button left">
                    <img src='/leftarrow.png' alt='Left' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/>
                </button>}
                <div className="unit-lessons-wrapper" ref={scrollContainer}>
                    {console.log('Scroll Container:', scrollContainer)}
                    {lessons.map((row, rowIndex) => {
                        console.log(`Row ${rowIndex}:`, row);
                        return (
                            <div className='lesson-row'>
                                {row.map((lesson, lessonIndex) => {
                                    console.log(`Lesson ${lessonIndex} in Row ${rowIndex}:`, lesson);
                                    return (
                                        <LessonBackgroundRect key={lessonIndex} {...lesson} onButtonClick={() => {
                                            console.log(`Button clicked in Lesson ${lessonIndex} in Row ${rowIndex}`);
                                            handleButtonClick(lessonIndex);
                                        }} isFocused={lessonIndex === lastPressed && isQuestionListOpen} division={division}/>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                { false && <button onClick={scrollRight} className="scroll-button right">
                    <img src='/rightarrow.png' alt='Right' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/>
                </button>}
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
    function customParser(text) {
        const newText = text.replace(/`(.*?)`/g, `<span class="${styles.customLatex}">$1</span>`);
        return newText;
      }

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
        if (lessonProblemData && lessonProblemData[tabIndex] && lessonProblemData[tabIndex].data && lessonProblemData[tabIndex].data.testCases) {
            setTestCases(lessonProblemData[tabIndex].data.testCases);
        }
    }, [tabIndex]); // Add state as a dependency to useEffect

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

        console.log("dewfaluts results", results);
    
        // Example parsing
        const problemPassed = () => {
            if (results && results.length !== 0) {
                for (let test of results) {
                    if (test.status.description !== 'Accepted') {
                        return false;
                    }
                }
                return true;
            }
            else {
                return false;
            }
        };
    
        console.log("Problem passed:", problemPassed());
    
        console.log("lessonProblemData[tabIndex]", lessonProblemData[tabIndex]);

        // If the problem is solved, update the user's document
        if (problemPassed() && lessonProblemData[tabIndex]) {
            const questionName = lessonProblemData[tabIndex].data.title; // Assuming the question name is stored here
            const pointsEarned = lessonProblemData[tabIndex].data.points; // Assuming the points earned for solving the question are stored here
            const userUid = auth.currentUser.uid; // Get the current user's UID
    
            updateUserSolvedQuestions(userUid, questionName, pointsEarned);
        }
    }, [results, lessonProblemData, tabIndex, db, auth]);

      function findProblem(currentProblemId, direction) {

        let data;
        switch (defaultTabs[tabIndex].data) {
            case 'Junior':
                data = JUNIOR_UNIT_LESSONS;
                break;
            case 'Senior':
                data = SENIOR_UNIT_LESSONS;
                break;
            case 'Bronze':
                data = BRONZE_UNIT_LESSONS;
                break;
            case 'Silver':
                data = SILVER_UNIT_LESSONS;
                break;
            case 'Gold':
                data = GOLD_UNIT_LESSONS;
                break;
            case 'Platinum':
                data = PLAT_UNIT_LESSONS;
                break;
            default:
                data = null;
        }

        for (let unit of data) {
            for (let row of unit) {
                for (let lesson of row) {
                    console.log("lesson", lesson);
                    console.log("currentProblemId", currentProblemId);
                    let problemIds = lesson.problemIds;
                    if (problemIds.includes(currentProblemId)) {
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
            }
        }
        return null;
    }    

    const scrollLeft = () => {
        dispatch({
            type: 'SET_LESSON_META_DATA',
            index: tabIndex,
            payload: {
                problem_id: findProblem(lessonMetaData[tabIndex].problem_id, "previous")
            }
        });
    };

    const scrollRight = () => {
        dispatch({
            type: 'SET_LESSON_META_DATA',
            index: tabIndex,
            payload: {
                problem_id: findProblem(lessonMetaData[tabIndex].problem_id, "next")
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
                                    <ScrollRow lessons={lessons} unitTitle={JUINOR_UNIT_TITLES[index]} unitDescription={JUINOR_UNIT_DESCRIPTIONS[index]} division='Junior'/>
                                    <br />
                                </React.Fragment>
                            ))}
                            <Link to = "/computercontest">CCC junior</Link> 
                        </>
                    ) : defaultTabs[tabIndex].data === 'Senior' ? (
                        <>
                            {SENIOR_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={SENIOR_UNIT_TITLES[index]} unitDescription={SENIOR_UNIT_DESCRIPTIONS[index] } division='Senior'/>
                                    <br />
                                </React.Fragment>
                            ))}
                            <Link to = "/computercontest">CCC senior</Link>
                        </>
                    
                    ) : defaultTabs[tabIndex].data === 'Bronze' ? (
                        <>
                            {BRONZE_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={BRONZE_UNIT_TITLES[index]} unitDescription={BRONZE_UNIT_DESCRIPTIONS[index] } division='Bronze'/>
                                    <br />
                                </React.Fragment>
                            ))}
                            <Link to = "/computercontest">USACO bronze</Link> 
                        </>
                    ) : defaultTabs[tabIndex].data === 'Silver' ? (
                        <>
                            {SILVER_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={SILVER_UNIT_TITLES[index]} unitDescription={SILVER_UNIT_DESCRIPTIONS[index] } division='Silver'/>
                                    <br />
                                </React.Fragment>
                            ))}
                            <Link to = "/computercontest">USACO silver</Link> 
                        </>
                    ) : defaultTabs[tabIndex].data === 'Gold' ? (
                        <>
                            {GOLD_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={GOLD_UNIT_TITLES[index]} unitDescription={GOLD_UNIT_DESCRIPTIONS[index] } division='Gold'/>
                                    <br />
                                </React.Fragment>
                            ))}
                            <Link to = "/computercontest">USACO gold</Link> 
                        </>
                    ) : (
                    <>
                            {PLAT_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={PLAT_UNIT_TITLES[index]} unitDescription={PLAT_UNIT_DESCRIPTIONS[index] } division='Platinum'/>
                                    <br />
                                </React.Fragment>
                            ))}
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
                                {lessonProblemData[tabIndex].data.description && (
                                    <>
                                    {lessonProblemData[tabIndex].data.specificContest && <h3>{lessonProblemData[tabIndex].data.specificContest}</h3>}
                                    <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(lessonProblemData[tabIndex].data.description.replace(/\\n/g, '\n'))} />
                                    <div className={styles.divider}></div>
                                    <br />
                                    </>
                                )}
                                {lessonProblemData[tabIndex].data.inputFormat && (
                                    <>
                                    <h3>Input Format</h3>
                                    <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(lessonProblemData[tabIndex].data.inputFormat.replace(/\\n/g, '\n'))} />
                                    <div className={styles.divider}></div>
                                    <br />
                                    </>
                                )}
                                {false && lessonProblemData[tabIndex].data.constraints && (
                                    <>
                                    <h3>Constraints</h3>
                                    <ul>
                                        {Object.entries(lessonProblemData[tabIndex].data.constraints).map(([key, value]) => (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                        ))}
                                    </ul>
                                    <div className={styles.divider}></div>
                                    <br />
                                    </>
                                )}
                                {lessonProblemData[tabIndex].data.outputFormat && (
                                    <>
                                    <h3>Output Format</h3>
                                    <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(lessonProblemData[tabIndex].data.outputFormat.replace(/\\n/g, '\n'))} />
                                    <div className={styles.divider}></div>
                                    <br />
                                    </>
                                )}
                                {lessonProblemData[tabIndex].data.sample1 && lessonProblemData[tabIndex].data.sample1.input && (
                                    <>
                                    <h3>Sample Input 1</h3>
                                    <pre className={styles.codeSnippet}>{lessonProblemData[tabIndex].data.sample1.input.replace(/\\n/g, '\n')}</pre>
                                    <br />
                                    <h3>Output for Sample Input 1</h3>
                                    <pre className={styles.codeSnippet}>{lessonProblemData[tabIndex].data.sample1.output.replace(/\\n/g, '\n')}</pre>
                                    <br />
                                    <h3>Explanation for Sample 1</h3>
                                    {lessonProblemData[tabIndex].data.sample1.explanation && <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(lessonProblemData[tabIndex].data.sample1.explanation.replace(/\\n/g, '\n'))} />}
                                    <br />
                                    <div className={styles.divider}></div>
                                    <br />
                                    </>
                                )}
                                {lessonProblemData[tabIndex].data.sample2 && lessonProblemData[tabIndex].data.sample2.input && (
                                    <>
                                    <h3>Sample Input 2</h3>
                                    <pre className={styles.codeSnippet}>{lessonProblemData[tabIndex].data.sample2.input.replace(/\\n/g, '\n')}</pre>
                                    <br />
                                    <h3>Output for Sample Input 2</h3>
                                    <pre className={styles.codeSnippet}>{lessonProblemData[tabIndex].data.sample2.output.replace(/\\n/g, '\n')}</pre>
                                    <br />
                                    <h3>Explanation for Sample 2</h3>
                                    {lessonProblemData[tabIndex].data.sample2.explanation && <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(lessonProblemData[tabIndex].data.sample2.explanation.replace(/\\n/g, '\n'))} />}
                                    <br />
                                    <div className={styles.divider}></div>
                                    <br />
                                    </>
                                )}
                                {lessonProblemData[tabIndex].data.sample3 && lessonProblemData[tabIndex].data.sample3.input && (
                                    <>
                                    <h3>Sample Input 3</h3>
                                    <pre className={styles.codeSnippet}>{lessonProblemData[tabIndex].data.sample3.input.replace(/\\n/g, '\n')}</pre>
                                    <br />
                                    <h3>Output for Sample Input 3</h3>
                                    <pre className={styles.codeSnippet}>{lessonProblemData[tabIndex].data.sample3.output.replace(/\\n/g, '\n')}</pre>
                                    <br />
                                    <h3>Explanation for Sample 3</h3>
                                    {lessonProblemData[tabIndex].data.sample3.explanation && <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(lessonProblemData[tabIndex].data.sample3.explanation.replace(/\\n/g, '\n'))} />}
                                    <br />
                                    <div className={styles.divider}></div>
                                    <br />
                                    </>
                                )}
                                {lessonProblemData[tabIndex].data.points && (
                                    <>
                                    <h3>Points</h3>
                                    <p>{lessonProblemData[tabIndex].data.points}</p>
                                    </>
                                )}
                                </div>
                                <br />
                                <br />
                                <button className={styles.runAll} onClick={submitCode} style={{color: 'white'}}>Run All Tests (Ctrl + Enter)</button>
                                <br />
                                <div className={styles.testCases}>
                                {lessonProblemData[tabIndex].data.testCases ? lessonProblemData[tabIndex].data.testCases.map((testCase, index) => {
                                    const status = results[index]?.status?.description;
                                    const className = status === 'Accepted' ? styles.testCasePassed : (status === 'Wrong Answer' || status === 'Time limit exceeded') ? styles.testCaseFailed : index % 2 === 0 ? styles.testCaseEven : styles.testCaseOdd;

                                    return (
                                    <div key={testCase.key} className={className}>
                                        <br />
                                        <h3 className={className}>
                                        Case {testCase.key}
                                        {results[index] && results[index].status.description === 'Accepted' && <span className={styles.passIcon}> ✔️</span>}
                                        {results[index] && results[index].status.description === 'Wrong Answer' && <span className={styles.failIcon}> ❌</span>}
                                        {results[index] && results[index].status.description === 'Time limit exceeded' && <span className={styles.failIcon}> (Time limit exceeded)</span>}
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
                                }) : (
                                    <div>
                                        <h2>Test cases for this problem are coming soon!</h2>
                                        <br />
                                    </div>              
                                )}
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
