import React from 'react';
import Split from 'react-split';
import ProblemDescription from './ProblemDescription/ProblemDescription';
import CodeEditor from './Editor/Editor';
import '../styles/globals.css';
import styles from '../styles/Workspace.module.css';

const Workspace = (props) => {
  return (
    <Split
        className={styles.split} // Use local class name
        minSize={50}
        gutterSize={10}
    >
        <div><ProblemDescription problem={props.problem}/></div>
        <div><CodeEditor boilerPlate={props.boilerPlate} /></div>
    </Split>
  )
};

export default Workspace;
