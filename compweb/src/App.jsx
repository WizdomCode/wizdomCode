import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import Leaderboard from "./pages/Leaderboard";
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
import BinarySearch from "./pages/ComputerContests/USACO/Silver/Lessons/BinarySearch";
import PrefixSums from "./pages/ComputerContests/USACO/Silver/Lessons/PrefixSums";
import TwoPointers from "./pages/ComputerContests/USACO/Silver/Lessons/TwoPointers";
import DepthFirstSearch from "./pages/ComputerContests/USACO/Silver/Lessons/DepthFirstSearch";
import FloodFill from "./pages/ComputerContests/USACO/Silver/Lessons/FloodFill";
import Trees from "./pages/ComputerContests/USACO/Silver/Lessons/Trees";
import CustomComparators from "./pages/ComputerContests/USACO/Silver/Lessons/CustomComparators";
import GreedySorting from "./pages/ComputerContests/USACO/Silver/Lessons/GreedySorting";
import Gold from "./pages/ComputerContests/USACO/Gold/Gold";
import Combinatorics from "./pages/ComputerContests/USACO/Gold/Lessons/Combinatorics";
import DynamicProgramming from "./pages/ComputerContests/USACO/Gold/Lessons/DynamicProgramming";
import UnionFind from "./pages/ComputerContests/USACO/Gold/Lessons/UnionFind";
import ShortestPaths from "./pages/ComputerContests/USACO/Gold/Lessons/ShortestPaths";
import PointUpdateRangeSum from "./pages/ComputerContests/USACO/Gold/Lessons/PointUpdateRangeSum";
import TopologicalSort from "./pages/ComputerContests/USACO/Gold/Lessons/TopologicalSort";
import MinimumSpanningTrees from "./pages/ComputerContests/USACO/Gold/Lessons/MinimumSpanningTrees";
import EulerTour from "./pages/ComputerContests/USACO/Gold/Lessons/EulerTour";
import StringHashing from "./pages/ComputerContests/USACO/Gold/Lessons/StringHashing";
import Platinum from "./pages/ComputerContests/USACO/Platinum/Platinum";
import SegmentTrees from "./pages/ComputerContests/USACO/Platinum/Lessons/SegmentTrees";
import AdvancedTreeTechniques from "./pages/ComputerContests/USACO/Platinum/Lessons/AdvancedTreeTechniques";
import AdvancedDynamicProgramming from "./pages/ComputerContests/USACO/Platinum/Lessons/AdvancedDynamicProgramming";
import ComputationalGeometry from "./pages/ComputerContests/USACO/Platinum/Lessons/ComputationalGeometry";
import MatrixExponentiation from "./pages/ComputerContests/USACO/Platinum/Lessons/MatrixExponentiation";
import UserProfile from "./pages/UserProfile";
import Problems from "./pages/Problems";
import AddProblem from "./pages/AddProblem";
import CCC from "./pages/ComputerContests/CCC/CCC";
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/learningpath" element={<LearningPath />} />
      <Route path="/computercontest" element={<ComputerContest />} />
      <Route path="/usaco" element={<USACO />} />
      <Route path="/ccc" element={<CCC />} />

      {/* Routes for Bronze lessons */}
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

      {/* Routes for Silver lessons */}
      <Route path="/silver" element={<Silver />} />
      <Route path="/binarysearch" element={<BinarySearch />} />
      <Route path="/prefixsums" element={<PrefixSums />} />
      <Route path="/twopointers" element={<TwoPointers />} />
      <Route path="/depthfirstsearch" element={<DepthFirstSearch />} />
      <Route path="/floodfill" element={<FloodFill />} />
      <Route path="/trees" element={<Trees />} />
      <Route path="/customcomparators" element={<CustomComparators />} />
      <Route path="/greedysorting" element={<GreedySorting />} />

      {/* Routes for Gold lessons */}
      <Route path="/gold" element={<Gold />} />
      <Route path="/combinatorics" element={<Combinatorics />} />
      <Route path="/dynamicprogramming" element={<DynamicProgramming />} />
      <Route path="/unionfind" element={<UnionFind />} />
      <Route path="/shortestpaths" element={<ShortestPaths />} />
      <Route path="/pointupdaterangesum" element={<PointUpdateRangeSum />} />
      <Route path="/topologicalsort" element={<TopologicalSort />} />
      <Route path="/minimumspanningtrees" element={<MinimumSpanningTrees />} />
      <Route path="/eulertour" element={<EulerTour />} />
      <Route path="/stringhashing" element={<StringHashing />} />

      {/* Routes for Platinum lessons */}
      <Route path="/platinum" element={<Platinum />} />
      <Route path="/segmenttrees" element={<SegmentTrees />} />
      <Route path="/advancedtreetechniques" element={<AdvancedTreeTechniques />} />
      <Route path="/advanceddynamicprogramming" element={<AdvancedDynamicProgramming />} />
      <Route path="/computationalgeometry" element={<ComputationalGeometry />} />
      <Route path="/matrixexponentiation" element={<MatrixExponentiation />} />

      <Route path="/userprofile" element={<UserProfile />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/addproblem" element={<AddProblem />} />
    </Routes>
  );
}

export default App;
