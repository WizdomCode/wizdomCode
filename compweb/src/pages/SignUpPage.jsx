import React from 'react'
import IDE from '../components/Workspace/ProblemDescription/IDE';
import SignUp from './SignUp';
import Navigation from '../components/Navigation/Navigation';
import { Footer } from '../components/Home/Footer';

const SignUpPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--site-bg)' }}>
      <Navigation />
      <SignUp />
      <Footer />
    </div>
  )
}

export default SignUpPage