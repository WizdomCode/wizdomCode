import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../../components/Navigation/Navigation";

const Silver = () => {
    return (
        <>
            <Navigation />
            <h1>Silver</h1>
            <p>Learn competitive programming today!</p>
            <ul>
                <li>
                    <Link to="/binarysearch">Binary Search</Link>
                </li>
                <li>
                    <Link to="/prefixsums">Prefix Sums</Link>
                </li>
                <li>
                    <Link to="/twopointers">Two Pointers</Link>
                </li>
                <li>
                    <Link to="/depthfirstsearch">Depth First Search</Link>
                </li>
                <li>
                    <Link to="/floodfill">Flood Fill</Link>
                </li>
                <li>
                    <Link to="/trees">Trees</Link>
                </li>
                <li>
                    <Link to="/customcomparators">Custom Comparators</Link>
                </li>
                <li>
                    <Link to="/greedysorting">Greedy Sorting</Link>
                </li>
            </ul>
            <Link to="/usaco">back to usaco</Link>
        </>
    );
};

export default Silver;