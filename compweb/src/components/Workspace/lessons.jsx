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
    IconBinaryTree,
    IconCardboards,
    IconSearch,
    IconRectangle,
    IconListSearch,
    IconGrid4x4,
    IconNumber2Small,
    IconMathLower,
    IconComponents,
    IconRoute2,
    IconTopologyBus,
    IconSitemap,
    IconBinaryTree2,
    IconSquareRotated,
    IconGrid3x3
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
        [{ category: "4 Problems", lessonName: "Time Complexity", imgPath: <IconClockCode className='lesson-component-icon'/>, problemIds: ["Arranging Books"] }],
        [{ category: "5 Problems", lessonName: "Implementation", imgPath: <IconTool className='lesson-component-icon'/>, problemIds: ["Wait Time", "Arrival Time", "Trianglane"] },
        { category: "7 Problems", lessonName: "Number Theory Basics", imgPath: <IconNumbers className='lesson-component-icon'/>, problemIds: ["Pretty Average Primes"] }],
        [{ category: "1 Problem", lessonName: "Greedy", imgPath: <IconStar className='lesson-component-icon'/>, problemIds: ["Time on task"] }],
    ], 
    [
        [{ category: "4 Problems", lessonName: "Recursion", imgPath: <IconTarget className='lesson-component-icon'/>, problemIds: ["Bananas"] },
        { category: "5 Problems", lessonName: "DFS", imgPath: <IconChartDots3 className='lesson-component-icon'/>, problemIds: ["Unfriend"] }],
        [{ category: "4 Problems", lessonName: "BFS", imgPath: <IconChartDots3 className='lesson-component-icon'/>, problemIds: ["Strategic Bombing"] },
        { category: "2 Problems", lessonName: "Dynamic Programming 1", imgPath: <IconDatabase className='lesson-component-icon'/>, problemIds: ["π-day"] }]
    ]
];


