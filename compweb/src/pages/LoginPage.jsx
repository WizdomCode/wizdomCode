import React from 'react'
import IDE from '../components/Workspace/ProblemDescription/IDE';
import Login from './Login';
import Navigation from '../components/Navigation/Navigation';
import { Footer } from '../components/Home/Footer';
import { AppShell } from '@mantine/core';

const LoginPage = () => {
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
          <Login />
        </div>
      </AppShell.Main>
      <AppShell.Footer display={'none'}>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  )
}

export default LoginPage