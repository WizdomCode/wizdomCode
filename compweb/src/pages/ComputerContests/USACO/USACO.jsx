import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../components/Navigation/Navigation";

const USACO = () => {
    return (
        <>
            <Navigation></Navigation>
            <h1>USACO</h1>
            <p>Learn comeptitve programming today!</p>
            <div>
                <Link to="/bronze">Bronze CONTESTS</Link>
            </div>
            <div>
                <Link to="/silver">Silver CONTESTS</Link>
            </div>
            <div>
                <Link to="/gold">Gold CONTESTS</Link>
            </div>
            <div>
                <Link to="/platinum">Platinum CONTESTS</Link>
            </div>
            <div>
                <Link to="/computercontest">Computer CONTESTS</Link>
            </div>
        </>
    );
};

export default USACO;