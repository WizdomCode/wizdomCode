// questionID is a unique identifier (str) representing a question's title, used to fetch information on a specfic question within this file
// testCaseFolder is a string indicating the location of a problem's test cases
// these are decided by the search/filter system

// problem is an object containing { title, description, inputFormat, constraints, outputFormat, points }
// testCases is an array of objects, each containing a .key, .input, and .output

import styles from '../../styles/ProblemDescription.module.css';
import React, { useState, useEffect, useRef } from "react";
import { auth, app, db } from "../../../firebase.js";
import { collection, getDocs, addDoc, getDoc, doc, updateDoc, arrayUnion, setDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import "../../../Fonts.css";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "axios";
import Split from 'react-split'
import CodeEditor from '../Editor/Editor.jsx';
import '../../styles/Workspace.css';
import Sidebar from '../../Navigation/Sidebar.jsx';
import "../../styles/Paths.css";
import Paths from './Paths.jsx';
import Tab from './Tab.jsx';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from 'socket.io-client';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TablePagination from '@mui/material/TablePagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Leaderboard from '../../../pages/Leaderboard.jsx';
import UserProfile from '../../../pages/UserProfile.jsx';
import Login from '../../../pages/Login.jsx';
import SignUp from '../../../pages/SignUp.jsx';
import Achievements from '../../../pages/Achievements.jsx';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ProblemDescription from './ProblemDescription.jsx';
import Navigation from '../../Navigation/Navigation.jsx';
import { 
  useMantineTheme,
  ScrollArea,
  Container,
  Group,
  Button,
  Table
} from '@mantine/core';
import FileList from './FileList.jsx';
import { SideNav } from '../../Navigation/SideNav.jsx';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  IconNotebook,
  IconCircleDashedCheck,
  IconBook,
  IconCheck,
  IconFlask
} from '@tabler/icons-react'

const card = (
  <React.Fragment>
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/val.png"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Problem database
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Study from over 1 hand-picked problems on the ultimate platform for preparing for competitive programming contests.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  </React.Fragment>
);


const ariaLabel = { 'aria-label': 'description' };

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const marks = [
  {
    value: 1,
    label: '1',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 50,
    label: '50',
  },
];

function valuetext(value) {
  return `${value} Points`;
}

