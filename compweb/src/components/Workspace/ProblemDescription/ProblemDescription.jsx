// questionID is a unique identifier (str) representing a question's title, used to fetch information on a specfic question within this file
// testCaseFolder is a string indicating the location of a problem's test cases
// these are decided by the search/filter system

// problem is an object containing { title, description, inputFormat, constraints, outputFormat, points }
// testCases is an array of objects, each containing a .key, .input, and .output

import styles from '../../styles/ProblemDescription.module.css';
import React, { useState, useEffect } from "react";
import { auth, app, db } from "../../../firebase.js";
import { collection, getDocs, addDoc, getDoc, doc } from "firebase/firestore";
import "../../../Fonts.css";
import Select from "react-select";
import { Link } from "react-router-dom";
import axios from "axios";
import CheckCircle from '@mui/icons-material/CheckCircle';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // don't forget to import katex styles


const ProblemDescription = ({ userData, currentTab, submitCode, displayCases, results, solutions }) => {
  const [selectedTab, setSelectedTab] = useState('question');
  const [selectedSolution, setSelectedSolution] = useState(null);

  const toggleCodeVisibility = (index) => {
    setSelectedSolution(selectedSolution === index ? null : index);
  };

  function customParser(text) {
    const newText = text
      .split('!table')
      .map((str, index) => {
        if (index % 2 === 0) {
          return `<em class="${styles.descriptionText}">${str}</em><br />`;
        } else {
          return str;
        }
      })
      .join('')
      .replace(/`(.*?)`/g, `<span class="${styles.customLatex}">$1</span>`);
    return newText;
  }

  return (
    <>
      <div className={styles.tabs}>
        <button onClick={() => setSelectedTab('question')}>Question</button>
        <button onClick={() => setSelectedTab('solution')}>Solution</button>
        <button onClick={() => setSelectedTab('editorial')}>Editorial</button>
      </div>
      
      {selectedTab === 'question' && (            
        <div className={styles.wrapper}>
          <br />
          <div className={styles.problemTitleRow}>
            <h1 className={styles.title}>{currentTab.data.title}</h1>
            { userData && userData.solved && userData.solved.includes(currentTab.data.title) && <CheckCircle style={{ color: 'white', marginLeft: '5px' }}/> }
          </div>
          <br />
          <div className={styles.description}>
            {currentTab.data.description && (
              <>
                {currentTab.data.specificContest && <h3>{currentTab.data.specificContest}</h3>}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  children={customParser(currentTab.data.description.replace(/\\n/g, '\n'))}
                />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.inputFormat && (
              <>
                <h3>Input Format</h3>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.inputFormat.replace(/\\n/g, '\n'))} />
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
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.outputFormat.replace(/\\n/g, '\n'))} />
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
                {currentTab.data.sample1.explanation && <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.sample1.explanation.replace(/\\n/g, '\n'))} />}
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
                {currentTab.data.sample2.explanation && <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.sample2.explanation.replace(/\\n/g, '\n'))} />}
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
                {currentTab.data.sample3.explanation && <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customParser(currentTab.data.sample3.explanation.replace(/\\n/g, '\n'))} />}
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
            {displayCases ? displayCases.map((testCase, index) => {
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
        )}

        {selectedTab === 'solution' && (
          <div className={styles.wrapper}>
            {/* Content for the solution tab */}
            <h1>Solution</h1>
            <div>
              {solutions.map((solution, index) => (
                <div key={index}>
                  <span>User ID: {solution.userId}</span>
                  <span>Execution Time: {solution.executionTime}</span>
                  <span>Score: {solution.score}</span>
                  <button onClick={() => toggleCodeVisibility(index)}>
                    {selectedSolution === index ? 'Hide Code' : 'Show Code'}
                  </button>
                  <pre style={{ display: selectedSolution === index ? 'block' : 'none' }}>
                    <code>{solution.solution}</code>
                  </pre>
                </div>
              ))}
            </div>
            {/* Add solution content here */}
          </div>
        )}
  
        {selectedTab === 'editorial' && (
          <div className={styles.wrapper}>
            {/* Content for the editorial tab */}
            <h1>Editorial</h1>
            {/* Add editorial content here */}
          </div>
        )}
    </>
  );
};

export default ProblemDescription;
