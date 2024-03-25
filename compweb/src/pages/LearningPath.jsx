import React, { useState } from "react";
import Navigation from "../components/Navigation/Navigation";
import { Link } from "react-router-dom";
import "../Paths.css";

const LessonBackgroundRect = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`lesson-background-rect ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h4>Category</h4>
            <img className="lesson-icon" src="/logo192.png" alt="sad"></img>
            <h3>Lesson name</h3>
            <div className="bottom-rectangle">
                <button>Click me</button>
            </div>
        </div>
    );
};

const LearningPath = () => {
    return (
        <>
            <Navigation></Navigation>
            <div className="hero">
                <div className="wrapper">
                    <div className="unit-header">
                        <div className="unit-header-left">
                            <h1>Learning Paths</h1>
                            <br />
                            <p>lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                            lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                            lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.
                            </p>
                        </div>
                        <div className="unit-header-right"><p>Button</p></div>
                    </div>
                </div>
            </div>
            <div className="lesson-wrapper">
                <LessonBackgroundRect />
                <LessonBackgroundRect />
                <LessonBackgroundRect />
                <LessonBackgroundRect />
                <LessonBackgroundRect />
            </div>
            <Link to = "/computercontest">COMPUTER CONTESTS</Link>
        </>
    );
};

export default LearningPath;
