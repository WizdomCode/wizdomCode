import React from 'react'
import IDE from '../components/Workspace/ProblemDescription/IDE';
import SignUp from './SignUp';
import Navigation from '../components/Navigation/Navigation';
import { Footer } from '../components/Home/Footer';
import { AppShell } from '@mantine/core';

const SignUpPage = () => {
  return (
    <AppShell 
      header={{ height: 50 }}
      footer={{ height: 100 }}
      style={{ backgroundColor: 'var(--site-bg)' }}
    >
      <AppShell.Header>
        <Navigation />
      </AppShell.Header>
      <AppShell.Main>
        <div style={{ height: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center' }}>
          <SignUp />
        </div>
      </AppShell.Main>
      <AppShell.Footer display={'none'}>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  )
}

export default SignUpPage