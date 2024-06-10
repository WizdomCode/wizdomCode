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
import { JUINOR_UNIT_TITLES, JUINOR_UNIT_DESCRIPTIONS, JUNIOR_UNIT_LESSONS } from '../lessons.jsx';
import { SENIOR_UNIT_DESCRIPTIONS, SENIOR_UNIT_LESSONS, SENIOR_UNIT_TITLES } from "../lessons.jsx";
import { TEST_UNIT_LESSONS } from "../lessons.jsx";
import { BRONZE_UNIT_DESCRIPTIONS, BRONZE_UNIT_LESSONS, BRONZE_UNIT_TITLES } from "../lessons.jsx";
import { SILVER_UNIT_DESCRIPTIONS, SILVER_UNIT_LESSONS, SILVER_UNIT_TITLES } from "../lessons.jsx";
import { GOLD_UNIT_DESCRIPTIONS, GOLD_UNIT_LESSONS, GOLD_UNIT_TITLES } from "../lessons.jsx";
import { PLAT_UNIT_DESCRIPTIONS, PLAT_UNIT_LESSONS, PLAT_UNIT_TITLES } from "../lessons.jsx";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { dark } from "@mui/material/styles/createPalette.js";
import CheckCircle from '@mui/icons-material/CheckCircle'
import CircleProgressBar from "../../Paths/CircleProgressBar.jsx";
import zIndex from "@mui/material/styles/zIndex.js";
import { useClickOutside } from '@mantine/hooks';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { Card, Overlay, Button, Text, Container, Stack, Group, Title } from '@mantine/core';
import ProblemDescription from './ProblemDescription.jsx';
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

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

const LessonBackgroundRect = ({ onButtonClick, isFocused, userData, allMetaData, ...props }) => {
    const [readCount, setReadCount] = useState(0);
  
    useEffect(() => {
      console.log("LessonBackgroundRect reads:", readCount);
    }, [readCount]);  

    const [numProblems, setNumProblems] = useState(0);
    const [problemsCompleted, setProblemsCompleted] = useState(0);

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
          return allMetaData[questionID];
        }
      };

    const addGroup = async (problemIds) => {
        const problemDataPromises = problemIds.map(problem_id => fetchProblemData(problem_id));
        const problemsData = await Promise.all(problemDataPromises);
        problemsData.forEach((problemData, index) => {
        });
        return problemsData;
    };

    useEffect(() => {

        const updateUserSolvedCategories = async (userUid) => {
            try {
                // Get a reference to the user's document
                const userDocRef = doc(db, "Users", userUid);

                const solvedCategories = userData.solvedCategories || [];

                const stringId = `${props.categoryId.unitTitle}${props.categoryId.rowIndex}${props.categoryId.lessonIndex}`;
        
                if (!solvedCategories.includes(stringId)) {
                // Update the user's document to add the solved question and increment points
                await updateDoc(userDocRef, {
                    solvedCategories: arrayUnion(stringId), // Add the question name to the solved array
                    points: 10 + (userData.points || 0), // Increment points
                    coins: 100 + (userData.coins || 0),
                });
                } else {
                }
            } catch (error) {
            }
        }

        const fetchData = async () => {
            let count = 0;
            let numProblems = 0;    

            const data = await addGroup(props.problemIds);
            for (let question of data) {
                if (question && question.title && userData && userData.solved && userData.solved.includes(question.title)) {
                    count++;
                }
                numProblems++;
            }
            
            setProblemsCompleted(count);
            setNumProblems(numProblems);
            setQuestions(data);

            const problemPassed = () => {
                return count === numProblems;
            };
            
            // If the problem is solved, update the user's document
            if (problemPassed() && auth.currentUser) {
                const userUid = auth.currentUser.uid; // Get the current user's UID
            
                updateUserSolvedCategories(userUid);
            }
        };
        
        if (allMetaData && userData) fetchData();
    }, [allMetaData, userData]);

    const activeCategoryId = useSelector(state => state.activeCategoryId);

    useEffect(() => {
        const fetchData = async () => {
            if (questions && activeCategoryId) {
                const categoryIsActive = activeCategoryId.unitTitle === props.categoryId.unitTitle && activeCategoryId.lessonIndex === props.categoryId.lessonIndex && activeCategoryId.rowIndex === props.categoryId.rowIndex;
                if (categoryIsActive) {
                    console.log("SET_LESSON_QUESTION_LIST", questions);
                    console.log("props.problemIds", props.problemIds);
    
                    // .problemIds is always right but questions is not
                    const data = await addGroup(props.problemIds);
                    setQuestions(data);
                    dispatch({ type: 'SET_LESSON_QUESTION_LIST', payload: data });
                }
            }
        };
        fetchData();
    }, [activeCategoryId]);    

    return (
        <div className="universal" style={{ position: 'relative' }}>
            <CircleProgressBar progress={problemsCompleted / numProblems * 100} style={{position: 'absolute', zIndex: 1}}/>
            <ClickAwayListener onClickAway={handleTooltipClose}>
                <div style={{position: 'absolute', zIndex: 2, top: 25, left: 35, right: -10, bottom: 0}}>
                        <div 
                            className={`lesson-background-rect ${ open ? 'hovered' : ''}`}
                            // onClick={handleTooltipOpen}
                            onClick={onButtonClick}
                            tabIndex="0" // Add this to make the div focusable
                            style={{ backgroundColor: 'var(--code-bg)' }}
                        >
                            { props.imgPath && typeof props.imgPath === 'string' ? (
                                <img className="lesson-component-icon" src={ props.imgPath } alt="sad"></img>
                            ) : (
                                <>
                                    {props.imgPath}
                                </>
                            )}
                            <div>
                                <Item className={`bottom-rectangle ${props.lessonName.length > 12 ? 'long-lesson-name' : 'lesson-name'}`}>{ props.lessonName }</Item>
                            </div>
                        </div>
                    {activeCategoryId && activeCategoryId.unitTitle === props.categoryId.unitTitle && activeCategoryId.lessonIndex === props.categoryId.lessonIndex && activeCategoryId.rowIndex === props.categoryId.rowIndex &&
                        <ArrowDropUpRoundedIcon style={{ height: '100px', width: '100px', marginTop: '-30px', marginLeft: '35px' }}/>
                    }
                </div>
            </ClickAwayListener>
        </div>
    );
};

