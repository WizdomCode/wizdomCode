import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import styles from '../../styles/Editor.module.css';
import '../../styles/Editor.css';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import * as monaco from 'monaco-editor';
import { useDispatch, useSelector } from 'react-redux';

const CodeEditor = (props) => {
  const [code, setCode] = useState(props.boilerPlate);
  const [output, setOutput] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const dispatch = useDispatch();

  console.log(props.testCases);

  useEffect(() => {
    props.getCode(code, language);
    dispatch({
      type: 'SET_CODE_STATE',
      payload: {
        language: language,
        code: code
      }
    })
  }, [code]);

  const submitCode = async () => {
    console.log("sent code:", props.testCases);

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
        test_cases: props.testCases
      })
    });

    // End the timer and calculate the elapsed time
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(`Execution time: ${elapsedTime} milliseconds`);

    console.log("sent code");
    const data = await response.json();
    console.log(data);
    setOutput(data);

    props.getResults(data);
  };  

  /* load monaco */

  fetch('/themes/Monokai.json')
  .then(data => data.json())
  .then(data => {
    monaco.editor.defineTheme('monokai', data);
    monaco.editor.setTheme('monokai');
  })

  monaco.editor.defineTheme('my-custom-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      
    ],
    colors: {}
  });

  monaco.editor.setTheme('my-custom-theme');

  const BGDARK = "#1B1B32";
  const UNSELECTED = "#0A0A23";

  return (
    <>
      <div className={styles.codeEditor}>
        <div className={styles.buttonRow}>
          <button className={styles.button} style={{background: language === "python" ? BGDARK : UNSELECTED, color: language === "python" ? "white" : "white"}} onClick={() => { setLanguage("python")}}>
            <p className={styles.buttonText}>Python</p>
            <img className={styles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}/>
          </button>
          <button className={styles.button} style={{background: language === "java" ? BGDARK : UNSELECTED, color: language === "java" ? "white" : "white"}} onClick={() => { setLanguage("java")}}>
            <p className={styles.buttonText}>Java</p>
            <img className={styles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}/>  
          </button>
          <button className={styles.button} style={{background: language === "cpp" ? BGDARK : UNSELECTED, color: language === "cpp" ? "white" : "white"}} onClick={() => { setLanguage("cpp")}}>
            <p className={styles.buttonText}>C++</p>
            <img className={styles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}/>  
          </button>
          <button className={styles.newTab}><img src='/add.png' alt="Description" style={{minWidth: '10px', minHeight: '10px', background: 'transparent'}}/></button>
          <div className={styles.rightAlign}>
            <button 
              className={styles.buttonIcon}
              onClick={() => {
              submitCode();
            }}>
              <img src='/run.png' alt="Run" style={{maxWidth: '20px', maxHeight: '20px'}}/>
            </button>
            <button 
              className={styles.buttonIcon}
              onClick={() => {
              submitCode();
            }}>
              <p className={styles.buttonText}>SUBMIT</p>
            </button>
          </div>
        </div>
        <br />
        <Editor
          className={styles.codeEditor}
          theme="vs-dark"
          height="60vh"
          defaultLanguage="cpp"
          value={code}
          onChange={(value) => setCode(value)}
        />
      </div>
      <div className={styles.output}>
        {output.map((result, index) => (
          <div key={index}>
            <h5>Test Case {result.key}</h5>
            <p>Status: {result.status}</p>
            {result.status === 'Failed' && <p>Actual Output:{"\n"}{result.actual_output}</p>}
          </div>
        ))}
      </div>
    </>
  );
};

export default CodeEditor;
