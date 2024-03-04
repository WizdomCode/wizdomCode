import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../../../components/Navigation/Navigation";
import "../../../../../components/styles/globals.css";
import Workspace from "../../../../../components/Workspace/Workspace";

const Simulation1 = () => {
    const problem = {
        title: "Problem Statement",
        description: "Given a list of integers, find the maximum sum of any contiguous subarray within the list.",
        inputFormat: "The first line contains a single integer T, the number of test cases. Each test case consists of a single line with a single integer N, the size of the list, followed by N integers representing the list.",
        constraints: ["1 ≤ T ≤ 10", "1 ≤ N ≤ 10^5", "-10^9 ≤ A[i] ≤ 10^9"],
        outputFormat: "For each test case, output a single integer, the maximum sum of any contiguous subarray within the list."
    };
    const boilerPlate = `function solution(a, b) {
    // Write your code here
};`
    // Test cases with inputs and expected outputs
    const testCases = [
        {
        key: 'testCase1',
        input: [1, 2],
        output: '3 4',
        },
        {
        key: 'testCase2',
        input: [5, 6],
        output: '7 8',
        },
        {
        key: 'testCase3',
        input: [9, 10],
        output: '11 12',
        },
        // Add more test cases as needed
    ];

    return (
        <>
            <Navigation></Navigation>
            <h1>Simulation</h1>
            <Workspace problem={problem} boilerPlate={boilerPlate} testCases={testCases}/>
            <Link to = "/bronze">Back to bronze</Link>
        </>
    );
};

export default Simulation1;
