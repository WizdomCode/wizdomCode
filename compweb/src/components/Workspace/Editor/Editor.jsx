import React, { useEffect, useState } from 'react';
import Split from 'react-split';
import styles from '../../styles/Editor.module.css';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CodeEditor = (props) => {
  const [code, setCode] = useState(props.boilerPlate);
  const [output, setOutput] = useState([]);
  const [language, setLanguage] = useState("");

  const submitCode = () => {
    console.log(code);
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

  return (
    <Split
        className={styles.split} // Change this line
        direction="vertical"
        minSize={10}
        gutterSize={10}
        sizes={[50, 50]}
    >
    <div>
        <h2>Test Cases</h2>
        <div className={styles.testCases}>
        {props.testCases.map((testCase) => (
            <div key={testCase.key} className={styles.testCase}>
            <h3>{testCase.key}</h3>
            <p>Input: {JSON.stringify(testCase.input)}</p>
            <p>Expected Output: {testCase.output}</p>
            </div>
        ))}
        </div>
    </div>
    <div className={styles.codeEditor}>
      <h1 className={styles.title}>Code Editor</h1>
      <button style={{background: language === "python" ? "black" : "white", color: language === "python" ? "white" : "black"}} onClick={() => { setLanguage("python")}}>Python</button>
      <button style={{background: language === "java" ? "black" : "white", color: language === "java" ? "white" : "black"}} onClick={() => { setLanguage("java")}}>Java</button>
      <button style={{background: language === "cpp" ? "black" : "white", color: language === "cpp" ? "white" : "black"}} onClick={() => { setLanguage("cpp")}}>C++</button>
      <button onClick={() => {
        submitCode();
      }}>SUBMIT</button>
      <Editor
        theme="vs-dark"
        height="90vh"
        defaultLanguage="cpp"
        value={code}
        onChange={(value) => setCode(value)}
      />
      <button className={styles.runButton} onClick={runAllTests}>
          Run All Test Cases
        </button>
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
    </div>
    </Split>
  );
};

export default CodeEditor;