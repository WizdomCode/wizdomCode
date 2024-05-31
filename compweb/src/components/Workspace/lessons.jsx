import React from 'react'
import {
    IconBraces,
    IconPlusMinus,
    IconRepeat,
    IconCheckbox,
    IconBracketsContain,
    IconBlockquote,
    IconClockCode,
    IconTool,
    IconNumbers,
    IconStar,
    IconTarget,
    IconChartDots3,
    IconDatabase,
    IconBrandDatabricks,
    IconSortDescending,
    IconMath1Divide2,
    IconMath,
    IconQuestionMark,
    IconBinaryTree
} from '@tabler/icons-react'
import "../styles/Paths.css";

export const JUINOR_UNIT_TITLES = ["J1, J2, J3: Basic Programming", "J4: Problem Solving", "J5: Advanced Topics"];
export const JUINOR_UNIT_DESCRIPTIONS = ["", "", ""];
export const JUNIOR_UNIT_LESSONS = [
    [
        [{ category: "5 Problems", lessonName: "Basic Syntax", imgPath: <IconBraces className="lesson-component-icon"/>, problemIds: ["Next in line", "Who is in the Middle?", "Squares", "Conveyor Belt Sushi", "Cupcake Party"] },
        { category: "6 Problems", lessonName: "Arithmetic operations", imgPath: <IconPlusMinus className="lesson-component-icon"/>, problemIds: ["Shifty Sum", "Epidemiology", "Magic Squares", "Fergusonball Ratings", "Mod Inverse", "Who Has Seen The Wind"] }],
        [{ category: "4 Problems", lessonName: "Loops", imgPath: <IconRepeat className="lesson-component-icon"/>, problemIds: ["Tournament Selection"] },
        { category: "7 Problems", lessonName: "Conditions", imgPath: <IconCheckbox className='lesson-component-icon'/>, problemIds: ["Special Day", "Triangle Times", "Winning Score", "Telemarketor or not?", "Quadrant Selection", "Speed fines are not fine!"] }],
        [{ category: "1 Problem", lessonName: "Arrays", imgPath: <IconBracketsContain className='lesson-component-icon'/>, problemIds: ["Occupy parking"] }],
        [{ category: "4 Problems", lessonName: "Basic String Manipulation", imgPath: <IconBlockquote className='lesson-component-icon'/>, problemIds: ["Happy or Sad", "Time to Decompress", "I Speak TXTMSG"] },
        { category: "4 Problems", lessonName: "Nested Loops", imgPath: <IconRepeat className="lesson-component-icon"/>, problemIds: ["Smile with Similes", "Harp Tuning", "Special Event"] }],
    ],
    [
        [{ category: "4 Problems", lessonName: "Time Complexity", imgPath: <IconClockCode className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "5 Problems", lessonName: "Implementation", imgPath: <IconTool className='lesson-component-icon'/>, problemIds: ["Wait Time", "Arrival Time", "Trianglane"] },
        { category: "7 Problems", lessonName: "Number Theory Basics", imgPath: <IconNumbers className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "1 Problem", lessonName: "Greedy", imgPath: <IconStar className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
    ], 
    [
        [{ category: "4 Problems", lessonName: "Recursion", imgPath: <IconTarget className='lesson-component-icon'/>, problemIds: ["Epidemiology"] },
        { category: "5 Problems", lessonName: "DFS", imgPath: <IconChartDots3 className='lesson-component-icon'/>, problemIds: ["Unfriend"] }],
        [{ category: "4 Problems", lessonName: "BFS", imgPath: <IconChartDots3 className='lesson-component-icon'/>, problemIds: ["Strategic Bombing"] },
        { category: "2 Problems", lessonName: "Dynamic Programming 1", imgPath: <IconDatabase className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }]
    ]
];


export const SENIOR_UNIT_TITLES = ["S1 & S2: Algorithmic Foundations", "S3: Advanced Data Structures", "S4 & S5: Tough"];
export const SENIOR_UNIT_DESCRIPTIONS = ["", "", ""];
export const SENIOR_UNIT_LESSONS = [
    [
        [{ category: "4 Problems", lessonName: "Implementation", imgPath: <IconTool className='lesson-component-icon'/>, problemIds: ["Epidemiology"] },
        { category: "5 Problems", lessonName: "Greedy", imgPath: <IconStar className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "5 Problems", lessonName: "Data structures", imgPath: <IconBrandDatabricks className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "4 Problems", lessonName: "Sorting", imgPath: <IconSortDescending className='lesson-component-icon'/>, problemIds: ["Epidemiology"] },
        { category: "2 Problems", lessonName: "Simple Math", imgPath: <IconMath1Divide2 className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }]
    ],
    [
        [{ category: "5 Problems", lessonName: "Implementation", imgPath: <IconTool className='lesson-component-icon'/>, problemIds: ["Epidemiology"] },
        { category: "4 Problems", lessonName: "AdHoc", imgPath: <IconQuestionMark className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Recursion", imgPath: <IconTarget className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "1 Problem", lessonName: "Data Structures", imgPath: <IconBrandDatabricks className='lesson-component-icon'/>, problemIds: ["Epidemiology"] },
        { category: "4 Problems", lessonName: "Graph Theory", imgPath: <IconBinaryTree className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "6 Problems", lessonName: "Math", imgPath: <IconMath className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
    ], 
    [
        [{ category: "4 Problems", lessonName: "Data Structures", imgPath: <IconBrandDatabricks className='lesson-component-icon'/>, problemIds: ["Epidemiology"] },
        { category: "5 Problems", lessonName: "Graph Theory", imgPath: <IconBinaryTree className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "4 Problems", lessonName: "Dynamic Programming", imgPath: <IconDatabase className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "2 Problems", lessonName: "Math", imgPath: <IconMath className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }]
    ]
];

export const TEST_UNIT_LESSONS = [
    [
        [{ category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png", problemIds: ["Epidemiology"] }, { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Conditions", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png", problemIds: ["Epidemiology"] }, { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png", problemIds: ["Epidemiology"] }, { category: "6 Problems", lessonName: "Arithmetic operations", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
    ],
    [
        [{ category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png", problemIds: ["Epidemiology"] }, { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Conditions", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png", problemIds: ["Epidemiology"] }, { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png", problemIds: ["Epidemiology"] }, { category: "6 Problems", lessonName: "Arithmetic operations", imgPath: "/open.png", problemIds: ["Epidemiology"] }],    ], 
    [
        [{ category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png", problemIds: ["Epidemiology"] }, { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Conditions", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "5 Problems", lessonName: "Basic Syntax", imgPath: "/open.png", problemIds: ["Epidemiology"] }, { category: "4 Problems", lessonName: "Loops", imgPath: "/open.png", problemIds: ["Epidemiology"] }, { category: "6 Problems", lessonName: "Arithmetic operations", imgPath: "/open.png", problemIds: ["Epidemiology"] }],    ]
];

export const BRONZE_UNIT_TITLES = ["USACO Bronze"];
export const BRONZE_UNIT_DESCRIPTIONS = [""];
export const BRONZE_UNIT_LESSONS = [
    [
        [{ category: "5 Problems", lessonName: "Sorting", imgPath: <IconSortDescending className='lesson-component-icon'/>, problemIds: ["Epidemiology"] },
        { category: "7 Problems", lessonName: "Simulation", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Complete Search", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Ad Hoc", imgPath: <IconQuestionMark className='lesson-component-icon'/>, problemIds: ["Epidemiology"] },
        { category: "7 Problems", lessonName: "Greedy", imgPath: <IconStar className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Data Structures", imgPath: <IconBrandDatabricks className='lesson-component-icon'/>, problemIds: ["Epidemiology"] },
        { category: "7 Problems", lessonName: "Graph Theory", imgPath: <IconBinaryTree className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Rectangle Geometry", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Recursion", imgPath: <IconTarget className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
    ]
];

export const SILVER_UNIT_TITLES = ["USACO Silver"];
export const SILVER_UNIT_DESCRIPTIONS = [""];
export const SILVER_UNIT_LESSONS = [
    [
        [{ category: "5 Problems", lessonName: "Binary Search", imgPath: "/open.png", problemIds: ["Epidemiology"] }], 
        [{ category: "7 Problems", lessonName: "Depth First Search", imgPath: "/open.png", problemIds: ["Epidemiology"] }, 
        { category: "7 Problems", lessonName: "Flood Fill", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Prefix Sums", imgPath: "/open.png", problemIds: ["Epidemiology"] },
        { category: "7 Problems", lessonName: "Two Pointers", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Greedy", imgPath: <IconStar className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Trees", imgPath: "/open.png", problemIds: ["Epidemiology"] },
        { category: "7 Problems", lessonName: "Custom Comparators", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
    ]
];

export const GOLD_UNIT_TITLES = ["USACO Gold"];
export const GOLD_UNIT_DESCRIPTIONS = [""];
export const GOLD_UNIT_LESSONS = [
    [
        [{ category: "7 Problems", lessonName: "Dynamic Programming", imgPath: <IconDatabase className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "5 Problems", lessonName: "Combinatorics", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Shortest Paths", imgPath: "/open.png", problemIds: ["Epidemiology"] },
        { category: "7 Problems", lessonName: "Topological Sort", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Union Find", imgPath: "/open.png", problemIds: ["Epidemiology"] },
        { category: "7 Problems", lessonName: "Minimum Spanning Trees", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "Point Update Range Sum", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "7 Problems", lessonName: "String Hashing", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
    ]
];

export const PLAT_UNIT_TITLES = ["USACO Platinum"];
export const PLAT_UNIT_DESCRIPTIONS = [""];
export const PLAT_UNIT_LESSONS = [
    [
        [{ category: "5 Problems", lessonName: "Segment Trees", imgPath: "/open.png", problemIds: ["Epidemiology"] },
        { category: "5 Problems", lessonName: "Advanced Tree Techniques", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
        [{ category: "5 Problems", lessonName: "Dynamic Programming", imgPath: <IconDatabase className='lesson-component-icon'/>, problemIds: ["Epidemiology"] }],
        [{ category: "5 Problems", lessonName: "Computational Geometry", imgPath: "/open.png", problemIds: ["Epidemiology"] },
        { category: "5 Problems", lessonName: "Matrix Exponentiation", imgPath: "/open.png", problemIds: ["Epidemiology"] }],
    ]
];