import React, { useState } from "react";
import UserProfile from './UserProfile'
import Navigation from '../components/Navigation/Navigation'
import { useDisclosure } from '@mantine/hooks';
import {
  AppShell
} from '@mantine/core';
import CommunityNav from "../components/Navigation/CommunityNav";

const UserProfilePage = () => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="xl"
    >
      <AppShell.Header>
        <Navigation />
      </AppShell.Header>
      <AppShell.Navbar>
        <CommunityNav />
      </AppShell.Navbar>
      <AppShell.Main>
        <UserProfile />
      </AppShell.Main>
    </AppShell>
  )
}

export default UserProfilePage