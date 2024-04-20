// questionID is a unique identifier (str) representing a question's title, used to fetch information on a specfic question within this file
// testCaseFolder is a string indicating the location of a problem's test cases
// these are decided by the search/filter system

// problem is an object containing { title, description, inputFormat, constraints, outputFormat, points }
// testCases is an array of objects, each containing a .key, .input, and .output

import styles from '../../styles/ProblemDescription.module.css';
import React, { useState, useEffect, useRef } from "react";
import { auth, app, db } from "../../../firebase.js";
import { collection, getDocs, addDoc, getDoc, doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import "../../../Fonts.css";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "axios";
import Split from 'react-split'
import CodeEditor from '../Editor/Editor.jsx';
import '../../styles/Workspace.css';
import Sidebar from '../../Navigation/Sidebar.js';
import "../../styles/Paths.css";
import Paths from './Paths.jsx';
import Tab from './Tab.jsx';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import remarkGfm from 'remark-gfm';
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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';

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
    console.log("Current tab:", currentTab);
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

  const [testCases, setTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');

  const [results, setResults] = useState([]);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState("cpp");
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
          if (userSnapshot.exists()) {
            // Extract required user information from the snapshot
            const userData = userSnapshot.data();
            setUserData(userData); // Set the user data in the state
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts
  console.log("Current page:", props.currentPage);

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

    filtered = filtered.filter((q) => q.points >= value[0] && q.points <= value[1]);

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
            setCurrentProblem(problemData);
            if (!problems.includes(problemData)) {
              setProblems(prevProblems => [...prevProblems, problemData]);
            }
            // Add the problem to the tabs
            dispatch({ type: 'ADD_TAB', payload: { type: 'problem', data: problemData } });
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
        }
      }
    };
  
    fetchProblemData();
  }, [questionID, dispatch]);

  useEffect(() => {
    if (currentTab.data && currentTab.data.testCases) {
      setTestCases(currentTab.data.testCases);
    }
  }, [currentTab]);
  
  const boilerPlate = 
