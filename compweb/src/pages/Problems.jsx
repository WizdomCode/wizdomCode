import React, { useState, useEffect } from "react";
import { auth, app, db } from "../firebase";
import Navigation from "../components/Navigation/Navigation";
import Question from "../components/Question";
import { collection, getDocs } from "firebase/firestore";

const Problems = () => {
  const [problem, setProblem] = useState(null);
  const [cases, setCases] = useState(null);
  const [points, setPoints] = useState("");
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState([]);
  const [contests, setContests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "Questions"));
      const questionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(questionsData);
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    let filtered = questions;

    if (points) {
      filtered = filtered.filter((q) => q.points === parseInt(points, 10));
    }

    if (search) {
      filtered = filtered.filter((q) =>
        q.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (topics.length > 0) {
      filtered = filtered.filter((q) =>
        q.topics.some((t) => topics.includes(t))
      );
    }

    if (contests.length > 0) {
      filtered = filtered.filter((q) => contests.includes(q.contest));
    }

    setFilteredQuestions(filtered);
  }, [questions, points, search, topics, contests]);

  return (
    <>
      <Navigation />
      <h1>Problems</h1>
      <div>
        <label>Points:</label>
        <input
          type="text"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      </div>
      <div>
        <label>Search:</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        <label>Topics:</label>
        <div>
          <label>
            <input
              type="checkbox"
              value="sorting"
              checked={topics.includes("sorting")}
              onChange={() => setTopics(["sorting"])}
            />
            sorting
          </label>
          <label>
            <input
              type="checkbox"
              value="simulation"
              checked={topics.includes("simulation")}
              onChange={() => setTopics(["simulation"])}
            />
            simulation
          </label>
        </div>
      </div>
      <div>
        <label>Contests:</label>
        <div>
          <label>
            <input
              type="checkbox"
              value="USACO"
              checked={contests.includes("USACO")}
              onChange={() => setContests(["USACO"])}
            />
            USACO
          </label>
          <label>
            <input
              type="checkbox"
              value="CCC"
              checked={contests.includes("CCC")}
              onChange={() => setContests(["CCC"])}
            />
            CCC
          </label>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Question Name</th>
            <th>Points</th>
            <th>Topics</th>
            <th>Contest</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q) => (
            <tr key={q.id}>
              <td>{q.title}</td>
              <td>{q.points}</td>
              <td>{q.topics.join(", ")}</td>
              <td>{q.contest}</td>
              <td>
                <button
                  type="button"
                  onClick={() => {
                    setProblem(q.title);
                    setCases(q.folder);
                  }}
                >
                  Question
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {problem && cases && (
        <Question questionID={problem} testCaseFolder={cases} />
      )}
    </>
  );
};

export default Problems;
