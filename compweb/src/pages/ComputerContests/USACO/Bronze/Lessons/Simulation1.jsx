import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../../../components/Navigation/Navigation";
import "../../../../../components/styles/globals.css";
import Question from "../../../../Problems/Question";
import Workspace from "../../../../../components/Workspace/Workspace";

const Simulation1 = () => {
    return (
        <>
            <Navigation></Navigation>
            <h1>Simulation</h1>
            <Question questionID={"cowq1"} />
            <Question questionID={"shellGame"} />
            <Link to = "/bronze">Back to bronze</Link>
        </>
    );
};

export default Simulation1;