export const SENIOR_UNIT_TITLES = ["S1 & S2: Algorithmic Foundations", "S3: Advanced Data Structures", "S4 & S5: Tough"];
export const SENIOR_UNIT_DESCRIPTIONS = ["", "", ""];
export const SENIOR_UNIT_LESSONS = [
    [
        [{ category: "4 Problems", lessonName: "Implementation", imgPath: <IconTool className='lesson-component-icon'/>, problemIds: ["Good Fours and Good Fives", "Trianglane", "Heavy-Light Composition", "Symmetric Mountains"] },
        { category: "5 Problems", lessonName: "Greedy", imgPath: <IconStar className='lesson-component-icon'/>, problemIds: ["Tandem Bicycle", "Jerseys"] }],
        [{ category: "5 Problems", lessonName: "Data structures", imgPath: <IconBrandDatabricks className='lesson-component-icon'/>, problemIds: ["Sunflowers", "Modern Art", "Good Groups"] }],
        [{ category: "4 Problems", lessonName: "Sorting", imgPath: <IconSortDescending className='lesson-component-icon'/>, problemIds: ["High Tide, Low Tide"] },
        { category: "2 Problems", lessonName: "Simple Math", imgPath: <IconMath1Divide2 className='lesson-component-icon'/>, problemIds: ["Crazy Fencing", "Pretty Average Primes"] }]
    ],
    [
        [{ category: "5 Problems", lessonName: "Implementation", imgPath: <IconTool className='lesson-component-icon'/>, problemIds: ["Quantum Operations", "Absolutely Acidic", "The Geneva Confection"] },
        { category: "4 Problems", lessonName: "AdHoc", imgPath: <IconQuestionMark className='lesson-component-icon'/>, problemIds: ["Swipe"] }],
        [{ category: "7 Problems", lessonName: "Recursion", imgPath: <IconTarget className='lesson-component-icon'/>, problemIds: ["Alice Through the Looking Glass", "Pattern Generator"] }],
        [{ category: "1 Problem", lessonName: "Data Structures", imgPath: <IconBrandDatabricks className='lesson-component-icon'/>, problemIds: ["Firehose", "Gates", "Searching for Strings", "Lunch Concert"] },
        { category: "4 Problems", lessonName: "Graph Theory", imgPath: <IconBinaryTree className='lesson-component-icon'/>, problemIds: ["Spreadsheet", "Friends", "Maze", "Degrees Of Separation", "Phonomenal Reviews", "RoboThieves"] }],
        [{ category: "6 Problems", lessonName: "Math", imgPath: <IconMath className='lesson-component-icon'/>, problemIds: ["Tin Can Telephone", "Nailed It!"] }],
    ], 
    [
        [{ category: "4 Problems", lessonName: "Data Structures", imgPath: <IconBrandDatabricks className='lesson-component-icon'/>, problemIds: ["Tinted Glass Window", "Wireless", "Triangle: The Data Structure"] },
        { category: "5 Problems", lessonName: "Graph Theory", imgPath: <IconBinaryTree className='lesson-component-icon'/>, problemIds: ["Shop and Ship", "Animal Farm", "Blood Distribution", "Who is Taller?", "Convex Hull", "Origin of Life", "Switch"] }],
        [{ category: "4 Problems", lessonName: "Dynamic Programming", imgPath: <IconDatabase className='lesson-component-icon'/>, problemIds: ["Waterpark", "Balanced Trees", "Tourism", "Super Plumber", "Bowling for Numbers", "Nukit", "Nutrient Tree", "Mouse Journey", "Lazy Fox", "Greedy For Pies", "Good Influencers"] }],
        [{ category: "2 Problems", lessonName: "Math", imgPath: <IconMath className='lesson-component-icon'/>, problemIds: ["Groups", "Factor Solitaire", "Josh's Double Bacon Deluxe", "Math Homework"] }]
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
        [{ category: "5 Problems", lessonName: "Sorting", imgPath: <IconSortDescending className='lesson-component-icon'/>, problemIds: ["Why Did the Cow Cross the Road III", "Cow College", "Angry Cows (Bronze)"] },
        { category: "7 Problems", lessonName: "Simulation", imgPath: <IconCardboards className='lesson-component-icon'/>, problemIds: ["Shell Game", "Speeding Ticket", "Mixing Milk", "The Bucket List", "Measuring Traffic", "Block Game", "Team Tic Tac Toe", "Milk Measurement", "Stuck in a Rut (Bronze)"] }],
        [{ category: "7 Problems", lessonName: "Complete Search", imgPath: <IconSearch className='lesson-component-icon'/>, problemIds: ["Daisy Chains", "Counting Liars", "Cow Gymnastics", "Lifeguards", "Why Did the Cow Cross the Road II", "Guess the Animal", "Sleeping in Class", "Cowntact Tracing", "Moo Language"] }],
        [{ category: "7 Problems", lessonName: "Ad Hoc", imgPath: <IconQuestionMark className='lesson-component-icon'/>, problemIds: ["Milking Order", "Sleepy Cow Herding", "Hoofball", "FEB"] },
        { category: "7 Problems", lessonName: "Greedy", imgPath: <IconStar className='lesson-component-icon'/>, problemIds: ["Mad Scientist", "Cow Tipping", "Even More Odd Photos", "Out of Place", "Photoshoot", "Watching Mooloo", "Race"] }],
        [{ category: "7 Problems", lessonName: "Data Structures", imgPath: <IconBrandDatabricks className='lesson-component-icon'/>, problemIds: ["Where Am I?", "Year of the Cow", "Don't Be Last!"] },
        { category: "7 Problems", lessonName: "Graph Theory", imgPath: <IconBinaryTree className='lesson-component-icon'/>, problemIds: ["Livestock Lineup", "The Great Revegetation", "Milk Factory", "Swapity Swap"] }],
        [{ category: "7 Problems", lessonName: "Rectangle Geometry", imgPath: <IconRectangle className='lesson-component-icon'/>, problemIds: ["Fence Painting", "Blocked Billboard", "Square Pasture", "Blocked Billboard II"] }],
        [{ category: "7 Problems", lessonName: "Recursion", imgPath: <IconTarget className='lesson-component-icon'/>, problemIds: ["Air Cownditioning II", "Livestock Lineup", "Back and Forth"] }],
    ]
];

export const SILVER_UNIT_TITLES = ["USACO Silver"];
export const SILVER_UNIT_DESCRIPTIONS = [""];
export const SILVER_UNIT_LESSONS = [
    [
        [{ category: "5 Problems", lessonName: "Binary Search", imgPath: <IconListSearch className='lesson-component-icon'/>, problemIds: ["Counting Haybales", "Cow Dance Show", "Convention", "Angry Cows", "Social Distancing", "Bakery", "Loan Repayment"] }], 
        [{ category: "7 Problems", lessonName: "Depth First Search", imgPath: <IconChartDots3 className='lesson-component-icon'/>, problemIds: ["Fence Planning", "Wormhole Sort", "Connecting Two Barns", "Cereal 2"] }, 
        { category: "7 Problems", lessonName: "Flood Fill", imgPath: <IconGrid4x4 className='lesson-component-icon'/>, problemIds: ["Icy Perimeter", "Mooyo Mooyo", "Comfortable Cows", "Snow Boots", "Maze Tac Toe", "Multiplayer Moo"] }],
        [{ category: "7 Problems", lessonName: "Prefix Sums", imgPath: <IconBracketsContain className='lesson-component-icon'/>, problemIds: ["Breed Counting", "Subsequences Summing to Sevens", "Hoof, Paper, Scissors", "Painting the Barn", "Rectangular Pasture"] },
        { category: "7 Problems", lessonName: "Two Pointers", imgPath: <IconNumber2Small className='lesson-component-icon'/>, problemIds: ["Paired Up", "Diamond Collector", "Sleepy Cow Herding"] }],
        [{ category: "7 Problems", lessonName: "Greedy", imgPath: <IconStar className='lesson-component-icon'/>, problemIds: ["Lemonade Line", "High Card Wins", "Rest Stops", "Berry Picking", "Closest Cow Wins"] }],
        [{ category: "7 Problems", lessonName: "Trees", imgPath: <IconBinaryTree className='lesson-component-icon'/>, problemIds: ["Cowntagion", "Clock Tree"] },
        { category: "7 Problems", lessonName: "Custom Comparators", imgPath: <IconMathLower className='lesson-component-icon'/>, problemIds: ["Wormhole Sort", "Rectangular Pasture", "Rental Service", "Mountain View", "Stuck in a Rut", "Triangles", "Out of Sorts", "Meetings"] }],
    ]
];

