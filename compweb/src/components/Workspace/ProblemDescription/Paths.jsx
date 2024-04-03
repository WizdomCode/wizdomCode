import React, { useState, useRef } from "react";
import "../../../Fonts.css";
import { Link } from "react-router-dom";
import '../../styles/Workspace.css';
import "../../styles/Paths.css";

const LessonBackgroundRect = (props) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
        <div 
            className={`lesson-background-rect ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h4 className='lesson-category'>{ props.category }</h4>
            <img className="lesson-icon" src={ props.imgPath } alt="sad"></img>
            <h3 className={ props.lessonName.length > 20 ? 'long-lesson-name' : 'lesson-name'}>{ props.lessonName }</h3>
            <div>
                <button className="bottom-rectangle">Start Lesson</button>
            </div>
        </div>
    );
};

const ScrollRow = ({ lessons, unitTitle, unitDescription }) => {
    const scrollContainer = useRef(null);
    const scrollDistance = 200;
    const scrollDuration = 30;
    const scrollInterval = 1;

    const smoothScroll = (end) => {
        if (scrollContainer.current) {
            let start = scrollContainer.current.scrollLeft;
            let change = end - start;
            let currentTime = 0;

            const animateScroll = () => {
                currentTime += scrollInterval;
                const val = Math.easeInOutQuad(currentTime, start, change, scrollDuration);
                scrollContainer.current.scrollLeft = val;
                if(currentTime < scrollDuration) {
                    setTimeout(animateScroll, scrollInterval);
                }
            };
            animateScroll();
        }
    };

    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    const scrollLeft = () => {
        if (scrollContainer.current) {
            smoothScroll(scrollContainer.current.scrollLeft - scrollDistance);
        }
    };

    const scrollRight = () => {
        if (scrollContainer.current) {
            smoothScroll(scrollContainer.current.scrollLeft + scrollDistance);
        }
    };

    return (
        <>
            <div className="hero">
                <div className="wrapper">
                    <div className="unit-header">
                        <div className="unit-header-left">
                            <h1 className='unit-title'>{unitTitle}</h1>
                            <br />
                            <p>{unitDescription}</p>
                        </div>
                        <div className="unit-header-right"><button className="start-button">Start</button></div>
                    </div>
                </div>
            </div>
            <div className='scroll-row'>
                <button onClick={scrollLeft} className="scroll-button left">
                    <img src='/leftarrow.png' alt='Left' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/>
                </button>
                <div className="lesson-wrapper" ref={scrollContainer}>
                    {lessons.map((lesson, index) => (
                        <LessonBackgroundRect key={index} {...lesson} />
                    ))}
                </div>
                <button onClick={scrollRight} className="scroll-button right">
                    <img src='/rightarrow.png' alt='Right' style={{maxWidth: "50px", maxHeight: "50px", background: "transparent"}}/>
                </button>
            </div>
        </>
    );
};

const Paths = (props) => {

    console.log("Paths props:", props);

    const lessons = [
        { category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png" },
        { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png" },
        { category: "7 Problems", lessonName: "Conditions", imgPath: "/open.png" },
        { category: "1 Problem", lessonName: "Arrays", imgPath: "/open.png" },
        { category: "4 Problems", lessonName: "Basic String Manipulation", imgPath: "/open.png" },
        { category: "6 Problems", lessonName: "Arithmetic operations", imgPath: "/open.png" },
        { category: "4 Problems", lessonName: "Nested Loops", imgPath: "/open.png" },
    ];

    const unitTitle = "J1 & J2 & J3: Basic Programming";
    const JUINOR_UNIT_TITLES = ["J1, J2, J3: Basic Programming", "J4: Problem Solving", "J5: Advanced Topics"];
    const JUINOR_UNIT_DESCRIPTIONS = ["", "", ""];
    const JUNIOR_UNIT_LESSONS = [
        [
            { category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png" },
            { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png" },
            { category: "7 Problems", lessonName: "Conditions", imgPath: "/open.png" },
            { category: "1 Problem", lessonName: "Arrays", imgPath: "/open.png" },
            { category: "4 Problems", lessonName: "Basic String Manipulation", imgPath: "/open.png" },
            { category: "6 Problems", lessonName: "Arithmetic operations", imgPath: "/open.png" },
            { category: "4 Problems", lessonName: "Nested Loops", imgPath: "/open.png" },
        ],
        [
            { category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png" },
            { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png" },
            { category: "7 Problems", lessonName: "Conditions", imgPath: "/open.png" },
            { category: "1 Problem", lessonName: "Arrays", imgPath: "/open.png" },
            { category: "4 Problems", lessonName: "Basic String Manipulation", imgPath: "/open.png" },
            { category: "6 Problems", lessonName: "Arithmetic operations", imgPath: "/open.png" },
            { category: "4 Problems", lessonName: "Nested Loops", imgPath: "/open.png" },
        ], 
        [
            { category: "4 Problems", lessonName: "BFS", imgPath: "/open.png" },
            { category: "5 Problems", lessonName: "DFS", imgPath: "/open.png" },
            { category: "4 Problems", lessonName: "Recursion", imgPath: "/open.png" },
            { category: "2 Problems", lessonName: "Dynamic Programming 1", imgPath: "/open.png" }
        ]
    ];
    const unitDescription = "lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs. lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs. lorem impsum adsfjkdsalfjslajf  jfdskaladsjf  fdsjd jf  afl adfs  adfs.";

    return (
        <>
            { 
                props.currentTab === 'Junior' ? (
                    <>
                        {JUNIOR_UNIT_LESSONS.map((lessons, index) => (
                            <React.Fragment key={index}>
                                <ScrollRow lessons={lessons} unitTitle={JUINOR_UNIT_TITLES[index]} unitDescription={JUINOR_UNIT_DESCRIPTIONS[index]} />
                                <br />
                            </React.Fragment>
                        ))}
                        <Link to = "/computercontest">CCC junior</Link> 
                    </>
                ) : props.currentTab === 'Senior' ? (
                    <>
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <Link to = "/computercontest">CCC senior</Link>
                    </>
                
                ) : props.currentTab === 'Bronze' ? (
                    <>
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <Link to = "/computercontest">USACO bronze</Link> 
                    </>
                ) : props.currentTab === 'Silver' ? (
                    <>
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <Link to = "/computercontest">USACO silver</Link> 
                    </>
                ) : props.currentTab === 'Gold' ? (
                    <>
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                        <br />
                        <Link to = "/computercontest">USACO gold</Link> 
                    </>
                ) : (
                <>
                    <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                    <br />
                    <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                    <br />
                    <ScrollRow lessons={lessons} unitTitle={unitTitle} unitDescription={unitDescription} />
                    <br />
                    <Link to = "/computercontest">USACO plat</Link> 
                </>
                )
            }
        </>
    );
};

export default Paths;
