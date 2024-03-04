import React, { useState } from 'react';
import Split from 'react-split';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import styles from '../../styles/Editor.module.css'; // Change this line

const CodeEditor = (props) => {
  const [code, setCode] = useState(props.boilerPlate);
  const [output, setOutput] = useState('');

  // Function to run the user's code against all test cases
  const runAllTests = () => {
    let results = '';
    for (let testCase of props.testCases) {
      try {
        // Create a new function from the user's code
        const func = new Function('return ' + code + ';')();

        // Check if the function is defined
        if (typeof func !== 'function') {
          results += 'Error: No valid function returned from the code provided.\n';
          continue;
        }

        // Execute the user's function with the test case input
        const result = func.apply(null, testCase.input);

        // Compare the result with the expected output
        if (result === testCase.output) {
          results += `${testCase.key} passed: ${result}\n`;
        } else {
          results += `${testCase.key} failed: Expected ${testCase.output}, but got ${result}\n`;
        }
      } catch (error) {
        // If there's an error in the user's code, catch it and display the message
        results += `${testCase.key} Error: ${error.message}\n`;
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
      <CodeMirror 
        value={code}
        theme={vscodeDark}
        extensions={[javascript()]}
        onChange={(value) => {
            setCode(value);
        }}
        style={{fontSize:16}}
        />
      <button className={styles.runButton} onClick={runAllTests}>
          Run All Test Cases
        </button>
      <pre className={styles.output}>{output}</pre>
    </div>
    </Split>
  );
};

export default CodeEditor;
