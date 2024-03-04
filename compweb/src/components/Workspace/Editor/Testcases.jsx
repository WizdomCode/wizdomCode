import React from 'react';

const TestCase = ({ input, output }) => {
  return (
    <div className="test-case">
      <pre className="input">{input}</pre>
      <pre className="output">{output}</pre>
    </div>
  );
};

const TestCases = () => {
  return (
    <div className="test-cases">
      <h2>Test Cases</h2>
      <TestCase input="1, 2, 3" output="6" />
      <TestCase input="-1, -2, 3, 5, 6" output="13" />
      <TestCase input="2, 1, -3, 4, -1, 2, 1, -5, 4" output="6" />
      <TestCase input="-100, -100, 1, 2, 3" output="6" />
    </div>
  );
};

export default TestCases;