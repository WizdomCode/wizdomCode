import language from "react-syntax-highlighter/dist/esm/languages/hljs/1c";

export const TEMPLATES = [
  {
    "id": 1,
    "parent": 0,
    "droppable": true,
    "text": "Python"
  },
  {
    "id": 2,
    "parent": 0,
    "droppable": true,
    "text": "Java"
  },
  {
    "id": 3,
    "parent": 0,
    "droppable": true,
    "text": "C++"
  },
  {
    "id": 4,
    "parent": 1,
    "text": "Depth-First Search (DFS)",
    "data": {
        "language": 'python',
        "code":
`python dfs template`
    }
  }
];
