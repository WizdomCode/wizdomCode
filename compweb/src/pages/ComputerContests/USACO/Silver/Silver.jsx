import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../../../../components/Navigation/Navigation";

const Silver = () => {
    return (
        <>
            <Navigation></Navigation>
            <h1>Silver</h1>
            <p>Learn comeptitve programming today!</p>
            <Link to = "/bfs2">BFS 2</Link>
            <div>
                <Link to="/silver">Silver</Link>
            </div>
        </>
    );
};

export default Silver;