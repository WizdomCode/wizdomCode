import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import SignUp from "./pages/SignUp";
import LearningPath from "./pages/LearningPath";
import ComputerContest from "./pages/ComputerContests/ComputerContest";
import USACO from "./pages/ComputerContests/USACO/USACO";
import Bronze from "./pages/ComputerContests/USACO/Bronze/Bronze";
import AdHoc from "./pages/ComputerContests/USACO/Bronze/Lessons/AdHoc";
import CompleteSearch from "./pages/ComputerContests/USACO/Bronze/Lessons/CompleteSearch";
import DataStructures from "./pages/ComputerContests/USACO/Bronze/Lessons/DataStructures";
import Graphs from "./pages/ComputerContests/USACO/Bronze/Lessons/Graphs";
import GreedyAlgorithims from "./pages/ComputerContests/USACO/Bronze/Lessons/GreedyAlgorithims";
import RectangleGeometry from "./pages/ComputerContests/USACO/Bronze/Lessons/RectangleGeometry";
import Recursion from "./pages/ComputerContests/USACO/Bronze/Lessons/Recursion";
import Simulation from "./pages/ComputerContests/USACO/Bronze/Lessons/Simulation";
import Sorting from "./pages/ComputerContests/USACO/Bronze/Lessons/Sorting";
import Silver from "./pages/ComputerContests/USACO/Silver/Silver";
import BFS2 from "./pages/ComputerContests/USACO/Silver/Lessons/BFS2";
import UserProfile from "./pages/UserProfile";
import Problems from "./pages/Problems";
import AddProblem from "./pages/AddProblem";
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
      <Route path="/adhoc" element={<AdHoc />} />
      <Route path="/completesearch" element={<CompleteSearch />} />
      <Route path="/datastructures" element={<DataStructures />} />
      <Route path="/graphs" element={<Graphs />} />
      <Route path="/greedyalgorithims" element={<GreedyAlgorithims />} />
      <Route path="/rectanglegeometry" element={<RectangleGeometry />} />
      <Route path="/recursion" element={<Recursion />} />
      <Route path="/simulation" element={<Simulation />} />
      <Route path="/sorting" element={<Sorting />} />
      <Route path="/silver" element={<Silver />} />
      <Route path="/bfs2" element={<BFS2 />} />
      <Route path="/userprofile" element={<UserProfile />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/addproblem" element={<AddProblem />} />
    </Routes>
  );
}

export default App;
