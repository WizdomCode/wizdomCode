import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../components/Navigation/Navigation";
import IDE from "../../../components/Workspace/ProblemDescription/IDE";
import { Provider } from 'react-redux';

const USACO = () => {
    return (
        <>
            <IDE currentPage="usaco"/>
        </>
    );
};

export default USACO;