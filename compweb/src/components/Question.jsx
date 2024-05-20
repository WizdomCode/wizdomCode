// questionID is a unique identifier (str) representing a question's title, used to fetch information on a specfic question within this file 
// testCaseFolder is a string indicating the location of a problem's test cases, used to fetch information on a specfic question's test cases within this file

// problem is an object containing { title, description, inputFormat, constraints, outputFormat, points }, passed to Workspace as problem
// testCases is an array of objects, each containing a .key, .input, and .output, passed to Workspace as testCases

// this data is eventually passed to the ProblemDescription as props.problem and props.testCases

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, app, db } from "../firebase";
import { addDoc, collection, getDoc, doc } from "firebase/firestore";
import Navigation from "./Navigation/Navigation";
import Workspace from "./Workspace/Workspace";
import axios from "axios";

const Question = ({ questionID, testCaseFolder}) => {
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch problem data from Firebase
    const fetchProblemData = async () => {
      try {
        const docRef = await getDoc(doc(db, "Questions", questionID));
        if (docRef.exists()) {
          setProblem(docRef.data());
        } else {
        }
      } catch (error) {
      }
    };

// Fetch test cases data from TestCaseReader
const fetchTestCasesData = async () => {
  try {
    let testCaseArray = [];

    // Hardcoded file names from 1.in to 10.in
    for (let i = 1; i <= 10; i++) {
      const fileName = `${i}.in`;

      try {
        const inputResponse = await axios.get(`${process.env.PUBLIC_URL}/TestCaseData/${testCaseFolder}/${fileName}`);
        const outputResponse = await axios.get(`${process.env.PUBLIC_URL}/TestCaseData/${testCaseFolder}/${fileName.replace(".in", ".out")}`);

        testCaseArray.push({
          key: fileName.replace(".in", ""),
          input: inputResponse.data,
          output: outputResponse.data,
        });
      } catch (error) {
      }
    }

    setTestCases(testCaseArray);
    setIsLoading(false); // Set the loading state to false after fetching the test cases data
  } catch (error) {
  }
};



    

    fetchProblemData();
    fetchTestCasesData();
  }, [questionID]);

  const boilerPlate = 
`#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d %d", a + 2, b + 2);
    return 0;
}`;

return (
  <>
    {problem && (
      <>
        {!isLoading && <Workspace problem={problem} boilerPlate={boilerPlate} testCases={testCases} />}
      </>
    )}
  </>
);
};

export default Question;