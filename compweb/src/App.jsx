// App.js
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewIDE from "./pages/NewIDE";
import Leaderboard from "./pages/Leaderboard";
import SignUp from "./pages/SignUp";
import LearningPath from "./pages/LearningPath";
import Challenges from "./pages/Challenges";
import Achievements from "./pages/Achievements";
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
import LeaderboardPage from "./pages/LeaderboardPage";
import UserProfilePage from "./pages/UserProfilePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from './AuthContext';

import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css';
import Newsletter from "./pages/Newsletter";
import Thankyou from "./pages/Thankyou";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/newsletter/thankyou" element={<Thankyou />} />

        {/* Protected routes */}
        <Route path="/newide" element={<ProtectedRoute element={NewIDE} />} />
        <Route path="/leaderboard" element={<ProtectedRoute element={LeaderboardPage} />} />
        <Route path="/learningpath" element={<ProtectedRoute element={LearningPath} />} />
        <Route path="/computercontest" element={<ProtectedRoute element={ComputerContest} />} />
        <Route path="/challenges" element={<ProtectedRoute element={Challenges} />} />
        <Route path="/achievements" element={<ProtectedRoute element={Achievements} />} />
        <Route path="/usaco" element={<ProtectedRoute element={USACO} />} />
        <Route path="/ccc" element={<ProtectedRoute element={CCC} />} />

        {/* Routes for Bronze lessons */}
        <Route path="/bronze" element={<ProtectedRoute element={Bronze} />} />
        <Route path="/adhoc" element={<ProtectedRoute element={AdHoc} />} />
        <Route path="/completesearch" element={<ProtectedRoute element={CompleteSearch} />} />
        <Route path="/datastructures" element={<ProtectedRoute element={DataStructures} />} />
        <Route path="/graphs" element={<ProtectedRoute element={Graphs} />} />
        <Route path="/greedyalgorithims" element={<ProtectedRoute element={GreedyAlgorithims} />} />
        <Route path="/rectanglegeometry" element={<ProtectedRoute element={RectangleGeometry} />} />
        <Route path="/recursion" element={<ProtectedRoute element={Recursion} />} />
        <Route path="/simulation" element={<ProtectedRoute element={Simulation} />} />
        <Route path="/sorting" element={<ProtectedRoute element={Sorting} />} />

        {/* Routes for Silver lessons */}
        <Route path="/silver" element={<ProtectedRoute element={Silver} />} />
        <Route path="/binarysearch" element={<ProtectedRoute element={BinarySearch} />} />
        <Route path="/prefixsums" element={<ProtectedRoute element={PrefixSums} />} />
        <Route path="/twopointers" element={<ProtectedRoute element={TwoPointers} />} />
        <Route path="/depthfirstsearch" element={<ProtectedRoute element={DepthFirstSearch} />} />
        <Route path="/floodfill" element={<ProtectedRoute element={FloodFill} />} />
        <Route path="/trees" element={<ProtectedRoute element={Trees} />} />
        <Route path="/customcomparators" element={<ProtectedRoute element={CustomComparators} />} />
        <Route path="/greedysorting" element={<ProtectedRoute element={GreedySorting} />} />

        {/* Routes for Gold lessons */}
        <Route path="/gold" element={<ProtectedRoute element={Gold} />} />
        <Route path="/combinatorics" element={<ProtectedRoute element={Combinatorics} />} />
        <Route path="/dynamicprogramming" element={<ProtectedRoute element={DynamicProgramming} />} />
        <Route path="/unionfind" element={<ProtectedRoute element={UnionFind} />} />
        <Route path="/shortestpaths" element={<ProtectedRoute element={ShortestPaths} />} />
        <Route path="/pointupdaterangesum" element={<ProtectedRoute element={PointUpdateRangeSum} />} />
        <Route path="/topologicalsort" element={<ProtectedRoute element={TopologicalSort} />} />
        <Route path="/minimumspanningtrees" element={<ProtectedRoute element={MinimumSpanningTrees} />} />
        <Route path="/eulertour" element={<ProtectedRoute element={EulerTour} />} />
        <Route path="/stringhashing" element={<ProtectedRoute element={StringHashing} />} />

        {/* Routes for Platinum lessons */}
        <Route path="/platinum" element={<ProtectedRoute element={Platinum} />} />
        <Route path="/segmenttrees" element={<ProtectedRoute element={SegmentTrees} />} />
        <Route path="/advancedtreetechniques" element={<ProtectedRoute element={AdvancedTreeTechniques} />} />
        <Route path="/advanceddynamicprogramming" element={<ProtectedRoute element={AdvancedDynamicProgramming} />} />
        <Route path="/computationalgeometry" element={<ProtectedRoute element={ComputationalGeometry} />} />
        <Route path="/matrixexponentiation" element={<ProtectedRoute element={MatrixExponentiation} />} />

        <Route path="/userprofile" element={<ProtectedRoute element={UserProfilePage} />} />
        <Route path="/problems" element={<ProtectedRoute element={Problems} />} />
        <Route path="/addproblem" element={<ProtectedRoute element={AddProblem} />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
