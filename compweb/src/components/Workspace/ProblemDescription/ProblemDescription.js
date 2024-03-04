import React from 'react'
import '../../styles/globals.css'

const ProblemDescription = (props) => {
  const { title, description, inputFormat, constraints, outputFormat } = props.problem;
  return (
    <div style={{ height: '100vh' }}>
        <div className="problem-statement">
      <h1 className="title">{title}</h1>
      <div className="description">
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
      </div>
    </div>
    </div>
  )
}

export default ProblemDescription
