import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../../components/Navigation/Navigation";

const Platinum = () => {
    return (
        <>
            <Navigation />
            <h1>Platinum</h1>
            <p>Master advanced competitive programming topics!</p>
            <ul>
                <li>
                    <Link to="/segmenttrees">Segment Trees</Link>
                </li>
                <li>
                    <Link to="/advancedtreetechniques">Advanced Tree Techniques</Link>
                </li>
                <li>
                    <Link to="/advanceddynamicprogramming">Advanced Dynamic Programming</Link>
                </li>
                <li>
                    <Link to="/computationalgeometry">Computational Geometry</Link>
                </li>
                <li>
                    <Link to="/matrixexponentiation">Matrix Exponentiation</Link>
                </li>
            </ul>
            <Link to="/usaco">Back to USACO</Link>
        </>
    );
};

export default Platinum;