export const GOLD_UNIT_TITLES = ["USACO Gold"];
export const GOLD_UNIT_DESCRIPTIONS = [""];
export const GOLD_UNIT_LESSONS = [
    [
        [{ category: "7 Problems", lessonName: "Dynamic Programming", imgPath: <IconDatabase className='lesson-component-icon'/>, problemIds: ["Time is Mooney", "Teamwork", "Snakes", "Taming the Herd", "Drought", "Stamp Painting", "Bovine Genetics", "Talent Show", "Cow Poetry", "Exercise", "Lights Off", "Uddered but not Herd", "Redistributing Gifts", "Farmer John Solves 3SUM", "Modern Art 3", "248", "Piling Papers", "Count the Cows"] }],
        [{ category: "5 Problems", lessonName: "Combinatorics", imgPath: <IconComponents className='lesson-component-icon'/>, problemIds: ["Cowpatibility", "Help Yourself", "Cow Camp"] }],
        [{ category: "7 Problems", lessonName: "Shortest Paths", imgPath: <IconRoute2 className='lesson-component-icon'/>, problemIds: ["Lasers and Mirrors", "Cow at Large", "Replication", "A Pie for a Pie", "Moortal Cowmbat", "Milk Pumping", "Why Did the Cow Cross the Road", "Fine Dining", "Shortcut"] },
        { category: "7 Problems", lessonName: "Topological Sort", imgPath: <IconTopologyBus className='lesson-component-icon'/>, problemIds: ["Timeline"] }],
        [{ category: "7 Problems", lessonName: "Euler Tour", imgPath: <IconChartDots3 className='lesson-component-icon'/>, problemIds: ["Cow Land", "Milk Visits"] }],
        [{ category: "7 Problems", lessonName: "Union Find", imgPath: <IconSitemap className='lesson-component-icon'/>, problemIds: ["Closing the Farm", "MooTube", "Moocast", "Strongest Friendship Group", "Favorite Colors"] },
        { category: "7 Problems", lessonName: "Minimum Spanning Trees", imgPath: <IconBinaryTree2 className='lesson-component-icon'/>, problemIds: ["Fenced In", "Moo Network", "I Would Walk 500 Miles", "Portals"] }],
        [{ category: "7 Problems", lessonName: "Point Update Range Sum", imgPath: <IconBinaryTree className='lesson-component-icon'/>, problemIds: ["Haircut", "Balanced Photo", "Sleepy Cow Sorting"] }],
        [{ category: "7 Problems", lessonName: "String Hashing", imgPath: <IconBlockquote className='lesson-component-icon'/>, problemIds: ["Bovine Genomics", "Lights Out"] }],
    ]
];

export const PLAT_UNIT_TITLES = ["USACO Platinum"];
export const PLAT_UNIT_DESCRIPTIONS = [""];
export const PLAT_UNIT_LESSONS = [
    [
        [{ category: "5 Problems", lessonName: "Segment Trees", imgPath: <IconBinaryTree className='lesson-component-icon'/>, problemIds: ["Pareidolia", "High Card Low Card (Platinum)", "Slingshot", "Load Balancing", "Sort It Out", "Bessie's Snow Cow", "Why Did the Cow Cross the Road III (Platinum)", "Mowing the Field"] },
        { category: "5 Problems", lessonName: "Advanced Tree Techniques", imgPath: <IconBinaryTree2 className='lesson-component-icon'/>, problemIds: ["262144", "Max Flow", "Disruption", "New Barns", "The Cow Gathering", "Exercise Route"] }],
        [{ category: "5 Problems", lessonName: "Dynamic Programming", imgPath: <IconDatabase className='lesson-component-icon'/>, problemIds: ["Mowing Mischief"] }],
        [{ category: "5 Problems", lessonName: "Computational Geometry", imgPath: <IconSquareRotated className='lesson-component-icon'/>, problemIds: ["Balance Beam", "Circular Barn", "Falling Portals"] },
        { category: "5 Problems", lessonName: "Matrix Exponentiation", imgPath: <IconGrid3x3 className='lesson-component-icon'/>, problemIds: ["COWBASIC"] }],
    ]
];