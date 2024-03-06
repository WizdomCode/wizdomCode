import React from 'react';
import styles from '../../styles/ProblemDescription.module.css';

const ProblemDescription = (props) => {
  const { title, description, inputFormat, constraints, outputFormat, points } = props.problem;
  return (
    <div className={styles.problemStatement}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.description}>
        <h2>Problem Description</h2>
        <p>{description}</p>
        <h2>Input Format</h2>
        <p>{inputFormat}</p>
        <h2>Constraints</h2>
        <ul>
          {constraints.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>
        <h2>Output Format</h2>
        <p>{outputFormat}</p>
        <h2>Points</h2>
        <p>{points}</p>
      </div>
    </div>
  );
};

export default ProblemDescription;
