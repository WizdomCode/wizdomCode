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
  const [readCount, setReadCount] = useState(0);
  
  useEffect(() => {
    console.log("IDE reads:", readCount);
  }, [readCount]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [value, setValue] = React.useState([1, 20]);

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

  const TOPICS = [
    "ad hoc",
    "advanced dynamic programming",
    "advanced tree techniques",
    "arithmetic",
    "arrays",
    "bfs",
    "binary search",
    "combinatorics",
    "complete search",
    "computational geometry",
    "conditions",
    "custom comparators",
    "data structures",
    "depth-first search",
    "dfs",
    "dynamic programming",
    "euler tour",
    "flood fill",
    "geometry",
    "graph theory",
    "greedy",
    "hashing",
    "implementation",
    "loops",
    "math",
    "matrix exponentation",
    "minimum spanning tree",
    "nested loops",
    "point update range sum",
    "prefix sum",
    "recursion",
    "rectangle geometry",
    "search",
    "searching",
    "segment tree",
    "shortest path",
    "simple math",
    "simulation",
    "sorting",
    "strings",
    "syntax",
    "time complexity",
    "topological sort",
    "trees",
    "two pointers",
    "union find"
  ];
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

  const codeState = useSelector(state => state.codeState); 
  const userData = useSelector(state => state.userInfo);
  const [userId, setUserId] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [currentCode, setCurrentCode] = useState("");
  const [questionName, setQuestionName] = useState();

  const [editorSize, setEditorSize] = useState();

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
          setReadCount(prevReadCount => prevReadCount + 1);

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
  }, [questionID]);

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
                
                inputLines = inputLines.map(line => line.length > 60 ? line.substring(0, 60) + '...' : line);
                outputLines = outputLines.map(line => line.length > 60 ? line.substring(0, 60) + '...' : line);
  
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
  
  const cccTabIndex = useSelector(state => state.cccTabIndex);
  const usacoTabIndex = useSelector(state => state.usacoTabIndex);

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

  const [isLessonProblemActive, setIsLessonProblemActive] = useState(false);

  return (
    <>
      <Navigation />
      <div style={{ display: 'flex', direction: 'row', height: 'calc(100vh - 50px)', width: '100vw' }}>
      <SideNav />
      <PanelGroup direction="horizontal" style={{ overflow: 'auto' }}>
      <Panel defaultSize={35} minSize={24} collapsible={true} collapsedSize={0}>
      <div className={styles.row} style={{ backgroundColor: 'var(--site-bg)' }}>
        <div className={styles.problemStatement} style={{ borderRight: '1px solid var(--border)' }}>
          <div style={{ width: '100%' }}>
          <ScrollArea scrollbars="x" scrollHideDelay={0} style={{ width: '100%' }} styles={{
            scrollbar: { background: 'transparent', backgroundColor: 'transparent', height: '7px', opacity: '1' },
            thumb: { backgroundColor: 'var(--selected-item)', borderRadius: '0' }
          }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderBottom: '1px solid var(--border)' }} onDragOver={(e) => e.preventDefault()}>
            { props.currentPage === 'problems' ? ( 
              <>
                {tabs.map((tab, index) => (
                  <>
                    {linePosition.index === index.toString() && linePosition.position === 'left' && <div className={styles.line} />}
                    <Tab
                      key={index}
                      index={index}
                      tab={tab}
                      isActive={currentTab === tab}
                      setDraggedTab={setDraggedTab}
                      setQuestionID={setQuestionID}
                    />
                    {linePosition.index === index.toString() && linePosition.position === 'right' && <div className={styles.line} />}
                  </>
                ))}
                <button className={styles.newTab} onClick={() => dispatch({ type: 'ADD_TAB', payload: { type: 'newTab', data: null } })}>
                  <img src='/add.png' alt="New tab" style={{minWidth: '10px', minHeight: '10px', background: 'transparent'}}/>
                </button>
                <div className={styles.rightAlign}>
                </div>
              </>
              ) : (
                defaultTabs.map((tab, index) => (
                    <Tab
                        key={index}
                        index={index}
                        tab={tab}
                        isActive={(props.currentPage === 'usaco' ? usacoTabIndex : cccTabIndex) === index}
                        currentPage={props.currentPage}
                        type='lesson'
                    />
                ))
              )}
            </div>
          </ScrollArea>
          </div>
          { ((props.currentPage === 'problems' && currentTab.type === 'problem') || (isLessonProblemActive)) &&
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
                <Paths currentTab={currentTab.data} currentPage={props.currentPage} selectedTab={selectedTab} setSelectedTab={setSelectedTab} setIsLessonProblemActive={setIsLessonProblemActive}/>
              </>
            ) : currentTab.type === 'problem' ? (
                <ProblemDescription userData={userData} currentTab={currentTab} testCases={testCases} displayCases={displayCases} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
            ) : currentTab.type === 'newTab' ? (
              <Container>
                <Container my={24} mt={34}> 
                  <div className={styles.description}>
                    <h2 className="title">Problems</h2>
                    <div className="search-rect">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%', m: 1 }}>
                          <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }}/>
                          <Input fullWidth placeholder="Search problems..." inputProps={ariaLabel} sx={{ color: 'black', width: '100%' }} style={{ color: 'black' }} theme={lightTheme} value={search} onChange={(e) => setSearch(e.target.value)}/>
                        </Box>
                    </div>
                    <Group>
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
                          <Box sx={{ minWidth: 250, ml: 2 }}>
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
                    </Group>
                  </div>
                </Container>
                <div className="question-list">
                  <div className="wrapper">
                    <ScrollArea>
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
                                { userData && userData.solved ? <Table.Td>{userData.solved.includes(problem.title) ? "yes" : "no"}</Table.Td> : <Table.Td>no</Table.Td> }
                              </Table.Tr>
                            ))
                          }
                        </Table.Tbody>
                      </Table>
                    </ScrollArea>
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
        <CodeEditor boilerPlate={boilerPlate} testCases={testCases} />
      </Panel>
      </PanelGroup>
      </div>
    </>
  );
};

export default IDE;
