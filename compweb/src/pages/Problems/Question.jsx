import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, ap, db } from "../../firebase";
import { addDoc, collection, getDoc, doc } from "firebase/firestore";
import Navigation from "../../components/Navigation/Navigation";
import "../../components/styles/globals.css";
import Workspace from "../../components/Workspace/Workspace";

const Question = () => {
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    // Fetch problem data from Firebase
    const fetchProblemData = async () => {
      try {
        const docRef = await getDoc(doc(db, "Questions", "uwlAqPacBFn2NrdT0vJR")); // replace "your_document_id" with the actual document ID
        if (docRef.exists()) {
          setProblem(docRef.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchProblemData();
  }, []); // Run the effect once on component mount

  const boilerPlate = `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d %d", a + 2, b + 2);
    return 0;
}`;

  const testCases = [
    {
      key: 'testCase1',
      input: '1 2',
      output: '3 4',
    },
    {
      key: 'testCase2',
      input: '5 6',
      output: '7 8',
    },
    {
      key: 'testCase3',
      input: '9 10',
      output: '11 12',
    },
    // Add more test cases as needed
  ];

  return (
    <>
      <Navigation></Navigation>
      {problem && (
        <>
          <h1>{problem.title}</h1>
          <Workspace problem={problem} boilerPlate={boilerPlate} testCases={testCases} />
          <Link to="/simulation">Back to simulation</Link>
        </>
      )}
    </>
  );
};

export default Question;
