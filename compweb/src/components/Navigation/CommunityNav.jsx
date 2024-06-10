import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from '../../pages/Leaderboard.module.css';
import { useDisclosure } from '@mantine/hooks';
import {
  Group,
  Code} from '@mantine/core';
import { 
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconUserCircle,
  IconChartBar
} from '@tabler/icons-react';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const data = [
  { link: '/userprofile', label: 'Profile', icon: IconUserCircle },
  { link: '/leaderboard', label: 'Leaderboard', icon: IconChartBar }
];

const CommunityNav = () => {
  const [active, setActive] = useState('Leaderboard');
  const [opened, { toggle }] = useDisclosure();

  const location = useLocation();

  const userSignOut = () => {
    signOut(auth)
  }

  const links = data.map((item) => (
    <Link to={item.link}>
        <a
            className={styles.link}
            data-active={location.pathname === item.link || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                setActive(item.label);
            }}
        >
            <item.icon className={styles.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    </Link>
  ));

  return (
    <nav className={styles.navbar} style={{ backgroundColor: 'var(--site-bg)', borderRight: '1px solid var(--border)'}}>
        <div className={styles.navbarMain}>
        <Group className={styles.header} justify="space-between" display={'none'}>
            <IconSwitchHorizontal size={28} inverted style={{ color: 'white' }} stroke={1.5} />
            <Code fw={700} className={styles.version}>
            v3.1.2
            </Code>
        </Group>
        {links}
        </div>

        <div className={styles.footer}>
          <a href="#" className={styles.link} onClick={userSignOut}>
              <IconLogout className={styles.linkIcon} stroke={1.5} />
              <span>Logout</span>
          </a>
        </div>
    </nav>
  )
}

export default CommunityNav