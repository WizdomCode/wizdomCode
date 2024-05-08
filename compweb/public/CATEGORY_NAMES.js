// Define the categories and subcategories
const categories = {
  "String Algorithms": ["String Hashing", "Basic string manipulation"],
  "Graph Theory": ["Depth First Search", "Breadth-first search", "Flood Fill", "Union Find", "Shortest Path", "Topological Sort", "Minimum Spanning Trees", "Euler Tour"],
  "Ad Hoc": [],
  "Dynamic Programming": ["Advanced Dynamic Programming", "Dynamic Programming Basics"],
  "Greedy Algorithms": ["Greedy Sorting", "Greedy"],
  "Data Structures": ["Sorting", "Trees", "Segment Trees", "Advanced Tree Techniques", "Arrays"],
  "Math": ["Simple Math", "Combinatorics", "Matrix Exponentiation", "Number Theory Basics", "Arithmetic operations", "Rectangle Geometry"],
  "Implementation": ["Basic syntax", "Conditions", "Loops", "Nested Loops", "Simulation", "Complete Search", "Custom Comparators", "Point Update Range Sum", "Time Complexity", "Recursion", "Prefix Sum", "Binary Search", "Two Pointers"]
};

// Create a mapping of subcategories to categories
let subcategoryToCategory = {};
for (let category in categories) {
  for (let subcategory of categories[category]) {
    subcategoryToCategory[subcategory] = category;
  }
}

// Function to get the category from a subcategory
export function getCategory(subcategory) {
  return subcategoryToCategory[subcategory];
}

// Get difficulty of question

const difficultyLevels = [
    { level: 'Beginner', number: 0, range: [3, 3] },
    { level: 'Intermediate', number: 1, range: [5, 7] },
    { level: 'Advanced', number: 2, range: [10, 12] },
    { level: 'Expert', number: 3, range: [15, 17] },
    { level: 'Master', number: 4, range: [20, Infinity] },
];

export function getDifficultyLevel(input) {
    for (let i = 0; i < difficultyLevels.length; i++) {
        const { level, number, range } = difficultyLevels[i];
        if (input >= range[0] && input <= range[1]) {
            return { level, number };
        }
    }
    return { level: 'Unknown', number: -1 };
}
