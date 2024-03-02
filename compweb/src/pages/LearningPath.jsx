import React from "react";
import Navigation from "../components/Navigation/Navigation";
import { Link } from "react-router-dom";

const LearningPath = () => {
    return (
        <>
            <Navigation></Navigation>
            <h1>Learning Paths</h1>
            <p>Learn comeptitve programming today!</p>
            <Link to = "/computercontest">COMPUTER CONTESTS</Link>
        </>
    );
};

export default LearningPath;