import React from 'react'
import IDE from '../components/Workspace/ProblemDescription/IDE';
import Leaderboard from './Leaderboard';
import Navigation from '../components/Navigation/Navigation';

const LeaderboardPage = () => {
    return (
      <div>
          <Navigation />
          <Leaderboard />
      </div>
    )
};  

export default LeaderboardPage