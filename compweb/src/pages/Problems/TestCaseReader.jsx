import React, { useState, useEffect } from "react";
import axios from "axios";

const TestCaseReader = ({ folder }) => {
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await axios.get(`${process.env.PUBLIC_URL}/../src/testcases/${folder}`);
        const files = response.data;

        const testCasePromises = files
          .filter(file => file.name.endsWith(".in"))
          .map(async file => {
            const inputResponse = await axios.get(`${process.env.PUBLIC_URL}/../src/testcases/${folder}/${file.name}`);
            const outputResponse = await axios.get(`${process.env.PUBLIC_URL}/../src/testcases/${folder}/${file.name.replace(".in", ".out")}`);

            return {
              key: file.name.replace(".in", ""),
              input: inputResponse.data,
              output: outputResponse.data,
            };
          });

        const testCaseArray = await Promise.all(testCasePromises);

        setTestCases(testCaseArray);
      } catch (error) {
        console.error("Error fetching test cases: ", error);
      }
    };

    fetchTestCases();
  }, [folder]); // Include folder as a dependency for useEffect

  return (
    <>
      {testCases.map((testCase) => (
        <div key={testCase.key}>
          <h3>Input:</h3>
          <pre>{testCase.input}</pre>
          <h3>Output:</h3>
          <pre>{testCase.output}</pre>
        </div>
      ))}
    </>
  );
};
export default TestCaseReader;
