import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import SignUp from "./pages/SignUp";
import LearningPath from "./pages/LearningPath";
import ComputerContest from "./pages/ComputerContests/ComputerContest";
import USACO from "./pages/ComputerContests/USACO/USACO";
import Bronze from "./pages/ComputerContests/USACO/Bronze/Bronze";
import Simulation1 from "./pages/ComputerContests/USACO/Bronze/Lessons/Simulation1";
import Silver from "./pages/ComputerContests/USACO/Silver/Silver";
import BFS2 from "./pages/ComputerContests/USACO/Silver/Lessons/BFS2";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/learningpath" element={<LearningPath />} />
      <Route path="/computercontest" element={<ComputerContest />} />
      <Route path="/usaco" element={<USACO />} />
      <Route path="/bronze" element={<Bronze />} />
      <Route path="/simulation1" element={<Simulation1 />} />
      <Route path="/silver" element={<Silver />} />
      <Route path="/bfs2" element={<BFS2 />} />
    </Routes>
  );
}

export default App;