`#include <iostream>

int main() {
  std::cout << "Hello from C++!" << std::endl;
  return 0;
}`;

  const getResults = (data) => {
    console.log("Received code output in parent component:", data);
    setResults(data);
  };

  const getCode = (code, language) => {
    console.log("Received code output in parent component:", code);
    setCode(code);
    setLanguage(language);
  }

  const submitCode = async () => {
    console.log("sent data:", JSON.stringify({
      language: language,
      code: code,
      test_cases: testCases
    }));

    try {
        const response = await fetch('https://2a42-99-208-67-206.ngrok-free.app/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            language: language,
            code: code,
            test_cases: testCases
          })
        });

        if (response.ok && response.headers.get('Content-Type') === 'application/json') {
          const data = await response.json();
          const requestId = data.request_id;

          // Poll the server for results
          const getResult = async () => {
            const response = await fetch(`https://2a42-99-208-67-206.ngrok-free.app/results/${requestId}.txt`);
            if (response.ok) {
              const data = await response.json();
              setResults(data);
            } else if (response.status === 404) {
              setTimeout(getResult, 1000); // Try again in 1 second
            } else {
              console.error('Error:', response.status, response.statusText);
              // Log the error
              console.error('Response:', await response.text());
            }
          };

          getResult();
        } else {
          console.error('Error:', response.status, response.statusText);
          // Log the error
          console.error('Response:', await response.text());
        }
    } catch (error) {
        console.error('Error:', error);
        // Log the error
    }
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

    console.log("currentTabData", currentTab);
  
    // If the problem is solved, update the user's document
    if (problemPassed() && currentTab.data) {
      const questionName = currentTab.data.title; // Assuming the question name is stored in the `title` field of the tab data
      const pointsEarned = currentTab.data.points; // Assuming the points earned for solving the question are stored in the `points` field of the tab data
      const userUid = auth.currentUser.uid; // Get the current user's UID
  
      updateUserSolvedQuestions(userUid, questionName, pointsEarned);
    }
  }, [results, tabs, currentTab, db, auth]);

  const languages = {
    "cpp": 54, // C++ (GCC 9.2.0)
    "python": 71, // Python (3.8.1)
    "java": 62, // Java (OpenJDK 13.0.1)
  };  

  const runAllTests = async () => {

    // Start the timer
    const startTime = performance.now();

    let results = [];
    for (let testCase of testCases) {
      // Prepare the data for the Judge0 API
      const data = {
        source_code: code,
        language_id: languages[language],
        stdin: testCase.input, // Convert input to an array
        expected_output: testCase.output,
        cpu_time_limit: 2, // CPU time limit in seconds
        cpu_extra_time: 0.5, // Extra time in seconds
        memory_limit: 128000, // Memory limit in kilobytes
        stack_limit: 64000, // Stack limit in kilobytes
        max_processes_and_or_threads: 30, // Maximum number of processes and/or threads
        enable_per_process_and_thread_time_limit: false,
        enable_per_process_and_thread_memory_limit: false,
        max_file_size: 1024 // Maximum file size in kilobytes
      };

      console.log(JSON.stringify(data));

      // Make a POST request to the Judge0 API
      const response = await fetch('http://localhost:2358/submissions/?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      // Parse the response
      const result = await response.json();

      console.log(result);
      console.log('Standard Output:', result['stdout']);
      console.log('Error Messages:', result.stderr || result.message);

      results.push(result);
    }
    console.log(results);
    setResults(results);

    // End the timer and calculate the elapsed time
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(`Execution time: ${elapsedTime} milliseconds`);
  };

  const runConcurrentTests = async () => {
    // Start the timer
    const startTime = performance.now();
  
    // Prepare the data for the Judge0 API
    const dataTemplate = {
      source_code: code,
      language_id: languages[language],
      cpu_time_limit: 2, // CPU time limit in seconds
      cpu_extra_time: 0.5, // Extra time in seconds
      memory_limit: 128000, // Memory limit in kilobytes
      stack_limit: 64000, // Stack limit in kilobytes
      max_processes_and_or_threads: 30, // Maximum number of processes and/or threads
      enable_per_process_and_thread_time_limit: false,
      enable_per_process_and_thread_memory_limit: false,
      max_file_size: 1024 // Maximum file size in kilobytes
    };
  
    // Make a POST request to the Judge0 API
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const results = await Promise.all(testCases.map(async testCase => {
      const data = { ...dataTemplate, stdin: testCase.input, expected_output: testCase.output };
      fetchOptions.body = JSON.stringify(data);
  
      const response = await fetch('http://localhost:2358/submissions/?base64_encoded=false&wait=true', fetchOptions);
      return response.json();
    }));
  
    setResults(results);
  
    // End the timer and calculate the elapsed time
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(`Execution time: ${elapsedTime} milliseconds`);
  };  
  
  const runBatchCases = async () => {
    // Start the timer
    const startTime = performance.now();
  
    let submissions = [];
  
    for (let testCase of testCases) {
      // Prepare the data for the Judge0 API
      const data = {
        source_code: code,
        language_id: languages[language],
        stdin: testCase.input, // Convert input to an array
        expected_output: testCase.output,
        cpu_time_limit: 2, // CPU time limit in seconds
        cpu_extra_time: 0.5, // Extra time in seconds
        memory_limit: 128000, // Memory limit in kilobytes
        stack_limit: 64000, // Stack limit in kilobytes
        max_processes_and_or_threads: 30, // Maximum number of processes and/or threads
        enable_per_process_and_thread_time_limit: false,
        enable_per_process_and_thread_memory_limit: false,
        max_file_size: 1024 // Maximum file size in kilobytes
      };
  
      submissions.push(data);
    }
  
    console.log(submissions);
  
    // Make a POST request to the Judge0 API
    const response = await fetch('http://localhost:2358/submissions/batch?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ submissions: submissions })
    });
  
    // Parse the response
    const results = await response.json();
  
    // Extract tokens from the response
    const tokens = results.map(result => result.token).join(',');
  
    let getResults;
    do {
      // Make a GET request to the Judge0 API with the tokens
      const getResponse = await fetch(`http://localhost:2358/submissions/batch?tokens=${tokens}&base64_encoded=false&fields=token,stdout,stderr,status,language_id`);
  
      // Parse the GET response
      getResults = await getResponse.json();
  
      // If the last submission is still in queue or processing, wait for a second before the next request
      if (getResults.submissions[getResults.submissions.length - 1].status.description === 'In Queue' || getResults.submissions[getResults.submissions.length - 1].status.description === 'Processing') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } while (getResults.submissions[getResults.submissions.length - 1].status.description === 'In Queue' || getResults.submissions[getResults.submissions.length - 1].status.description === 'Processing');
  
    setResults(getResults.submissions);
    console.log("Server response:", getResults.submissions);
  
    // End the timer and calculate the elapsed time
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(`Execution time: ${elapsedTime} milliseconds`);
  };  

  const state = useSelector(state => state); // Access the state

  const [draggedTab, setDraggedTab] = useState(null); // New state for the dragged tab
  const [linePosition, setLinePosition] = useState({ index: null, position: null }); // New state for the line position
  const linePositionRef = useRef(linePosition); // New ref for the line position

  useEffect(() => {
    console.log("State after dispatch:", state); // Log the state after dispatch
    }, [state]); // Add state as a dependency to useEffect 

  useEffect(() => {
    console.log("draggedTab: ", draggedTab); // Log the state after dispatch
  }, [draggedTab]); // Add state as a dependency to useEffect
  
  useEffect(() => {
    console.log("JUST WHAT IS CHANGING THIS? ", linePosition); // Log the state after dispatch
    linePositionRef.current = linePosition;
  }, [linePosition]); // Add state as a dependency to useEffect

    useEffect(() => {
      console.log("dragged tab:", draggedTab);

      const handleDragOver = (e) => {
        e.preventDefault();
        const target = e.target;
        if (target && target.id && draggedTab !== null) {
          const draggedTabIndex = draggedTab;
          const targetTabIndex = target.id;
          console.log("draggedTabIndex", draggedTabIndex);
          console.log("target", target);
          console.log("target.id", target.id);
          console.log("targetTabIndex", targetTabIndex);

          const middlePoint = e.target.getBoundingClientRect().x + e.target.getBoundingClientRect().width / 2;
          const linePos = e.clientX < middlePoint ? 'left' : 'right';
      
          console.log({ index: targetTabIndex, position: linePos});

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
    console.log("DIPATCHEIOHFJIIO");
    const linePos = linePositionRef.current;
    console.log({
      fromIndex: draggedTab,
      toIndex: linePos.index, 
      direction: linePos.position
    });
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

  function customParser(text) {
    // This is just an example. Replace it with your own logic.
    const newText = text.replace(/`(.*?)`/g, `<span class="${styles.customLatex}">$1</span>`);
    return newText;
  }
    
  return (
    <Split
        className="split"
        style={{ display: 'flex', flexDirection: 'row' }}
        minSize={500}
    >
    <div id="split-0">
    <div className={styles.row}>
      <Sidebar />
      <div className={styles.problemStatement}>
        <div className={styles.scrollableContent}>
          { props.currentPage === 'problems' && ( 
            <div className={styles.tabWrapper}>
              <div 
                className={styles.buttonRow}
                onDragOver={(e) => e.preventDefault()} // Add this line
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
            )}
          { props.currentPage === 'ccc' || props.currentPage === 'usaco' ? (
            <>
              <Paths currentTab={currentTab.data} currentPage={props.currentPage}/>
            </>
          ) : props.currentPage === 'leaderboard' ? (
            <>
              <Leaderboard />
            </>
          ) : props.currentPage === 'home' ? (
            <div className='universal'>
              <div className={styles.wrapper}>
                <div className='hero'>
                  <div>
                    <br />
                    <h1>Learn competitive programming.</h1>
                    <h1>Master any contest.</h1>
                    <br />
                    <p className={styles.customLatex}>Notice: This is a conceptual version. This project is very early in development and we welcome any and all feedback or suggestions. Contact us: competitive.programming2197@gmail.com</p>
                    <br />
                    <Link to="/signup" className={styles.img}>
                      <button className={styles.runAll} style={{color: 'white'}}>Get started</button>
                    </Link>
                    <br /> 
                  </div>
                </div>
                <br /> 
                <ThemeProvider theme={darkTheme}>
                  <Box sx={{ width: '100%' }}>
                    <Card variant="outlined">
                      <CardMedia
                        sx={{ height: 140 }}
                        image="/problems.png"
                        title="green iguana"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Problem database
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Study from 10+ hand-picked problems on the ultimate platform for preparing for competitive programming contests.
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Link to="/problems" className={styles.img}>
                          <Button size="small">Get Started</Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Box>
                  <br />
                  <Box sx={{ width: '100%' }}>
                    <Card variant="outlined">
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/duopaths.png"
                        title="green iguana"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Learning paths
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Waste no time learning topics in a logical progression.
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Link to="/ccc" className={styles.img}>
                          <Button size="small">CCC Topics</Button>
                        </Link>
                        <Link to="/usaco" className={styles.img}>
                          <Button size="small">USACO Topics</Button>
                        </Link>
                      </CardActions>
                    </Card>
                  </Box>
                  <br />
                  <Box sx={{ width: '100%' }}>
                    <Card variant="outlined">
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/workspace.png"
                        title="green iguana"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Feature-rich workspace
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Instantly test code against official problem data or custom inputs.
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Learn More</Button>
                      </CardActions>
                    </Card>
                  </Box>
                  <br />
                  <Box sx={{ width: '100%' }}>
                    <Card variant="outlined">
                    <CardMedia
                        sx={{ height: 140 }}
                        image="/templates.png"
                        title="green iguana"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Code Templates
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Waste no time crafting solutions with our extensive collection of code templates.
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Learn More</Button>
                      </CardActions>
                    </Card>
                  </Box>
                </ThemeProvider>
                <br />
                <br />
                <h1>Start from a contest</h1>
                <br />
                <Link to="/ccc" className={styles.img}>
                  <button className={styles.runAll} style={{color: 'white'}}>CCC</button>
                </Link>
                <br />
                <Link to="/usaco" className={styles.img}>
                  <button className={styles.runAll} style={{color: 'white'}}>USACO</button>
                </Link>
                <br />
              </div>
            </div>
          ) : props.currentPage === 'profile' ? (
            <>
              <UserProfile />
            </>          
          ) : props.currentPage === 'login' ? (
            <>
              <Login />
            </>          
          ) : props.currentPage === 'signup' ? (
            <>
              <SignUp />
            </>          
          ) : currentTab.type === 'problem' ? (
            <>
              <div className={styles.wrapper}>
                <br />
                <h1 className={styles.title}>{currentTab.data.title}</h1>
                <br />
                <div className={styles.description}>
                  {currentTab.data.description && (
                    <>
                      {currentTab.data.specificContest && <h3>{currentTab.data.specificContest}</h3>}
                      <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.description.replace(/\\n/g, '\n'))} />
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {currentTab.data.inputFormat && (
                    <>
                      <h3>Input Format</h3>
                      <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.inputFormat.replace(/\\n/g, '\n'))} />
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {false && currentTab.data.constraints && (
                    <>
                      <h3>Constraints</h3>
                      <ul>
                        {Object.entries(currentTab.data.constraints).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong> {value}
                          </li>
                        ))}
                      </ul>
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {currentTab.data.outputFormat && (
                    <>
                      <h3>Output Format</h3>
                      <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.outputFormat.replace(/\\n/g, '\n'))} />
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {currentTab.data.sample1 && currentTab.data.sample1.input && (
                    <>
                      <h3>Sample Input 1</h3>
                      <pre className={styles.codeSnippet}>{currentTab.data.sample1.input.replace(/\\n/g, '\n')}</pre>
                      <br />
                      <h3>Output for Sample Input 1</h3>
                      <pre className={styles.codeSnippet}>{currentTab.data.sample1.output.replace(/\\n/g, '\n')}</pre>
                      <br />
                      <h3>Explanation for Sample 1</h3>
                      {currentTab.data.sample1.explanation && <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.sample1.explanation.replace(/\\n/g, '\n'))} />}
                      <br />
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {currentTab.data.sample2 && currentTab.data.sample2.input && (
                    <>
                      <h3>Sample Input 2</h3>
                      <pre className={styles.codeSnippet}>{currentTab.data.sample2.input.replace(/\\n/g, '\n')}</pre>
                      <br />
                      <h3>Output for Sample Input 2</h3>
                      <pre className={styles.codeSnippet}>{currentTab.data.sample2.output.replace(/\\n/g, '\n')}</pre>
                      <br />
                      <h3>Explanation for Sample 2</h3>
                      {currentTab.data.sample2.explanation && <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.sample2.explanation.replace(/\\n/g, '\n'))} />}
                      <br />
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {currentTab.data.sample3 && currentTab.data.sample3.input && (
                    <>
                      <h3>Sample Input 3</h3>
                      <pre className={styles.codeSnippet}>{currentTab.data.sample3.input.replace(/\\n/g, '\n')}</pre>
                      <br />
                      <h3>Output for Sample Input 3</h3>
                      <pre className={styles.codeSnippet}>{currentTab.data.sample3.output.replace(/\\n/g, '\n')}</pre>
                      <br />
                      <h3>Explanation for Sample 3</h3>
                      {currentTab.data.sample3.explanation && <ReactMarkdown className={styles.descriptionText} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.sample3.explanation.replace(/\\n/g, '\n'))} />}
                      <br />
                      <div className={styles.divider}></div>
                      <br />
                    </>
                  )}
                  {currentTab.data.points && (
                    <>
                      <h3>Points</h3>
                      <p>{currentTab.data.points}</p>
                    </>
                  )}
                </div>
                <br />
                <br />
                <button className={styles.runAll} onClick={submitCode} style={{color: 'white'}}>Run All Tests (Ctrl + Enter)</button>
                <br />
                <div className={styles.testCases}>
                  {currentTab.data.testCases ? currentTab.data.testCases.map((testCase, index) => {
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
                  }): (
                    <div>
                      <h2>Test cases for this problem are coming soon!</h2>
                      <br />
                    </div>
                  )}
                </div>
              </div> 
            </>
          ) : currentTab.type === 'newTab' ? (
            <div className={styles.wrapper}>
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
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Points</th>
                            <th>Topics</th>
                            <th>Contest</th>
                            <th>Solved</th>
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
                                { userData && userData.solved ? <td>{userData.solved.includes(q.id) ? "yes" : "no"}</td> : <td>no</td> }
                              <td>
                                <button
                                  type="button"
                                  className='open-question'
                                  onClick={() => {
                                    setQuestionID(q.title);
                                    setTestCaseFolder(q.folder);
                                    window.scrollTo(0, 0); // This will scroll the page to the top
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
            </div>
          ) : (
            <div className={styles.wrapper}>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    <div id="split-1">
        <CodeEditor boilerPlate={boilerPlate} testCases={testCases} getResults={getResults} getCode={getCode}/>
    </div>
    </Split>
  );
};

export default IDE;
