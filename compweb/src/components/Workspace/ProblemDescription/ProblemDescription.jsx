import styles from '../../styles/ProblemDescription.module.css';
import React, { useState, useEffect } from "react";
import { auth, app, db } from "../../../firebase.js";
import { collection, getDocs } from "firebase/firestore";
import "../../../Fonts.css";
import Select from "react-select";

const ProblemDescription = (props) => {
  const { title, description, inputFormat, constraints, outputFormat, points } = props.problem;
  const [currentTab, setCurrentTab] = useState('description');  
  const [language, setLanguage] = useState('Mixing Milk'); // default language
  const languages = ['Mixing Milk', 'java']; // add or remove languages here
  const [problem, setProblem] = useState(null);
  const [cases, setCases] = useState(null);
  const [searchPoints, setSearchPoints] = useState("");
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState([]);
  const [contests, setContests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isFocused, setIsFocused] = useState({topics: false, contests: false, points: false});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');

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

  return (
    <div className={styles.row}>
      <div className={styles.sidebar}>
        <button className={`${styles.button} ${currentTab === 'description' ? styles.activeTab : ''}`} onClick={() => setCurrentTab('description')}>
          <img src='/question.png' alt="Description" style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
        </button>
        <button className={`${styles.button} ${currentTab === 'testCases' ? styles.activeTab : ''}`} onClick={() => setCurrentTab('testCases')}>
          <img src='/tests.png' alt="Tests" style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
        </button>
      </div>
      <div className={styles.problemStatement}>
        <div className={styles.scrollableContent}> 
          <div className={styles.buttonRow}>
            {languages.map((lang) => (
              <button 
                key={lang}
                className={styles.buttonTab} 
                style={{background: language === lang ? "#1B1B32" : "#0A0A23", color: language === lang ? "white" : "white"}} 
                onClick={() => { setLanguage(lang)}}
              >
                <p className={styles.buttonText}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</p>
                <img className={styles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}/>
              </button>
            ))}
            <button className={styles.newTab} onClick={() => setCurrentTab('newTab')}><img src='/add.png' alt="New tab" style={{minWidth: '10px', minHeight: '10px', background: 'transparent'}}/></button>
            <div className={styles.rightAlign}>
            </div>
          </div>
          {currentTab === 'description' ? (
            <>
              <div className={styles.wrapper}>
                <br />
                <h1 className={styles.title}>{title}</h1>
                <br />
                <div className={styles.description}>
                  <h3>Problem Description</h3>
                  <p>{description}</p>
                  <div className={styles.divider}></div>
                  <br />
                  <h3>Input Format</h3>
                  <p>{inputFormat}</p>
                  <div className={styles.divider}></div>
                  <br />
                  <h3>Constraints</h3>
                  <ul>
                    {false && constraints &&
                      Object.entries(constraints).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      ))}
                  </ul>
                  <div className={styles.divider}></div>
                  <br />
                  <h3>Output Format</h3>
                  <p>{outputFormat}</p>
                  <div className={styles.divider}></div>
                  <br />
                  <h3>Points</h3>
                  <p>{points}</p>
                </div>
              </div> 
            </>
          ) : currentTab === 'newTab' ? (
            <div className={styles.wrapper}>
              <br />
              <h2 className={styles.title}>New Tab</h2>
              <br />
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
              <div className="question-list">
                <div className="wrapper">
                  <div className="question-list-rect">
                    <div className="question-list-header">
                      <h3 className="question-list-title">Questions</h3>
                    </div>
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>Question Name</th>
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
                                  onClick={() => {
                                    setProblem(q.title);
                                    setCases(q.folder);
                                    window.scrollTo(0, 0); // This will scroll the page to the top
                                  }}
                                >
                                  Question
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
              <br />
              <h2 className={styles.title}>Tests</h2>
              <br />
              <div className={styles.testCases}>
                {props.testCases.map((testCase, index) => (
                  <div key={testCase.key} className={index % 2 === 0 ? styles.testCaseEven : styles.testCaseOdd}>
                    <div className={index % 2 === 0 ? styles.testCaseEven : styles.testCaseOdd}>
                      <br />
                      <h3 className={index % 2 === 0 ? styles.testCaseEven : styles.testCaseOdd}>
                        {testCase.key}
                        {testCase.status === 'passed' ? <span className={styles.passIcon}>✔️</span> : <span className={styles.failIcon}>❌</span>}
                      </h3>
                      <br />
                      <h4 className={index % 2 === 0 ? styles.testCaseEven : styles.testCaseOdd}>Input:</h4>
                      <pre className={styles.codeSnippet}>{testCase.input.replace(/\\r\\n/g, '\n')}</pre>
                      <br />
                      <h4 className={index % 2 === 0 ? styles.testCaseEven : styles.testCaseOdd}>Expected Output:</h4>
                      <pre className={styles.codeSnippet}>{testCase.output.replace(/\\r\\n/g, '\n')}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
