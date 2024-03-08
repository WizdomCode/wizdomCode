import React, { useState } from 'react';
import Split from 'react-split';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import styles from '../../styles/Editor.module.css';
import { cpp } from '@codemirror/lang-cpp';

const CodeEditor = (props) => {
  const [code, setCode] = useState(props.boilerPlate);
  const [output, setOutput] = useState([]);

  // Function to run the user's code against all test cases
  const runAllTests = async () => {
    let results = [];
    for (let testCase of props.testCases) {
      try {
        // Prepare the data for the Judge0 API
        const data = {
          source_code: code,
          language_id: 54, // C++ (GCC 9.2.0)
          stdin: testCase.input, // Convert input to an array
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
        const response = await fetch('http://172.20.144.1:2358/submissions/?base64_encoded=false&wait=true', {
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
    console.log(results);
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
      <CodeMirror 
        value={code}
        theme={vscodeDark}
        extensions={[cpp()]}
        onChange={(editor, data, value) => {
          console.log(editor);
          setCode(editor);
        }}
        style={{fontSize:16}}
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