const ScrollRow = ({ lessons, unitTitle, unitDescription, division, userData, allMetaData }) => {

    const [readCount, setReadCount] = useState(0);
  
    useEffect(() => {
        console.log("ScrollRow reads:", readCount);
    }, [readCount]);

    const scrollContainer = useRef(null);
    const scrollDistance = 200;
    const scrollDuration = 30;
    const scrollInterval = 1;

    const [questions, setQuestions] = useState([]);
    const [lastPressed, setLastPressed] = useState(null);
    const [isQuestionListOpen, setIsQuestionListOpen] = useState(false); // Add this line

    const activePathTab = useSelector(state => state.activePathTab);
    const cccTabIndex = useSelector(state => state.cccTabIndex);
    const usacoTabIndex = useSelector(state => state.usacoTabIndex);
    
    const dispatch = useDispatch();

    const handleButtonClick = (lessonIndex) => {
        if (lessonIndex === lastPressed) {
            setIsQuestionListOpen(!isQuestionListOpen); // Toggle question list state when clicked
        } else {
            setLastPressed(lessonIndex);
            setIsQuestionListOpen(true); // Open question list when a new LessonBackgroundRect is clicked
        }
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

    useEffect(() => {
    
        if (lessons && lessons[lastPressed] && allMetaData) {
            const rowMetaData = lessons[activeCategoryId.rowIndex][activeCategoryId.lessonIndex].problemIds.map(problem_id => allMetaData[problem_id]);
            setQuestions(rowMetaData);
        }
    }, [lastPressed]);
      
    const [isProblemListOpen, setIsProblemListOpen] = useState(false);
    const ref = useClickOutside(() => {
        dispatch({ type: 'SET_ACTIVE_CATEGORY_ID', payload: null });
        setIsProblemListOpen(false);
    });   

    const lessonQuestionList = useSelector(state => state.lessonQuestionList);
    const activeCategoryId = useSelector(state => state.activeCategoryId);
    
    return (
        <div className="universal">
            <div style={{height: '10rem', display: 'flex', alignItems: 'center', background: false ? "url('/val.png') no-repeat center center" : ""}}>
                <Container style={{ width: '100%' }}>
                    <Card radius="md" style={{ width: '100%', justifyContent: 'center' }} h={90} bg={'var(--selected-item)'}>
                        <Group justify="space-between">
                            <Stack justify="center">
                                <Title order={2}>{unitTitle}</Title>
                                { unitDescription && <p>{unitDescription}</p>}
                            </Stack>
                            {true && <Button color="var(--accent)" size="md">Start</Button>}
                        </Group>
                    </Card>
                </Container>
            </div>
                { false && <button onClick={scrollLeft} className="scroll-button left">
                    <img src='/leftarrow.png' alt='Left' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/>
                </button>}
                <div className="unit-lessons-wrapper" ref={scrollContainer}>
                    {lessons.map((row, rowIndex) => {
                        return (
                            <>
                                <div className='lesson-row'>
                                    {row.map((lesson, lessonIndex) => {
                                        return (
                                            <LessonBackgroundRect key={lessonIndex} userData={userData} allMetaData={allMetaData} {...lesson} onButtonClick={() => {
                                                handleButtonClick(lessonIndex);
                                                dispatch({ type: 'SET_ACTIVE_CATEGORY_ID', payload: { unitTitle: unitTitle, rowIndex: rowIndex, lessonIndex: lessonIndex }});
                                            }} isFocused={lessonIndex === lastPressed && isQuestionListOpen} division={division} categoryId={{ unitTitle: unitTitle, rowIndex: rowIndex, lessonIndex: lessonIndex }}/>
                                        );
                                    })}
                                </div>
                                <React.Fragment>
                                    {
                                    activeCategoryId && activeCategoryId.unitTitle === unitTitle && activeCategoryId.rowIndex === rowIndex && lessonQuestionList && (
                                        <div className="question-list-rect" style={{ zIndex: 9999 }} ref={ref}>
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
                                                {lessonQuestionList.map((q) => (
                                                    q && q.title &&
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
                                                                    type: activePathTab === 'usaco' ? 'SET_USACO_META_DATA' : 'SET_CCC_META_DATA',
                                                                    index: activePathTab === 'usaco' ? usacoTabIndex : cccTabIndex,
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
                                    )}
                                </React.Fragment>
                            </>
                        );
                    })}
                </div>
        </div>
    );
};

const Paths = (props) => {

    const [readCount, setReadCount] = useState(0);
  
    useEffect(() => {
      console.log("Paths reads:", readCount);
    }, [readCount]);

    const allMetaData = useSelector(state => state.allMetaData);

    useEffect(() => {
        const docRef = doc(db, "ProblemMetadata", "AllData");
    
        const fetchData = async () => {
            try {
                const docSnap = await getDoc(docRef);
                setReadCount(prevReadCount => prevReadCount + 1);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    dispatch({ type: 'SET_ALL_META_DATA', payload: data });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error getting document:', error);
            }
        };
    
        if (!allMetaData) {
            console.log("Fetching all problem metadata...");
            fetchData();
        } else {
            console.log("All problem metadata already exsitsw");
        }
    }, []);

    function customParser(text) {
        const newText = text.replace(/`(.*?)`/g, `<span class="${styles.customLatex}">$1</span>`);
        return newText;
      }

    const usacoMetaData = useSelector(state => state.usacoMetaData); // This is what is actually used to keep track of which problem is active, contains all problem data
    const cccMetaData = useSelector(state => state.cccMetaData); // This is what is actually used to keep track of which problem is active, contains all problem data
    const code = useSelector(state => state.codeState);
    const currentlyClickedTab = useSelector(state => state.lessonActiveTab); // Something like this: {type: 'division', data: 'Junior'}, used to keep track of active tab
    const tabs = useSelector(state => state.lessonTabs); // Array of currentlyClickedTabs
    const usacoProblemData = useSelector(state => state.usacoProblemData);
    const cccProblemData = useSelector(state => state.cccProblemData);
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

    const activePathTab = useSelector(state => state.activePathTab);
    const cccTabIndex = useSelector(state => state.cccTabIndex);
    const usacoTabIndex = useSelector(state => state.usacoTabIndex);

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
            setReadCount(prevReadCount => prevReadCount + 1);

            if (docRef.exists()) {
              let problemData = docRef.data();
              return problemData;
            } else {
            }
          } catch (error) {
          }
        }
      };
      
      const addGroup = async (problemId) => {
        const problemData = await fetchProblemData(problemId);
        return problemData;
      };    
      
      useEffect(() => {
        const fetchData = async () => {
          const data = await addGroup((activePathTab === 'usaco' ? usacoMetaData[usacoTabIndex] : cccMetaData[cccTabIndex]).problem_id);
          dispatch({
            type: activePathTab === 'usaco' ? 'SET_USACO_PROBLEM_DATA' : 'SET_CCC_PROBLEM_DATA',
            index: activePathTab === 'usaco' ? usacoTabIndex : cccTabIndex,
            payload: {
              data: data
            }
          });
        };
      
        fetchData();
      }, [cccMetaData, usacoMetaData]);      

    const state = useSelector(state => state); // Access the state

    const submitCode = async () => {
    
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
    
        const data = await response.json();
    
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
                setReadCount(prevReadCount => prevReadCount + 1);

                const solvedQuestions = userDocSnapshot.data().solved || [];
    
                if (!solvedQuestions.includes(questionName)) {
                    // Update the user's document to add the solved question and increment points
                    await updateDoc(userDocRef, {
                        solved: arrayUnion(questionName), // Add the question name to the solved array
                        points: points + (userDocSnapshot.data().points || 0) // Increment points
                    });
                } else {
                }
            } catch (error) {
            }
        };

    
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

        // If the problem is solved, update the user's document
        if (problemPassed() && (activePathTab === 'usaco' ? usacoProblemData[usacoTabIndex] : cccProblemData[cccTabIndex])) {
            const questionName = (activePathTab === 'usaco' ? usacoProblemData[usacoTabIndex] : cccProblemData[cccTabIndex]).data.title; // Assuming the question name is stored here
            const pointsEarned = (activePathTab === 'usaco' ? usacoProblemData[usacoTabIndex] : cccProblemData[cccTabIndex]).data.points; // Assuming the points earned for solving the question are stored here
            const userUid = auth.currentUser.uid; // Get the current user's UID
    
            updateUserSolvedQuestions(userUid, questionName, pointsEarned);
        }
    }, [results]);

      function findProblem(currentProblemId, direction) {

        let data;
        switch (defaultTabs[activePathTab === 'usaco' ? usacoTabIndex : cccTabIndex].data) {
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
            type: activePathTab === 'usaco' ? 'SET_USACO_META_DATA' : 'SET_CCC_META_DATA',
            index: activePathTab === 'usaco' ? usacoTabIndex : cccTabIndex,
            payload: {
                problem_id: findProblem((activePathTab === 'usaco' ? usacoMetaData[usacoTabIndex] : cccMetaData[cccTabIndex]).problem_id, "previous")
            }
        });
    };

    const scrollRight = () => {
        dispatch({
            type: activePathTab === 'usaco' ? 'SET_USACO_META_DATA' : 'SET_CCC_META_DATA',
            index: activePathTab === 'usaco' ? usacoTabIndex : cccTabIndex,
            payload: {
                problem_id: findProblem((activePathTab === 'usaco' ? usacoMetaData[usacoTabIndex] : cccMetaData[cccTabIndex]).problem_id, "next")
            }
        });
    };

    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            // Get the current user
            const currentUser = auth.currentUser;

            if (currentUser) { // Check if currentUser is not null
            setUserId(currentUser.uid); // Set the user ID

            // Get the document reference for the current user from Firestore
            const userDocRef = doc(db, "Users", currentUser.uid);

            // Fetch user data from Firestore
            const userSnapshot = await getDoc(userDocRef);
            setReadCount(prevReadCount => prevReadCount + 1);
            
            if (userSnapshot.exists()) {
                // Extract required user information from the snapshot
                const userData = userSnapshot.data();
                setUserData(userData); // Set the user data in the state
            } else {
            }
            }
        } catch (error) {
        }
        };

        fetchUserData();
    }, [auth.currentUser]);

    const [solutions, setSolutions] = useState([]);
    const [selectedTab, setSelectedTab] = useState('question');

    useEffect(() => {
        const fetchSolutions = async () => {
          try {
            // Get a reference to the question document
            const questionDocRef = doc(db, "Questions", (activePathTab === 'usaco' ? usacoProblemData[usacoTabIndex] : cccProblemData[cccTabIndex]).data.title);
            const questionDocSnapshot = await getDoc(questionDocRef);
            setReadCount(prevReadCount => prevReadCount + 1);
    
            if (questionDocSnapshot.exists()) {
              const questionData = questionDocSnapshot.data();
              const solutions = questionData.solutions || [];
              setSolutions(solutions);
            } else {
            }
          } catch (error) {
          }
        };
    
        fetchSolutions();
      }, [usacoTabIndex, cccTabIndex]);

      const [testCases, setTestCases] = useState([]);
      const [displayCases, setDisplayCases] = useState([]);

      useEffect(() => {
        if ((activePathTab === 'usaco' ? usacoProblemData[usacoTabIndex] : cccProblemData[cccTabIndex]).data && (activePathTab === 'usaco' ? usacoProblemData[usacoTabIndex] : cccProblemData[cccTabIndex]).data.folder) {
          props.setIsLessonProblemActive(true);
            
          const testCaseObj = {};
          const storage = getStorage();
          const listRef = ref(storage, `/TestCaseData/${(activePathTab === 'usaco' ? usacoProblemData[usacoTabIndex] : cccProblemData[cccTabIndex]).data.folder}`);
      
          listAll(listRef)
            .then((res) => {
              let promises = res.items.map((itemRef) => {
                return getDownloadURL(ref(storage, itemRef))
                  .then((url) => {
                    return new Promise((resolve, reject) => {
                      const xhr = new XMLHttpRequest();
                      xhr.responseType = '';
                      xhr.onload = (event) => {
                        let data = xhr.response;
                        let numPart = parseInt(itemRef._location.path_.match(/(\d+)\.txt$/)[1]);
                        testCaseObj[numPart] = data;
                        resolve();
                      };
                      xhr.onerror = reject;
                      xhr.open('GET', url);
                      xhr.send();
                    });
                  });
              });
      
              Promise.all(promises)
                .then(() => {
                  let testCaseArray = [];
                  let displayCaseArray = [];
    
                  let i = 1;
                  while (testCaseObj.hasOwnProperty(String(i))) {
                    testCaseArray.push({ key: (i + 1) / 2, input: testCaseObj[i], output: testCaseObj[i + 1] });
    
                    let inputLines, outputLines;
    
                    try {
                      inputLines = testCaseObj[i].toString().split('\n', 106);
                      outputLines = testCaseObj[i + 1].toString().split('\n', 106);
                    } catch (error) {
                      inputLines = String(testCaseObj[i]).split('\n', 106);
                      outputLines = String(testCaseObj[i + 1]).split('\n', 106);
                    }  
    
                    if (inputLines.length > 105) {
                      inputLines = inputLines.slice(0, 105);
                      inputLines.push('...(more lines)');
                    }
      
                    if (outputLines.length > 105) {
                      outputLines = outputLines.slice(0, 105);
                      outputLines.push('...(more lines)');
                    }  
                    
                    inputLines = inputLines.map(line => line.length > 60 ? line.substring(0, 60) + '...' : line);
                    outputLines = outputLines.map(line => line.length > 60 ? line.substring(0, 60) + '...' : line);
      
                    displayCaseArray.push({ key: (i + 1) / 2, input: inputLines.join('\n'), output: outputLines.join('\n') });
    
                    i += 2;
                  }
    
                  setTestCases(testCaseArray);
                  setDisplayCases(displayCaseArray);
                })
                .catch((error) => {
                    console.log(error);
                });
            })
            .catch((error) => {
                console.log(error);
            });
        } else {
            props.setIsLessonProblemActive(false);
        }
      }, [(activePathTab === 'usaco' ? usacoProblemData[usacoTabIndex] : cccProblemData[cccTabIndex]).data]);

    return (
        <div className="universal">
            <div className={styles.paths}>
                {!(activePathTab === 'usaco' ? usacoProblemData[usacoTabIndex] : cccProblemData[cccTabIndex]).data ? (
                    defaultTabs[activePathTab === 'usaco' ? usacoTabIndex : cccTabIndex].data === 'Junior' ? (
                        <>
                            {JUNIOR_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={JUINOR_UNIT_TITLES[index]} unitDescription={JUINOR_UNIT_DESCRIPTIONS[index]} division='Junior' userData={userData} allMetaData={allMetaData}/>
                                    <br />
                                </React.Fragment>
                            ))}
                        </>
                    ) : defaultTabs[activePathTab === 'usaco' ? usacoTabIndex : cccTabIndex].data === 'Senior' ? (
                        <>
                            {SENIOR_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={SENIOR_UNIT_TITLES[index]} unitDescription={SENIOR_UNIT_DESCRIPTIONS[index] } division='Senior' userData={userData} allMetaData={allMetaData}/>
                                    <br />
                                </React.Fragment>
                            ))}
                        </>
                    
                    ) : defaultTabs[activePathTab === 'usaco' ? usacoTabIndex : cccTabIndex].data === 'Bronze' ? (
                        <>
                            {BRONZE_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={BRONZE_UNIT_TITLES[index]} unitDescription={BRONZE_UNIT_DESCRIPTIONS[index] } division='Bronze' userData={userData} allMetaData={allMetaData}/>
                                    <br />
                                </React.Fragment>
                            ))}
                        </>
                    ) : defaultTabs[activePathTab === 'usaco' ? usacoTabIndex : cccTabIndex].data === 'Silver' ? (
                        <>
                            {SILVER_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={SILVER_UNIT_TITLES[index]} unitDescription={SILVER_UNIT_DESCRIPTIONS[index] } division='Silver' userData={userData} allMetaData={allMetaData}/>
                                    <br />
                                </React.Fragment>
                            ))}
                        </>
                    ) : defaultTabs[activePathTab === 'usaco' ? usacoTabIndex : cccTabIndex].data === 'Gold' ? (
                        <>
                            {GOLD_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={GOLD_UNIT_TITLES[index]} unitDescription={GOLD_UNIT_DESCRIPTIONS[index] } division='Gold' userData={userData} allMetaData={allMetaData}/>
                                    <br />
                                </React.Fragment>
                            ))}
                        </>
                    ) : (
                    <>
                            {PLAT_UNIT_LESSONS.map((lessons, index) => (
                                <React.Fragment key={index}>
                                    <ScrollRow lessons={lessons} unitTitle={PLAT_UNIT_TITLES[index]} unitDescription={PLAT_UNIT_DESCRIPTIONS[index] } division='Platinum' userData={userData} allMetaData={allMetaData}/>
                                    <br />
                                </React.Fragment>
                            ))}
                    </>
                    )
                ) : (
                    <>
                        { testCases &&
                            <ProblemDescription 
                                userData={userData}
                                currentTab={activePathTab === 'usaco' ? usacoProblemData[usacoTabIndex] : cccProblemData[cccTabIndex]}
                                testCases={testCases}
                                displayCases={displayCases}
                                selectedTab={props.selectedTab}
                                setSelectedTab={props.setSelectedTab}
                                scrollLeft={scrollLeft}
                                scrollRight={scrollRight}
                            />
                        } 
                    </>
                )}
            </div>
        </div>
    );
};

export default Paths;
