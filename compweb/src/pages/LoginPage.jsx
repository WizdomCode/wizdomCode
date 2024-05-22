import React from 'react'
import IDE from '../components/Workspace/ProblemDescription/IDE';
import Login from './Login';
import Navigation from '../components/Navigation/Navigation';
import { Footer } from '../components/Home/Footer';

const LoginPage = () => {
  return (
    <>
      <Navigation />
      <Login />
      <Footer />
    </>
  )
}

export default LoginPage