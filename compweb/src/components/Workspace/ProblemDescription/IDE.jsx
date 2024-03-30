// questionID is a unique identifier (str) representing a question's title, used to fetch information on a specfic question within this file
// testCaseFolder is a string indicating the location of a problem's test cases
// these are decided by the search/filter system

// problem is an object containing { title, description, inputFormat, constraints, outputFormat, points }
// testCases is an array of objects, each containing a .key, .input, and .output

import styles from '../../styles/ProblemDescription.module.css';
import React, { useState, useEffect, useRef } from "react";
import { auth, app, db } from "../../../firebase.js";
import { collection, getDocs, addDoc, getDoc, doc } from "firebase/firestore";
import "../../../Fonts.css";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "axios";
import Split from 'react-split'
import CodeEditor from '../Editor/Editor.jsx';
import '../../styles/Workspace.css';
import Sidebar from '../../Navigation/Sidebar.js';
import "../../styles/Paths.css";

const LessonBackgroundRect = (props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
      <div 
          className={`lesson-background-rect ${isHovered ? 'hovered' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
          <h4 className='lesson-category'>{ props.category }</h4>
          <img className="lesson-icon" src={ props.imgPath } alt="sad"></img>
          <h3 className={ props.lessonName.length > 20 ? 'long-lesson-name' : 'lesson-name'}>{ props.lessonName }</h3>
          <div>
              <button className="bottom-rectangle">Click me</button>
          </div>
      </div>
  );
};

const IDE = (props) => {
  const [currentTab, setCurrentTab] = useState('newTab');  
  const [currentProblem, setCurrentProblem] = useState({}); // default problem
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

  const TOPICS = ["sorting", "searching"];
  const CONTESTS = ["CCC", "USACO"];

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

    if (searchPoints) {
      filtered = filtered.filter((q) => q.points === parseInt(searchPoints, 10));
    }

    if (search) {
      filtered = filtered.filter((q) =>
        q.title.toLowerCase().includes(search.toLowerCase())
      );
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
  }, [questions, searchPoints, search, topics, contests]);

  useEffect(() => {
    // Fetch problem data from Firebase
    const fetchProblemData = async () => {
      if (questionID) {  // Add this check
        try {
          const docRef = await getDoc(doc(db, "Questions", questionID));
          if (docRef.exists()) {
            setCurrentProblem(docRef.data());
            if (!problems.includes(docRef.data())) {
              setProblems(prevProblems => [...prevProblems, docRef.data()]);
            }          
            console.log("Problem from problemdesc:", docRef.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
        }
      }
    };
  
    fetchProblemData();
  }, [questionID]);  

  useEffect(() => {
    // Fetch test cases data from TestCaseReader
    const fetchTestCasesData = async () => {
      try {
        let testCaseArray = [];
  
        // Get the testCaseFolder from the currentProblem
        const testCaseFolder = currentProblem.folder;
  
        if (testCaseFolder) {  // Add this check
          // Hardcoded file names from 1.in to 10.in
          for (let i = 1; i <= 10; i++) {
            const fileName = `${i}.in`;
  
            console.log("Processing file:", fileName);
  
            try {
              const inputResponse = await axios.get(`${process.env.PUBLIC_URL}/TestCaseData/${testCaseFolder}/${fileName}`);
              const outputResponse = await axios.get(`${process.env.PUBLIC_URL}/TestCaseData/${testCaseFolder}/${fileName.replace(".in", ".out")}`);
  
              console.log("File Name:", fileName);
              console.log("Input Response:", inputResponse.data);
              console.log("Output Response:", outputResponse.data);
  
              testCaseArray.push({
                key: fileName.replace(".in", ""),
                input: inputResponse.data,
                output: outputResponse.data,
              });
            } catch (error) {
              console.error("Error processing file:", fileName, error);
            }
          }
  
          console.log("Test Cases from problemdesc:", testCaseArray);
  
          setTestCases(testCaseArray);
          setIsLoading(false); // Set the loading state to false after fetching the test cases data
        }
      } catch (error) {
        console.error("Error fetching test cases: ", error);
      }
    };
  
    fetchTestCasesData();
  }, [currentProblem]);  

  const boilerPlate = 
`#include <iostream>

int main() {
  std::cout << "Hello from C++!" << std::endl;
  return 0;
}`;

  // Create separate useRef instances for each row
  const scrollContainer1 = useRef(null);
  const scrollContainer2 = useRef(null);
  const scrollContainer3 = useRef(null);

  // Variables for refining the scrolling behavior
  const scrollDistance = 200; // Distance to scroll
  const scrollDuration = 30; // Duration of the scroll animation in milliseconds
  const scrollInterval = 1; // Interval between each scroll step in milliseconds

  // Modify the smoothScroll function to take a scrollContainer as a parameter
  const smoothScroll = (end, scrollContainer) => {
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

  const scrollLeft = (scrollContainer) => {
    console.log("scrolling left");
    if (scrollContainer.current) {
      smoothScroll(scrollContainer.current.scrollLeft - scrollDistance, scrollContainer);
    }
  };
  
  const scrollRight = (scrollContainer) => {
    if (scrollContainer.current) {
      smoothScroll(scrollContainer.current.scrollLeft + scrollDistance, scrollContainer);
    }
  };

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
    console.log("sent code:", code);

    // Start the timer
    const startTime = performance.now();

    const response = await fetch('http://localhost:5000/api/execute', {
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

    // End the timer and calculate the elapsed time
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(`Execution time: ${elapsedTime} milliseconds`);

    console.log("sent code");
    const data = await response.json();
    console.log(data);

    setResults(data);
  };

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
  
  return (
    <Split
        className="split"
        minSize={500}
    >
    <div id="split-0">
    <div className={styles.row}>
      <Sidebar />
      <div className={styles.problemStatement}>
        <div className={styles.scrollableContent}> 
          <div className={styles.buttonRow}>
            {problems.map((problem, index) => (
              <button 
                key={problem}
                className={styles.buttonTab} 
                style={{background: currentProblem.title === problem.title ? "#1B1B32" : "#0A0A23", color: currentProblem.title === problem.title ? "white" : "white"}} 
                onClick={() => { setCurrentProblem(problem)}}
              >
                <p className={styles.buttonText}>{problem.title.charAt(0).toUpperCase() + problem.title.slice(1)}</p>
                <img className={styles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the click event from bubbling up to the parent button
                    const updatedProblems = problems.filter((_, problemIndex) => problemIndex !== index);
                    setProblems(updatedProblems);
                    if (currentProblem.title === problem.title) {
                      setCurrentProblem(updatedProblems[0] || {});
                      if (updatedProblems.length === 0) { // Add this check
                        setCurrentTab('newTab');
                      }                
                    }
                  }}            
                />
              </button>
            ))}
            <button className={styles.newTab} onClick={() => setCurrentTab('newTab')}><img src='/add.png' alt="New tab" style={{minWidth: '10px', minHeight: '10px', background: 'transparent'}}/></button>
            <div className={styles.rightAlign}>
            </div>
          </div>
          { props.currentPage === 'paths' ? (
            <>
              <div className="hero">
                <div className="wrapper">
                  <div className="unit-header">
                    <div className="unit-header-left">
                      <h1 className='unit-title'>J1 & J2 & J3: Basic Programming</h1>
                      <br />
                      <p>lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                      lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                      lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                      </p>
                    </div>
                    <div className="unit-header-right"><p>Button</p></div>
                  </div>
                </div>
              </div>
              <div className='scroll-row'>
                <button onClick={() => scrollLeft(scrollContainer1)} className="scroll-button left"><img src='/leftarrow.png' alt='Left' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/></button>
                <div className="lesson-wrapper" ref={scrollContainer1}>
                  <LessonBackgroundRect category={"5 Problems"} lessonName={"Basic Syntax"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"4 Problems"} lessonName={"Loops"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"7 Problems"} lessonName={"Conditions"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"1 Problem"} lessonName={"Arrays"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"4 Problems"} lessonName={"Basic String Manipulation"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"6 Problems"} lessonName={"Arithmetic operations"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"4 Problems"} lessonName={"Nested Loops"} imgPath={"/open.png"}/>
                </div>
                <button onClick={() => scrollRight(scrollContainer1)} className="scroll-button right"><img src='/rightarrow.png' alt='Right' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/></button>
              </div>
              <div className="hero">
                <div className="wrapper">
                  <div className="unit-header">
                    <div className="unit-header-left">
                      <h1 className='unit-title'>J1 & J2 & J3: Basic Programming</h1>
                      <br />
                      <p>lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                      lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                      lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                      </p>
                    </div>
                    <div className="unit-header-right"><p>Button</p></div>
                  </div>
                </div>
              </div>
              <div className='scroll-row'>
              <button onClick={() => scrollLeft(scrollContainer2)} className="scroll-button left"><img src='/leftarrow.png' alt='Left' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/></button>
                <div className="lesson-wrapper" ref={scrollContainer2}>
                  <LessonBackgroundRect category={"5 Problems"} lessonName={"Basic Syntax"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"4 Problems"} lessonName={"Loops"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"7 Problems"} lessonName={"Conditions"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"1 Problem"} lessonName={"Arrays"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"4 Problems"} lessonName={"Basic String Manipulation"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"6 Problems"} lessonName={"Arithmetic operations"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"4 Problems"} lessonName={"Nested Loops"} imgPath={"/open.png"}/>
                </div>
                <button onClick={() => scrollRight(scrollContainer2)} className="scroll-button right"><img src='/rightarrow.png' alt='Right' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/></button>
              </div>
              <div className="hero">
                <div className="wrapper">
                  <div className="unit-header">
                    <div className="unit-header-left">
                      <h1 className='unit-title'>J1 & J2 & J3: Basic Programming</h1>
                      <br />
                      <p>lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                      lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                      lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                      </p>
                    </div>
                    <div className="unit-header-right"><p>Button</p></div>
                  </div>
                </div>
              </div>
              <div className='scroll-row'>
              <button onClick={() => scrollLeft(scrollContainer3)} className="scroll-button left"><img src='/leftarrow.png' alt='Left' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/></button>
                <div className="lesson-wrapper" ref={scrollContainer3}>
                  <LessonBackgroundRect category={"5 Problems"} lessonName={"Basic Syntax"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"4 Problems"} lessonName={"Loops"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"7 Problems"} lessonName={"Conditions"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"1 Problem"} lessonName={"Arrays"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"4 Problems"} lessonName={"Basic String Manipulation"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"6 Problems"} lessonName={"Arithmetic operations"} imgPath={"/open.png"}/>
                  <LessonBackgroundRect category={"4 Problems"} lessonName={"Nested Loops"} imgPath={"/open.png"}/>
                </div>
                <button onClick={() => scrollRight(scrollContainer3)} className="scroll-button right"><img src='/rightarrow.png' alt='Right' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/></button>
              </div>
              <Link to = "/computercontest">COMPUTER CONTESTS</Link>
            </>          
          ) : currentTab === 'description' ? (
            <>
              <div className={styles.wrapper}>
                <br />
                <h1 className={styles.title}>{currentProblem.title}</h1>
                <br />
                <div className={styles.description}>
                  <h3>Problem Description</h3>
                  <p>{currentProblem.description}</p>
                  <div className={styles.divider}></div>
                  <br />
                  <h3>Input Format</h3>
                  <p>{currentProblem.inputFormat}</p>
                  <div className={styles.divider}></div>
                  <br />
                  <h3>Constraints</h3>
                  <ul>
                    {false && currentProblem.constraints &&
                      Object.entries(currentProblem.constraints).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      ))}
                  </ul>
                  <div className={styles.divider}></div>
                  <br />
                  <h3>Output Format</h3>
                  <p>{currentProblem.outputFormat}</p>
                  <div className={styles.divider}></div>
                  <br />
                  <h3>Points</h3>
                  <p>{currentProblem.points}</p>
                </div>
                <br />
                <br />
                <button className={styles.runAll} onClick={runAllTests}>Run All Tests (Ctrl + Enter)</button>
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
                        <br />
                        <h4 className={className}>Input:</h4>
                        <pre className={styles.codeSnippet}>{testCase.input.replace(/\\r\\n/g, '\n')}</pre>
                        <br />
                        <h4 className={className}>Expected Output:</h4>
                        <pre className={styles.codeSnippet}>{testCase.output.replace(/\\r\\n/g, '\n')}</pre>
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
            </>
          ) : currentTab === 'newTab' ? (
            <div className={styles.wrapper}>
              <div className='hero'> 
                <div className={styles.description}>
                  <h2 className="title">Problems</h2>
                  <div className="search-rect">
                    <input
                      type="text"
                      value={searchPoints}
                      onChange={(e) => setSearchPoints(e.target.value)}
                    />
                  </div>
                  <div className="subsearch-row">
                    <div className="search-container">
                      <div className="column1">
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
                      <div className="column2">
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
                      <div className="column3">
                        <Select 
                          styles={SELECT_STYLES}
                          options={contests}
                          onChange={(selected) => setSearchPoints(selected.value)}
                          placeholder="Points"
                          onFocus={() => handleFocus('points')}
                          onBlur={() => handleBlur('points')}
                        />
                        {!searchPoints && !isFocused.searchPoints && <div className="dropdown-placeholder">Points</div>}
                      </div>
                    </div>
                    <div className="subsearch-text"></div>
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
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredQuestions.map((q) => (
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
                                    setQuestionID(q.title);
                                    setTestCaseFolder(q.folder);
                                    setCurrentTab('description');
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