const IDE = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [value, setValue] = React.useState([1, 10]);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChangeMin = (event) => {
    setValue([event.target.value === '' ? 0 : Number(event.target.value), value[1]]);
  };

  const handleInputChangeMax = (event) => {
    setValue([value[0], event.target.value === '' ? 0 : Number(event.target.value)]);
  };

  const handleBlurring = () => {
    if (value[0] < 1) {
      setValue([1, value[1]]);
    } else if (value[1] > 50) {
      setValue([value[0], 50]);
    }
  };

  const dispatch = useDispatch();
  const tabs = useSelector(state => state.tabs);
  const currentTab = useSelector(state => state.currentTab);

  useEffect(() => {
  }, [currentTab]);

  const TOPICS = ["sorting", "searching", "syntax"];
  const CONTESTS = ["CCC", "USACO"];
  const CCC_DIVISIONS = ["Junior", "Senior"];
  const USACO_DIVISIONS = ["Bronze", "Silver", "Gold", "Platinum"];

  const [currentProblem, setCurrentProblem] = useState({}); // default problem
  const [currentDivision, setCurrentDivision] = useState(
    props.currentPage === "ccc" ? CCC_DIVISIONS[0] : USACO_DIVISIONS[0]
  );
  const [problems, setProblems] = useState([]); // default problems
  const [searchPoints, setSearchPoints] = useState("");
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState([]);
  const [contests, setContests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isFocused, setIsFocused] = useState({topics: false, contests: false, points: false});
  const [questionID, setQuestionID] = useState(null);
  const [testCaseFolder, setTestCaseFolder] = useState(null);
  const xdata = [];
  const [testCases, setTestCases] = useState([]);
  const [displayCases, setDisplayCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('question');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');

  const [results, setResults] = useState([]);
  const codeState = useSelector(state => state.codeState); 
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [currentCode, setCurrentCode] = useState("");
  const [solutions, setSolutions] = useState([]);
  const [questionName, setQuestionName] = useState();

  const [editorSize, setEditorSize] = useState();

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
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const handleFocus = (name) => {
    setIsFocused({...isFocused, [name]: true});
  };

  const handleBlur = (name) => {
    setIsFocused({...isFocused, [name]: false});
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  // Define your color constants
  const BACKGROUND_COLOR = '#fff'; // This is the color used for the background of the components
  const TEXT_COLOR = '#000'; // This is the color used for the text in the components
  const GRAY = '#ccc';
  const FOCUSED_COLOR = '#ccc'; // This is the color used for the background of a focused option

  const SELECT_STYLES = {
    // The 'control' key targets the control component (the box that the selected value or placeholder is displayed in)
    control: (provided, state) => ({
      ...provided, // Spread in provided styles to maintain other default styles
      backgroundColor: BACKGROUND_COLOR, // Set the background color to the constant defined above
      color: TEXT_COLOR, // Set the text color to the constant defined above
      borderRadius: '8px',
    }),
    
    // The 'menu' key targets the dropdown menu
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
      borderRadius: '8px',
    }),

    // The 'menuList' key targets the list of options in the dropdown menu
    menuList: (provided, state) => ({
      ...provided,
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
      borderRadius: '8px',
    }),

    // The 'option' key targets the options in the dropdown menu
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? FOCUSED_COLOR : BACKGROUND_COLOR, // Set the background color to a different color when an option is focused
      color: TEXT_COLOR,
    }),

    // The 'singleValue' key targets the single value displayed in the control when a single option is selected
    singleValue: (provided) => ({
      ...provided,
      color: TEXT_COLOR,
    }),

    // The 'multiValue' key targets the values displayed in the control when multiple options are selected
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: GRAY,
      color: TEXT_COLOR,
    }),

    // The 'multiValueLabel' key targets the label of the values displayed in the control when multiple options are selected
    multiValueLabel: (provided) => ({
      ...provided,
      backgroundColor: GRAY,
      color: TEXT_COLOR,
    }),

    // The 'multiValueRemove' key targets the remove icon of the values displayed in the control when multiple options are selected
    multiValueRemove: (provided) => ({
      ...provided,
      backgroundColor: GRAY,
      color: TEXT_COLOR,
    }),

    // The 'dropdownIndicator' key targets the dropdown indicator in the control
    dropdownIndicator: (provided) => ({
      ...provided,
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
      borderRadius: '8px',
    }),

    // The 'clearIndicator' key targets the clear indicator in the control
    clearIndicator: (provided) => ({
      ...provided,
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
    }),

    // The 'indicatorSeparator' key targets the separator between the selected value and the dropdown indicators
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
    }),

    // The 'placeholder' key targets the placeholder displayed in the control
    placeholder: (provided) => ({
      ...provided,
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
    }),

    // The 'input' key targets the input where the user types
    input: (provided) => ({
      ...provided,
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
      borderRadius: '8px',
    }),

    // The 'valueContainer' key targets the container that holds the value or placeholder
    valueContainer: (provided) => ({
      ...provided,
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
      borderRadius: '8px',
    }),

    // The 'indicatorsContainer' key targets the container that holds the dropdown indicators
    indicatorsContainer: (provided) => ({
      ...provided,
      backgroundColor: BACKGROUND_COLOR,
      borderRadius: '8px',
      color: TEXT_COLOR,
    }),

    noOptionsMessage: (provided, state) => ({
      ...provided,
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
    }),
  }; 
  
  const allMetaData = useSelector(state => state.allMetaData);

  useEffect(() => {
    if (allMetaData) setQuestions(Object.values(allMetaData));
  }, [allMetaData]);

  useEffect(() => {
      const docRef = doc(db, "ProblemMetadata", "AllData");
  
      const fetchData = async () => {
          try {
              const docSnap = await getDoc(docRef);
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

  useEffect(() => {
    let filtered = questions;

    filtered = filtered.filter((q) => q.points >= value[0] && q.points <= value[1]);

    if (search) {
      filtered = filtered.filter((q) => {
        if (q.title) {
          return q.title.toLowerCase().includes(search.toLowerCase());
        }
        return false; // return false if there's no title, so it doesn't get included in the filtered array
      });
    }    

    if (topics.length > 0) {
      filtered = filtered.filter((q) =>
        q.topics.some((t) => topics.includes(t))
      );
    }

    if (contests.length > 0) {
      filtered = filtered.filter((q) => contests.includes(q.contest));
    }

    setFilteredQuestions(filtered);
  }, [questions, value, search, topics, contests]);

  // Calculate the number of pages
  const noOfPages = Math.ceil(filteredQuestions.length / rowsPerPage);

  // Get the data for the current page
  const currentPageData = filteredQuestions.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // Modify the useEffect hook for fetching problem data
  useEffect(() => {
    const fetchProblemData = async () => {
      if (questionID) {
        try {
          const docRef = await getDoc(doc(db, "Questions", questionID));
          if (docRef.exists()) {
            const problemData = docRef.data();
            setQuestionName(problemData.title)
            setCurrentProblem(problemData);
            if (!problems.includes(problemData)) {
              setProblems(prevProblems => [...prevProblems, problemData]);
            }
            // Add the problem to the tabs
            dispatch({ type: 'ADD_TAB', payload: { type: 'problem', data: problemData } });
          } else {
          }
        } catch (error) {
        }
      }
    };
  
    fetchProblemData();
  }, [questionID, dispatch]);

  useEffect(() => {
    if (currentTab.data && currentTab.data.title) {
      const testCaseObj = {};
      const storage = getStorage();
      const listRef = ref(storage, `/TestCaseData/${currentTab.data.folder}`);
  
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

                displayCaseArray.push({ key: (i + 1) / 2, input: inputLines.join('\n'), output: outputLines.join('\n') });

                i += 2;
              }

              setTestCases(testCaseArray);
              setDisplayCases(displayCaseArray);
            })
            .catch((error) => {
            });
        })
        .catch((error) => {
        });
    }
  }, [currentTab]);  
  
  const boilerPlate = 
