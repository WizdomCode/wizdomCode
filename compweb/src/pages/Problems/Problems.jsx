import React from "react";
import Navigation from "../components/Navigation/Navigation";
import Workspace from "../../components/Workspace/Workspace";

const Home = () => {
    return (
        <>
            <Navigation></Navigation>
            <h1>Home</h1>
            <p>Problems.jsx</p>
            <Workspace />
        </>
    );
};

export default Home;