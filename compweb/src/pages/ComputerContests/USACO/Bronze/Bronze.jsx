import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../../components/Navigation/Navigation";

const Bronze = () => {
    return (
        <>
            <Navigation></Navigation>
            <h1>Bronze</h1>
            <p>Learn comeptitve programming today!</p>
            <Link to = "/simulation1">Simulation</Link>
        </>
    );
};

export default Bronze;