`#include <iostream>

int main() {
  std::cout << "Hello from C++!" << std::endl;
  return 0;
}`;

  const getResults = (data) => {
    setResults(data);
  };

  const getCode = (code, language) => {
  }

  const pollResults = async (requestId) => {
    try {
        const response = await fetch(`https://3702-147-124-72-82.ngrok-free.app/get_results/${requestId}`);
        if (response.ok && response.headers.get('Content-Type') === 'application/json') {
            const data = await response.json();
            setResults(data);
        } else if (response.ok && response.headers.get('Content-Type') === 'application/jsonl') {
            // If response is in JSONL format, read each line and parse JSON
            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim() !== ''); // Split lines and remove empty lines
            const results = lines.map(line => JSON.parse(line)); // Parse each line as JSON
            setResults(results);
        } else {
        }
    } catch (error) {
    }
};

const submitCode = async (tests = testCases, numTests = testCases.length) => {
    if (numTests !== 1) dispatch({ type: 'TOGGLE_RUNNING_ALL_CASES' });

    dispatch({ type: 'TOGGLE_GET_CODE_SIGNAL' });

    setCurrentCode(codeState.code);
    // Start the timer
    const startTime = performance.now();
  
    const response = await fetch(`${import.meta.env.VITE_APP_JUDGE_URL}execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language: codeState.language,
        code: codeState.code,
        test_cases: tests
      })
    });
  
    // End the timer and calculate the elapsed time
    const endTime = performance.now();
    const elapsedTime = endTime - startTime
  
    // Extract request_id from response
    const { request_id } = await response.json();
  
    // Continuously fetch data from Firestore until the condition is met
    let stopFetching = false;
    while (!stopFetching) {
      // Fetch data from Firestore using request_id
      const docRef = doc(db, "Results", request_id);
      const rdata = await getDoc(docRef);
      if (rdata.exists) {
        const ndata = rdata.data();
        
        console.log(ndata);
      
        // Check if results array exists in ndata
        if (ndata && ndata.results && Array.isArray(ndata.results)) {
          if (numTests === 1) {
            const results = new Array(ndata.results[0].key - 1).fill(null);
            results.push(ndata.results[0]);
            setResults(results);

            stopFetching = true;
            break;
          }

          setResults(ndata.results);
          
          console.log("ndata.results.length", ndata.results.length);
          console.log("numTests", numTests)
          if (ndata.results.length >= numTests) {
            if (numTests !== 1) dispatch({ type: 'TOGGLE_RUNNING_ALL_CASES' });
            stopFetching = true;
            break;
          }
        }
      
        if (!stopFetching) {
          // Delay before next fetch to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } else {
        break;
      }
    }
    // Once the condition is met, set results to the data received so far
      const docRef = doc(db, "Results", request_id);
      try {
        await deleteDoc(docRef);
      } catch (error) {
      }

  };
  




  useEffect(() => {
    // Define a function to update the user's document
    const updateUserSolvedQuestions = async (userUid, questionName, points, code, executionTime) => {
      try {
        // Get a reference to the user's document
        const userDocRef = doc(db, "Users", userUid);
        if (!questionDocSnapshot.exists() || !questionDocSnapshot.data().solutions) {
          await setDoc(questionDocRef, { solutions: [] }, { merge: true });
        }
  
        // Update the solutions array in the question document
        const solutionMap = {
          userId: userDocRef.username,
          solution: code,
          executionTime: executionTime
        };
        await updateDoc(questionDocRef, {
          solutions: arrayUnion(solutionMap)
        });
        
        // Check if the question is already solved by the user
        const userDocSnapshot = await getDoc(userDocRef);
        const solvedQuestions = userDocSnapshot.data().solved || [];
    
        if (!solvedQuestions.includes(questionName)) {
          // Update the user's document to add the solved question and increment points
          await updateDoc(userDocRef, {
            solved: arrayUnion(questionName), // Add the question name to the solved array
            points: points + (userDocSnapshot.data().points || 0), // Increment points
            coins: (points*10) + (userDocSnapshot.data().points || 0) // Increment coins
          });
    
          // Get a reference to the question document
          const questionDocRef = doc(db, "Questions", questionName);
    
          // Get the question document snapshot
          const questionDocSnapshot = await getDoc(questionDocRef);
          
          // Check if solutions array exists, if not, create it
    
    
          // Check and update daily challenge progress
          const challengeDocRef = doc(db, "Challenges", "Daily");
          const challengeDocSnapshot = await getDoc(challengeDocRef);
          const dailyChallenges = challengeDocSnapshot.data().dailyChallenges || [];
    
          dailyChallenges.forEach(async (challenge, index) => {
            if (challenge.users.includes(userUid)) {
              // User already solved this challenge, increment the score
              await updateDoc(challengeDocRef, {
                [`dailyChallenges.${index}.score`]: challenge.score + 1
              });
            } else {
              // User solved this challenge for the first time, add user and set score to 1
              await updateDoc(challengeDocRef, {
                [`dailyChallenges.${index}.users`]: arrayUnion(userUid),
                [`dailyChallenges.${index}.score`]: 1
              });
            }
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
              if (test && test.status.description !== 'Accepted') {
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
    if (problemPassed() && currentTab.data) {
      const questionName = currentTab.data.title; // Assuming the question name is stored in the `title` field of the tab data
      const pointsEarned = currentTab.data.points; // Assuming the points earned for solving the question are stored in the `points` field of the tab data
      const userUid = auth.currentUser.uid; // Get the current user's UID
  
      updateUserSolvedQuestions(userUid, questionName, pointsEarned, currentCode, executionTime);
    }
  }, [results, tabs, currentTab, db, auth]);

  const state = useSelector(state => state); // Access the state

  const [draggedTab, setDraggedTab] = useState(null); // New state for the dragged tab
  const [linePosition, setLinePosition] = useState({ index: null, position: null }); // New state for the line position
  const linePositionRef = useRef(linePosition); // New ref for the line position

  useEffect(() => {
    }, [state]); // Add state as a dependency to useEffect 

  useEffect(() => {
  }, [draggedTab]); // Add state as a dependency to useEffect
  
  useEffect(() => {
    linePositionRef.current = linePosition;
  }, [linePosition]); // Add state as a dependency to useEffect

    useEffect(() => {

      const handleDragOver = (e) => {
        e.preventDefault();
        const target = e.target;
        if (target && target.id && draggedTab !== null) {
          const draggedTabIndex = draggedTab;
          const targetTabIndex = target.id;

          const middlePoint = e.target.getBoundingClientRect().x + e.target.getBoundingClientRect().width / 2;
          const linePos = e.clientX < middlePoint ? 'left' : 'right';
    

          setLinePosition({ index: targetTabIndex, position: linePos});
        }
      };
  
      window.addEventListener('dragover', handleDragOver);
      window.addEventListener('dragend', dragEnd);
      return () => {
        window.removeEventListener('dragover', handleDragOver);
        window.removeEventListener('dragend', dragEnd);
      };
    }, [draggedTab]);  

  const dragEnd = (e) => {
    e.preventDefault();
    const linePos = linePositionRef.current;
    dispatch({
      type: 'MOVE_TAB',
      payload: {
        fromIndex: draggedTab,
        toIndex: Number(linePos.index), 
        direction: linePos.position  
      }
    });
    setDraggedTab(null);
    setLinePosition({ index: null, position: null });
  }

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        // Get a reference to the question document
        const questionDocRef = doc(db, "Questions", currentTab.data.title);
        const questionDocSnapshot = await getDoc(questionDocRef);

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
  }, [currentTab]);

  const theme = useMantineTheme();

  const isFileListOpen = useSelector(state => state.isFileListOpen);

  // Lesson tab handling
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

  function extractYear(text) {
    const regex = /\b\d{4}\b/;
    let match = text.match(regex);
    return match ? match[0] : null;
  }
  
  function extractLevel(text) {
    if (text.substring(0, 5) === 'USACO') {
      const fullLvl = text.split(', ')[1];
      return fullLvl.substring(0, fullLvl.length - 9) + 'P' + fullLvl.substring(fullLvl.length - 1);
    } else {
      const fullLvls = text.split(', ').slice(1);
      let fullstr = '';
      for (let lvl of fullLvls) {
        fullstr += lvl[0] + lvl[lvl.length - 1] + ', ';
      } 
      return fullstr.substring(0, fullstr.length - 2);
    }
  }

  return (
    <>
      <Navigation />
      <div style={{ display: 'flex', direction: 'row', height: 'calc(100vh - 50px)', width: '100vw' }}>
      <SideNav />
      <PanelGroup direction="horizontal" style={{ overflow: 'auto' }}>
      <Panel defaultSize={35} minSize={14} collapsible={true} collapsedSize={0}>
      <div className={styles.row} style={{ backgroundColor: 'var(--site-bg)' }}>
        <div className={styles.problemStatement} style={{ borderRight: '1px solid var(--border)' }}>
          <ScrollArea scrollbars="x" scrollHideDelay={0} className={styles.scrollableContent} style={{ height: '58.848px' }} styles={{
            scrollbar: { background: 'transparent', backgroundColor: 'transparent', height: '7px', opacity: '1' },
            thumb: { backgroundColor: 'var(--selected-item)', borderRadius: '0' }
          }}>
            { props.currentPage === 'problems' ? ( 
              <>
                <div className={styles.tabWrapper}>
                  <div 
                    className={styles.buttonRow}
                    onDragOver={(e) => e.preventDefault()} // Add this line
                    style={{ backgroundColor: 'var(--site-bg)' }}
                  >
                    {tabs.map((tab, index) => (
                      <>
                        {linePosition.index === index.toString() && linePosition.position === 'left' && <div className={styles.line} />}
                        <Tab
                          key={index}
                          index={index}
                          tab={tab}
                          isActive={currentTab === tab}
                          setDraggedTab={setDraggedTab}
                        />
                        {linePosition.index === index.toString() && linePosition.position === 'right' && <div className={styles.line} />}
                      </>
                    ))}
                    <button className={styles.newTab} onClick={() => dispatch({ type: 'ADD_TAB', payload: { type: 'newTab', data: null } })}>
                      <img src='/add.png' alt="New tab" style={{minWidth: '10px', minHeight: '10px', background: 'transparent'}}/>
                    </button>
                    <div className={styles.rightAlign}>
                    </div>
                  </div>
                </div>
              </>
              ) : (
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
              )}
          </ScrollArea>
          { props.currentPage === 'problems' && currentTab.type === 'problem' &&
            <Group gap={0} bg={'var(--code-bg)'} mt={6}>
              <Button style={{ color: selectedTab === 'question' ? 'white' : 'var(--dim-text)' }} size="compact-md" variant="subtle" leftSection={<IconNotebook style={{ marginRight: '-8' }}/>} onClick={() => setSelectedTab('question')}>Description</Button>
              <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--selected-item)' }} />
              <Button style={{ color: selectedTab === 'tests' ? 'white' : 'var(--dim-text)' }} size="compact-md" variant="subtle" leftSection={<IconFlask style={{ marginRight: '-8' }}/>} onClick={() => setSelectedTab('tests')}>Test cases</Button>
              <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--selected-item)' }} />
              <Button style={{ color: selectedTab === 'solution' ? 'white' : 'var(--dim-text)' }} size="compact-md" variant="subtle" leftSection={<IconCircleDashedCheck style={{ marginRight: '-8' }}/>} onClick={() => setSelectedTab('solution')}>Solution</Button>
              <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--selected-item)' }} />
              <Button style={{ color: selectedTab === 'editorial' ? 'white' : 'var(--dim-text)' }} size="compact-md" variant="subtle" leftSection={<IconBook style={{ marginRight: '-8' }}/>} onClick={() => setSelectedTab('editorial')}>Editorial</Button>
            </Group>
          }
          <ScrollArea scrollHideDelay={0} className={styles.scrollableContent} styles={{
            scrollbar: { background: 'transparent', backgroundColor: 'transparent', width: '15px', opacity: '1' },
            thumb: { backgroundColor: 'var(--selected-item)', borderRadius: '0' }
          }}>
            { props.currentPage === 'ccc' || props.currentPage === 'usaco' ? (
              <>
                <Paths currentTab={currentTab.data} currentPage={props.currentPage}/>
              </>
            ) : currentTab.type === 'problem' ? (
                <ProblemDescription userData={userData} currentTab={currentTab} submitCode={submitCode} testCases={testCases} displayCases={displayCases} results={results} solutions={solutions} selectedTab={selectedTab}/>
            ) : currentTab.type === 'newTab' ? (
              <Container>
                <div className='hero'> 
                  <div className={styles.description}>
                    <h2 className="title">Problems</h2>
                    <div className="search-rect">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%', m: 1 }}>
                          <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }}/>
                          <Input fullWidth placeholder="Search problems..." inputProps={ariaLabel} sx={{ color: 'black', width: '100%' }} style={{ color: 'black' }} theme={lightTheme} value={search} onChange={(e) => setSearch(e.target.value)}/>
                        </Box>
                    </div>
                    <div className="subsearch-row">
                      <div className="search-container">
                        <div className="column1">
                          <div style={{position: 'relative'}}>
                            <Select 
                              placeholder="Topics..."
                              styles={SELECT_STYLES}
                              options={TOPICS.map(opt => ({ label: opt, value: opt }))}
                              isMulti
                              onChange={(selected) => setTopics(selected.map((s) => s.value))}
                              onFocus={() => handleFocus('topics')}
                              onBlur={() => handleBlur('topics')}
                            />
                            {!topics.length && !isFocused.topics && <div className="dropdown-placeholder">Topic</div>}
                          </div>
                          <div style={{position: 'relative'}}>
                            <Select 
                              styles={SELECT_STYLES}
                              options={CONTESTS.map(opt => ({ label: opt, value: opt }))}
                              isMulti
                              onChange={(selected) => setContests(selected.map((s) => s.value))}
                              placeholder="Contests..."
                              onFocus={() => handleFocus('contests')}
                              onBlur={() => handleBlur('contests')}
                            />
                            {!contests.length && !isFocused.contests && <div className="dropdown-placeholder">Contest</div>}
                          </div>
                        </div>
                        <div className="column2">
                          <ThemeProvider theme={darkTheme}>
                            <Box sx={{ width: 350, ml: 2 }}>
                              <Typography id="input-slider" gutterBottom>
                                Points Range
                              </Typography>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs>
                                  <Slider
                                    value={value}
                                    onChange={handleSliderChange}
                                    aria-labelledby="input-slider"
                                    min={1}
                                    max={50}
                                    marks={marks}
                                  />
                                </Grid>
                                <Grid item style={{ marginTop: '-25px' }}>
                                  <Input
                                    value={value[0]}
                                    size="small"
                                    onChange={handleInputChangeMin}
                                    onBlur={handleBlurring}
                                    inputProps={{
                                      step: 1,
                                      min: 1,
                                      max: 50,
                                      type: 'number',
                                      'aria-labelledby': 'input-slider',
                                    }}
                                  />
                                </Grid>
                                <Grid item style={{ marginTop: '-25px' }}>
                                  <Input
                                    value={value[1]}
                                    size="small"
                                    onChange={handleInputChangeMax}
                                    onBlur={handleBlurring}
                                    inputProps={{
                                      step: 1,
                                      min: 1,
                                      max: 50,
                                      type: 'number',
                                      'aria-labelledby': 'input-slider',
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </ThemeProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="question-list">
                  <div className="wrapper">
                    <div className="question-list-rect">
                      <Table>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Contest</Table.Th>
                            <Table.Th>Level</Table.Th>
                            <Table.Th>Title</Table.Th>
                            <Table.Th>Year</Table.Th>
                            <Table.Th>Points</Table.Th>
                            <Table.Th>Topics</Table.Th>
                            <Table.Th><IconCheck /></Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          { currentPageData && 
                            currentPageData.map((problem) => (
                              <Table.Tr key={problem.title}>
                                <Table.Td>{problem.contest}</Table.Td>
                                <Table.Td>{extractLevel(problem.specificContest)}</Table.Td>
                                <Table.Td>
                                  <Link 
                                    onClick={() => {
                                      setQuestionID(problem.title);
                                      setTestCaseFolder(problem.folder);
                                      window.scrollTo(0, 0); // This will scroll the page to the top
                                    }}
                                  >
                                    {problem.title}
                                  </Link>
                                </Table.Td>
                                <Table.Td>{extractYear(problem.specificContest)}</Table.Td>
                                <Table.Td>{problem.points}</Table.Td>
                                <Table.Td>{problem.topics.join(", ")}</Table.Td>
                                { userData && userData.solved ? <Table.Td>{userData.solved.includes(problem.id) ? "yes" : "no"}</Table.Td> : <Table.Td>no</Table.Td> }
                              </Table.Tr>
                            ))
                          }
                        </Table.Tbody>
                      </Table>
                    </div>
                  </div>
                </div>
                <div className='pagination'>
                  <ThemeProvider theme={darkTheme}>
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
                <br />
              </Container>
            ) : (
              <div className={styles.wrapper}>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
      </Panel>
      <PanelResizeHandle className={styles.panelResizeHandle} />
      <Panel defaultSize={65} minSize={14} collapsible={true} collapsedSize={0} style={{display: 'grid', gridTemplateColumns: isFileListOpen ? '1fr 3fr' : '1fr' }}>
        { isFileListOpen && <FileList />}
        <CodeEditor boilerPlate={boilerPlate} testCases={testCases} getResults={getResults} getCode={getCode}/>
      </Panel>
      </PanelGroup>
      </div>
    </>
  );
};

export default IDE;
