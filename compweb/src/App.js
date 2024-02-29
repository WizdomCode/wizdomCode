import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import SignUp from "./pages/SignUp";
import SignUp from "./pages/LearningPath";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/learningpath" element={<AboutUs />} />
    </Routes>
  );
}

export default App;
