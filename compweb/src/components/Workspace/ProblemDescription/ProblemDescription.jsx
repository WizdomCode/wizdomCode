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
import SolutionDisplay from './SolutionDisplay';
import { Container } from '@mantine/core';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // don't forget to import katex styles
import { getCategory, getDifficultyLevel } from '../../../../public/CATEGORY_NAMES.js';
import {
  IconNotebook,
  IconCircleDashedCheck,
  IconBook,
  IconPlayerPlay
} from '@tabler/icons-react'
import { CodeHighlight } from '@mantine/code-highlight';

const ProblemDescription = ({ userData, currentTab, submitCode, testCases, displayCases, results, solutions, selectedTab }) => {
  // Example usage of getCategory// prints "String Algorithms"
  
  // Example usage of getDifficultyLevel // prints { level: 'Intermediate', number: 1 }

  const [selectedSolution, setSelectedSolution] = useState(null);
  const [testCasesVisible, setTestCasesVisible] = useState(false);

  const toggleCodeVisibility = (index) => {
    setSelectedSolution(selectedSolution === index ? null : index);
  };

  function isList(str) {
    const regex = /^(- |\d+\. )/;
    return regex.test(str);
  }
  
  function parseText(str) {
    return str
      .split('\n')
      .map((str) => {
        if (str.startsWith('<img')) {
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

  return (
    <Container>
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
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  children={customParser(currentTab.data.inputFormat.replace(/\\n/g, '\n'))}
                />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.constraints && (
              <>
                <h3>Constraints</h3>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  children={customParser(currentTab.data.constraints.replace(/\\n/g, '\n'))}
                />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.outputFormat && (
              <>
                <h3>Output Format</h3>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  children={customParser(currentTab.data.outputFormat.replace(/\\n/g, '\n'))}
                />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.sample1 && currentTab.data.sample1.input && (
              <>
                <h3>Sample Input 1</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample1.input.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Output for Sample Input 1</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample1.output.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Explanation for Sample 1</h3>
                {currentTab.data.sample1.explanation && 
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    children={customParser(currentTab.data.sample1.explanation.replace(/\\n/g, '\n'))} 
                  />
                }
                <br />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.sample2 && currentTab.data.sample2.input && (
              <>
                <h3>Sample Input 2</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample2.input.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Output for Sample Input 2</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample2.output.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Explanation for Sample 2</h3>
                {currentTab.data.sample2.explanation && 
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    children={customParser(currentTab.data.sample2.explanation.replace(/\\n/g, '\n'))} 
                  />
                }                <br />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.sample3 && currentTab.data.sample3.input && (
              <>
                <h3>Sample Input 3</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample3.input.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Output for Sample Input 3</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample3.output.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Explanation for Sample 3</h3>
                {currentTab.data.sample3.explanation && 
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    children={customParser(currentTab.data.sample3.explanation.replace(/\\n/g, '\n'))} 
                  />
                }                <br />
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
          <button className={styles.runAll} onClick={() => submitCode()} style={{color: 'white'}}>Run All Tests (Ctrl + Enter)</button>
          <br />
        </div> 
      )}

      { selectedTab === 'tests' && ( 
        testCasesVisible ?
          <div className={styles.testCases}>
            {displayCases ? displayCases.map((testCase, index) => {
              const status = results[index]?.status?.description;
                const className = status === 'Accepted' ? styles.testCasePassed : (status === 'Wrong Answer' || status === 'Time limit exceeded') ? styles.testCaseFailed : index % 2 === 0 ? styles.testCaseEven : styles.testCaseOdd;

              return (
                <div key={testCase.key}>
                  <br />
                  <h3 className={className}>
                    Case {testCase.key}
                    {results[index] && results[index].status.description === 'Accepted' && <span className={styles.passIcon}> ✔️</span>}
                    {results[index] && results[index].status.description === 'Wrong Answer' && <span className={styles.failIcon}> ❌</span>}
                    {results[index] && results[index].status.description === 'Time Limit Exceeded' && <span className={styles.failIcon}> (Time limit exceeded)</span>}
                  </h3>
                  {results[index] && (
                      <>
                        <h5 className={className}>[ {results[index].time}s ]</h5>
                      </>
                    )}
                  <br />
                  <h4 className={className}>Input:</h4>
                  <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={String(testCase.input).replace(/\\r\\n/g, '\n')} language="txt" />
                  <br />
                  <h4 className={className}>Expected Output:</h4>
                  <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={String(testCase.output).replace(/\\r\\n/g, '\n')} language="txt" />
                  {results[index] && results[index].status.description === 'Wrong Answer' && (
                    <>
                      <br />
                      <h4 className={className}>Actual Output:</h4>
                      <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={results[index].stdout ? results[index].stdout.replace(/\\r\\n/g, '\n') : "No output"} language="txt" />
                    </>
                  )}
                  <br />
                  <Button onClick={() => {console.log(testCases); submitCode([testCases[testCase.key - 1]], 1);}} variant="light" leftSection={<IconPlayerPlay size={14} />} >Run</Button>
                </div>
              );                
            }): (
              <div>
                <h2>Test cases for this problem are coming soon!</h2>
                <br />
              </div>
            )}
          </div> :
          <div>
            <Button onClick={() => setTestCasesVisible(true)}>Show test cases</Button>
          </div>
        )}

        {selectedTab === 'solution' && (
          <div className={styles.wrapper}>
            {/* Content for the solution tab */}
            <h1>Solution</h1>
            <div>
            {solutions.map((solution, index) => (
          <SolutionDisplay
            key={index}
            solution={solution}
            index={index}
            selectedSolution={selectedSolution}
            toggleCodeVisibility={toggleCodeVisibility}
          />
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
    </Container>
  );
};

export default ProblemDescription;
