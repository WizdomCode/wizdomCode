import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation";

const ComputerContest = () => {
    return (
        <>
            <Navigation></Navigation>
            <h1>Computer Contest</h1>
            <p>Learn comeptitve programming today!</p>
            <Link to = "/usaco">USACO CONTESTS</Link>
        </>
    );
};

export default ComputerContest;