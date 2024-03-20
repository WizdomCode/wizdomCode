import React, {useState}from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../../../components/Navigation/Navigation";
import "../../../../../components/styles/globals.css";
import Question from "../../../../../components/Question";

const FloodFill = () => {
    const [problem, setProblem] = useState(null);
    const [cases, setCases] = useState(null);

    return (
        <>
            <Navigation></Navigation>
            <h1>FloodFill</h1>
            <button
            type="button"
            onClick={() => {
                setProblem("shellGame");
                setCases("shellGameCases");
            }}>Shell Game</button>
            <Question questionID={problem} testCaseFolder={cases} />
            <Link to = "/silver">Back to silver</Link>
        </>
    );
};

export default FloodFill;