import { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useDisclosure } from '@mantine/hooks';
import { 
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  Modal,
  Button
} from '@mantine/core';
import {
  IconDatabase,
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconUserCircle,
  IconSearch
} from '@tabler/icons-react';
import classes from './NavbarMinimal.module.css';

import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import Settings from '../Settings/Settings';

function NavbarLink({ icon: Icon, label, active, onClick, path }) {
  return (
    <Link to={path}>
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
            <Icon style={{ width: rem(40), height: rem(40) }} stroke={1.5} />
        </UnstyledButton>
        </Tooltip>
    </Link>
  );
}

const UsacoIcon = () => <img src='/usaco.png' alt="Usaco Paths" style={{width: rem(40), height: rem(40)}}/>;
const CCCIcon = () => <img src='/ccc.png' alt="CCC Paths" style={{width: rem(40), height: rem(40)}}/>;

const mockdata = [
    { icon: IconSearch, label: 'Problems', path: '/problems' },
];

const contestdata = [
    { icon: UsacoIcon, label: 'USACO', path: '/usaco' },
    { icon: CCCIcon, label: 'CCC', path: '/ccc' },
];

export function SideNav() {
  const location = useLocation();

  const [active, setActive] = useState(2);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.path === location.pathname}
      onClick={() => setActive(index)}
    />
  ));

  const contestlinks = contestdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.path === location.pathname}
      onClick={() => setActive(index)}
    />
  ));

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <nav className={classes.navbar} style={{ backgroundColor: 'var(--site-bg)' }}>
        <Center>
          <Stack justify="center" gap={10}>
            {links}
          </Stack>
        </Center>

        <div className={classes.navbarMain}>
          <Stack justify="center" gap={10}>
            {contestlinks}
          </Stack>
        </div>

        <Stack justify="center" gap={0}>
              <NavbarLink icon={IconUserCircle} label="Profile" path={"/userprofile"}/>
              <NavbarLink icon={IconSettings} label="Settings" path={""} onClick={open}/>
        </Stack>
      </nav>
      <Modal opened={opened} onClose={close} title="Settings" centered>
        <Settings />
      </Modal>
    </>
  );
}
