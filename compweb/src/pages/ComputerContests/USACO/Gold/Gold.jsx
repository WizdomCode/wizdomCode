import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../../components/Navigation/Navigation";

const Gold = () => {
    return (
        <>
            <Navigation />
            <h1>Gold</h1>
            <p>Learn advanced competitive programming topics!</p>
            <ul>
                <li>
                    <Link to="/combinatorics">Combinatorics</Link>
                </li>
                <li>
                    <Link to="/dynamicprogramming">Dynamic Programming</Link>
                </li>
                <li>
                    <Link to="/unionfind">Union Find</Link>
                </li>
                <li>
                    <Link to="/shortestpaths">Shortest Paths</Link>
                </li>
                <li>
                    <Link to="/pointupdaterangesum">Point Update Range Sum</Link>
                </li>
                <li>
                    <Link to="/topologicalsort">Topological Sort</Link>
                </li>
                <li>
                    <Link to="/minimumspanningtrees">Minimum Spanning Trees</Link>
                </li>
                <li>
                    <Link to="/eulertour">Euler Tour</Link>
                </li>
                <li>
                    <Link to="/stringhashing">String Hashing</Link>
                </li>
            </ul>
            <Link to="/usaco">Back to USACO</Link>
        </>
    );
};

export default Gold;