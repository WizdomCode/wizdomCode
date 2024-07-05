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
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex'; 
import 'katex/dist/katex.min.css'; // don't forget to import katex styles
import { Button, Overlay, AspectRatio, Group, Container, Loader, LoadingOverlay, Switch, Title, ActionIcon, Center } from '@mantine/core';
import { getCategory, getDifficultyLevel } from '../../../../public/CATEGORY_NAMES.js';
import {
  IconNotebook,
  IconCircleDashedCheck,
  IconBook,
  IconPlayerPlay,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconX
} from '@tabler/icons-react'
import { CodeHighlight } from '@mantine/code-highlight';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

const ProblemDescription = ({ userData, currentTab, testCases, displayCases, selectedTab, setSelectedTab, scrollLeft, scrollRight, onCloseProblem }) => {
  // Example usage of getCategory// prints "String Algorithms"
  
  // Example usage of getDifficultyLevel // prints { level: 'Intermediate', number: 1 }

  const [selectedSolution, setSelectedSolution] = useState(null);
  const [testCasesVisible, setTestCasesVisible] = useState(true);

  const toggleCodeVisibility = (index) => {
    setSelectedSolution(selectedSolution === index ? null : index);
  };

  function isList(str) {
    const regex = /^(- |\d+\. )/;
    return regex.test(str);
  }
  //
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

  const runningAllCases = useSelector(state => state.runningAllCases);
  const [runningCase, setRunningCase] = useState(null);

  const results = useSelector(state => state.results);
  const resultId = useSelector(state => state.resultId);
  
  useEffect(() => {
    setRunningCase(null);
  }, [results]);

  const dispatch = useDispatch();

  const [expandAllCases, setExpandAllCases] = useState(new Array(testCases.length).fill(false));

  return (
    <Container>
      {selectedTab === 'question' && (            
        <div className={styles.wrapper}>
          <br />
          <Center>
            <Group>
              {scrollLeft &&     
                <ActionIcon variant="subtle" onClick={scrollLeft}>
                  <IconChevronLeft />
                </ActionIcon>
              }
              <div className={styles.problemTitleRow}>
                <h1 className={styles.title}>{currentTab.data.title}</h1>
                { userData && userData.solved && userData.solved.includes(currentTab.data.title) && <CheckCircle style={{ color: 'white', marginLeft: '5px' }}/> }
              </div>
              {onCloseProblem && 
                <ActionIcon variant="subtle" onClick={onCloseProblem}>
                  <IconX />
                </ActionIcon>      
              }
              {scrollRight &&     
                <ActionIcon variant="subtle" onClick={scrollRight}>
                  <IconChevronRight />
                </ActionIcon>
              }
            </Group>
          </Center>
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
                <br />
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
                <br />
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
                <br />
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
                <br />
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
                {currentTab.data.sample1.explanation && 
                  <>
                    <h3>Explanation for Sample 1</h3>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeRaw, rehypeKatex]}
                      children={customParser(currentTab.data.sample1.explanation.replace(/\\n/g, '\n'))} 
                    />
                    <br />
                  </>
                }
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
                {currentTab.data.sample2.explanation && 
                  <>
                    <h3>Explanation for Sample 2</h3>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeRaw, rehypeKatex]}
                      children={customParser(currentTab.data.sample2.explanation.replace(/\\n/g, '\n'))} 
                    />
                    <br />
                  </>
                }                
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
                {currentTab.data.sample3.explanation && 
                  <>
                    <h3>Explanation for Sample 3</h3>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeRaw, rehypeKatex]}
                      children={customParser(currentTab.data.sample3.explanation.replace(/\\n/g, '\n'))} 
                    />
                    <br />
                  </>
                }
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
          <button className={styles.runAll} onClick={() => { dispatch({ type: 'TOGGLE_RUNNING_ALL_CASES' }); setSelectedTab('tests'); dispatch({ type: 'SET_SUBMIT_CODE_REQUEST', payload: { tests: testCases, numTests: testCases.length, isCustomCase: false, problemId: currentTab.data.title, points: currentTab.data.points } }); }} style={{color: 'white'}}>Run all tests</button>
          <br />
          <div className={styles.divider}></div>
          <br />
          <p style={{ fontSize: '14px' }}><i>
            { currentTab.data.contest === 'CCC' ?
              "Problem courtesy of CEMC, University of Waterloo, used under CC BY-NC 3.0."
            :
              "Problem courtesy of the USA Computing Olympiad (USACO)." }
          </i></p>
          <br />
        </div> 
      )}

      { selectedTab === 'tests' && ( 
        console.log(results),
        <>
          <div style={{ position: 'relative', height: !testCasesVisible ? 'calc(100vh - 150px)' : '100%', overflow: !testCasesVisible ? 'hidden' : 'auto' }}>
            <LoadingOverlay mt={16} visible={!testCasesVisible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, color: 'var(--site-bg)' }} loaderProps={{ children: <Button variant='outline' size="md" onClick={() => setTestCasesVisible(true)}>Show test cases</Button> }}/>      

              <div className={styles.testCases} style={{ marginTop: '20px' }}>
                {displayCases ? displayCases.map((testCase, index) => {
                  const shouldDisplay = (resultId && resultId === currentTab.data.title) && (results && results[index] && results[index].key !== 'stop');

                  return (
                    <Accordion 
                      key={testCase.key}
                      sx={{
                        bgcolor: 'var(--site-bg)',
                        border: 1
                      }}
                      expanded={expandAllCases[index] || false}
                      onChange={(event, expanded) => {
                        setExpandAllCases(prevArray => {
                          let newArray = [...prevArray];
                          newArray[index] = !prevArray[index];
                          return newArray;
                        });
                      }}
                    >
                      <AccordionSummary>
                        <Group justify="space-between" style={{ width: '100%' }}>
                          <div>
                            <br />
                            <h3>
                              Case {testCase.key}
                              {shouldDisplay && (
                                <>
                                  {results[index] && results[index].status.description === 'Accepted' && <span className={styles.passIcon}> ✔️</span>}
                                  {results[index] && results[index].status.description === 'Wrong Answer' && <span className={styles.failIcon}> ❌</span>}
                                  {results[index] && results[index].status.description === 'Time Limit Exceeded' && <span className={styles.failIcon}> (Time limit exceeded)</span>}
                                  {results[index] && results[index].status.description === 'Memory Limit Exceeded' && <span className={styles.failIcon}> (Memory limit exceeded)</span>}
                                </>
                              )}
                            </h3>
                            {shouldDisplay && (
                                <>
                                  <Title order={5} c={'var(--dim-text)'}>[ {results[index].time || 0}s, {results[index].memory || 0} MB ]</Title>
                                </>
                              )}
                            <br />
                          </div>
                          { (runningCase && runningCase === testCase.key) || runningAllCases ? 
                            <Loader color="blue" type="dots" ml={4}/>
                            :
                            <Button onClick={() => {setRunningCase(testCase.key); dispatch({ type: 'SET_SUBMIT_CODE_REQUEST', payload: { tests: [testCases[testCase.key - 1]], numTests: 1, isCustomCase: false, problemId: currentTab.data.title, points: currentTab.data.points } }); }} variant="light" leftSection={<IconPlayerPlay size={14} />} >Run</Button>
                          }
                        </Group>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Title order={6}  c={'var(--dim-text)'}>Input:</Title>
                        <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={String(testCase.input).replace(/\\r\\n/g, '\n')} language="txt" />
                        <br />
                        <Title order={6}  c={'var(--dim-text)'}>Expected Output:</Title>
                        <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={String(testCase.output).replace(/\\r\\n/g, '\n')} language="txt" />
                        {shouldDisplay && results[index] && results[index].status.description === 'Wrong Answer' && (
                          <>
                            <br />
                            <Title order={6}  c={'var(--dim-text)'}>Actual Output:</Title>
                            <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={results[index].stdout ? results[index].stdout.replace(/\\r\\n/g, '\n') : "No output"} language="txt" />
                          </>
                        )}
                        <br />
                      </AccordionDetails>
                    </Accordion>
                  );                
                }): (
                  <div>
                    <h2>Test cases for this problem are coming soon!</h2>
                    <br />
                  </div>
                )}
              </div>

              <Group style={{ margin: '20px 0' }}>
                <Button variant="subtle" onClick={() => setExpandAllCases(new Array(testCases.length).fill(true))}>Expand all</Button>
                <Button variant="subtle" onClick={() => setExpandAllCases(new Array(testCases.length).fill(false))}>Collapse all</Button>
              </Group>
              
            </div>
          </>
        )}

        {selectedTab === 'solution' && (
          <div className={styles.wrapper}>
            {/* Content for the solution tab */}
            <div style={{ marginTop: '20px' }}>
            {currentTab.data.solutions && currentTab.data.solutions.map((solution, index) => (
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
