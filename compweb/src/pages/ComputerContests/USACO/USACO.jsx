import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../components/Navigation/Navigation";

const USACO = () => {
    return (
        <>
            <Navigation></Navigation>
            <h1>USACO</h1>
            <p>Learn comeptitve programming today!</p>
            <Link to = "/bronze">Bronze CONTESTS</Link>
        </>
    );
};

export default USACO;