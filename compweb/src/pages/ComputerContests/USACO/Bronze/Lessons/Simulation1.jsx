import React, {useState}from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../../../components/Navigation/Navigation";
import "../../../../../components/styles/globals.css";
import Question from "../../../../../components/Question";
import Workspace from "../../../../../components/Workspace/Workspace";

const Simulation1 = () => {
    const [problem, setProblem] = useState(null);
    const [cases, setCases] = useState(null);

    return (
        <>
            <Navigation></Navigation>
            <h1>Simulation</h1>
            <button
            type="button"
            onClick={() => {
                setProblem("shellGame");
                setCases("shellGameCases");
            }}>Shell Game</button>
             <button
            type="button"
            onClick={() => {
                setProblem("Mixing Milk");
                setCases("mixingMilkCases");
            }}>Mixing Milk</button>
            <button
            type="button"
            onClick={() => {
                setProblem("theCowSignal");
                setCases("theCowSignalCases");
            }}>theCowSignal</button>
            <Question questionID={problem} testCaseFolder={cases} />
            <Link to = "/bronze">Back to bronze</Link>
        </>
    );
};

export default Simulation1;