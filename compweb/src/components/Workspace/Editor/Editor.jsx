import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import styles from '../../styles/Editor.module.css';
import '../../styles/Editor.css';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import * as monaco from 'monaco-editor';

const CodeEditor = (props) => {
  const [code, setCode] = useState(props.boilerPlate);
  const [output, setOutput] = useState([]);
  const [language, setLanguage] = useState("cpp");

  console.log(props.testCases);
 
  const submitCode = async () => {
    for (let testCase of props.testCases) {
    
      const answer = await fetch(
        "http://localhost:9000/2015-03-31/functions/function/invocations",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            code: code,
            language: language,
            input: testCase.input,
            expected_output: testCase.output
          }),
        }
      );

      const result = answer.json();

      
        if (result.body === 'Test Passed') {
          console.log(`Test case ${testCase.key} passed`);
        } else {
          console.log(`Test case ${testCase.key} failed`);
        }
      console.log(result);
    }
  };

  useEffect(() => {
    console.log(code);
  }, [code]);

  // Function to run the user's code against all test cases
  const runAllTests = async () => {
    let results = [];
    for (let testCase of props.testCases) {
      try {
        // Prepare the data for the Piston API
        const data = {
          language: 'cpp',
          version: '10.2.0', // replace with the version you want to use
          files: [
            {
              name: 'temp.cpp',
              content: code
            }
          ],
          stdin: testCase.input, // Convert input to an array
        };

        console.log(data);

        // Make a POST request to the Piston API
        const response = await axios.post('http://localhost:2000/api/v2/execute', data);

        // Parse the response
        const result = response.data;

        // Check if the program encountered an error
        if (result.stderr || result.message) {
          results.push({
            testCaseKey: testCase.key,
            status: 'Error',
            output: null,
            error: result.stderr || result.message
          });
          continue;
        }

        // Compare the result with the expected output
        if (result.stdout && testCase.output && result.stdout.trim() === testCase.output.toString().trim()) {
          results.push({
            testCaseKey: testCase.key,
            status: 'Passed',
            output: result.stdout,
            error: null
          });
        } else {
          results.push({
            testCaseKey: testCase.key,
            status: 'Failed',
            output: result.stdout,
            error: null
          });
        }
      } catch (error) {
        // If there's an error in the user's code, catch it and display the message
        results.push({
          testCaseKey: testCase.key,
          status: 'Error',
          output: null,
          error: error.message
        });
      }
    }
    setOutput(results);
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
            <h5>Test Case {result.testCaseKey}</h5>
            <p>Status: {result.status}</p>
            <p>Output: {result.output || 'N/A'}</p> {/* Display 'N/A' if output is undefined */}
            <p>Error: {result.error || 'N/A'}</p> {/* Display 'N/A' if error is undefined */}
          </div>
        ))}
      </div>
    </>
  );
};

export default CodeEditor;