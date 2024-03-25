import React, { useEffect } from 'react';
import ProblemDescription from './ProblemDescription/ProblemDescription';
import CodeEditor from './Editor/Editor';
import '../styles/Workspace.css';
import Split from 'react-split'

const Workspace = (props) => {
  return (
    <Split
        className="split"
        minSize={500}
    >
      <div id="split-0"><ProblemDescription problem={props.problem} testCases={props.testCases}/></div>
      <div id="split-1"><CodeEditor boilerPlate={props.boilerPlate} testCases={props.testCases}/></div>
    </Split>
  )
};

export default Workspace;
