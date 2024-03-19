import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../../components/Navigation/Navigation";

const Bronze = () => {
    return (
        <>
            <Navigation></Navigation>
            <h1>Bronze</h1>
            <p>Learn comeptitve programming today!</p>
            <Link to = "/adhoc">AdHoc</Link>
            <Link to = "/completesearch">CompleteSearch</Link>
            <Link to = "/datastructures">DataStructures</Link>
            <Link to = "/graphs">Graphs</Link>
            <Link to = "/greedyalgorithims">GreedyAlgorithims</Link>
            <Link to = "/rectanglegeometry">RectangleGeometry</Link>
            <Link to = "/recursion">Recursion</Link>
            <Link to = "/simulation">Simulation</Link>
            <Link to = "/sorting">Sorting</Link>
            <div>
                <Link to="/usaco">USACO</Link>
            </div>
        </>
    );
};

export default Bronze;