import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Authentication from './Authentication';
import { auth, db } from "../../firebase"
import { ActionCodeOperation, onAuthStateChanged, signOut} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import styles from '../styles/Navigation.module.css';

import cx from 'clsx';

import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
  Avatar,
  Menu,
  Popover
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
  IconLogout,
  IconHeart,
  IconStar,
  IconMessage,
  IconSettings,
  IconPlayerPause,
  IconTrash,
  IconSwitchHorizontal,
  IconBrandDiscord,
  IconUserCircle,
  IconBrandX
} from '@tabler/icons-react';

import GitHubIcon from '@mui/icons-material/GitHub';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShareIcon from '@mui/icons-material/Share';

import classes from '../styles/Navigation.module.css';
import Share from '@mui/icons-material/Share';

import { useDispatch, useSelector } from 'react-redux';

const mockdata = [
  {
    icon: IconCode,
    title: 'Problems',
    description: '250+ problems from the most popular competitive programming contests',
    link: '/problems'
  },
  {
    icon: IconCoin,
    title: 'Canadian Computing Competition',
    description: 'Canada\'s largest competitive programming competition',
    link: '/ccc'
  },
  {
    icon: IconBook,
    title: 'Usaco',
    description: 'Yanma is capable of seeing 360 degrees without',
    link: '/usaco'
  },
];

const communityData = [
  {
    icon: IconCode,
    title: 'Profile',
    description: '250+ problems from the most popular competitive programming contests',
    link: '/userprofile'
  },
  {
    icon: IconCoin,
    title: 'Leaderboard',
    description: 'Canada\'s largest competitive programming competition',
    link: '/leaderboard'
  },
];

const Navigation = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current user
        const currentUser = auth.currentUser;

        if (currentUser) { // Check if currentUser is not null
          setUserId(currentUser.uid); // Set the user ID

          // Get the document reference for the current user from Firestore
          const userDocRef = doc(db, "Users", currentUser.uid);

          // Fetch user data from Firestore
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            // Extract required user information from the snapshot
            const userData = userSnapshot.data();
            dispatch({ type: 'SET_USER_INFO', payload: userData });
            setUserData(userData); // Set the user data in the state
          } else {
          }
        }
      } catch (error) {
      }
    };

    fetchUserData();
  }, [auth.currentUser]);

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const links = mockdata.map((item) => (
    <Link to={item.link} key={item.title}>
      <UnstyledButton className={classes.subLink} p={10}>
        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon size={34} variant="default" radius="md">
            <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.colors.blue[6]} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              {item.description}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    </Link>
  ));
  
  const communityLinks = communityData.map((item) => (
    <Link to={item.link} key={item.title}>
      <UnstyledButton className={classes.subLink} p={10}>
        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon size={34} variant="default" radius="md">
            <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.colors.blue[6]} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
            <Text size="xs" c="dimmed">
              {item.description}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    </Link>
  ));

  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 200 ) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  })

  let navbarClasses=[styles.navbar];
  if(scrolled){
    navbarClasses.push(styles.navbarScrolled);
  }

  const user = {
    name: 'Jane Spoonfighter',
    email: 'janspoon@fighter.dev',
    image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
  };
  
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const [authenticatedUser, setauthenticatedUser] = useState("");

  useEffect(() => {
    const listenAuth = onAuthStateChanged(auth, (user) =>{
      if (user){
        setauthenticatedUser(user)
      } else {
        setauthenticatedUser(null)
      }
    }
    )
    return () => {
      listenAuth();
    }
  },[])
  
  const userSignOut = () => {
    signOut(auth)
  }

  useEffect(() => {
  }, [authenticatedUser]);

  const location = useLocation();

  return (
    <>
      <Box style={{ backgroundColor: 'var(--site-bg)' }}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <Link to="/">
              <IconNotification size={30} style={{ marginLeft: '10px' }}/>
            </Link>

            <Group h="100%" gap={0} visibleFrom="sm" ml="200">
              <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                <HoverCard.Target>
                  <div style={{ position: 'relative', height: '100%' }}>
                    <Link to='/problems'>
                      <a href="#" className={classes.link}>
                        <Center inline>
                          <Box component="span" mr={5}>
                            <Text c={(location.pathname === '/problems' || location.pathname === '/ccc' || location.pathname === '/usaco') ? 'white' : 'var(--dim-text)'}>
                              Workspace
                            </Text>
                          </Box>
                          <IconChevronDown
                            style={{ width: rem(16), height: rem(16) }}
                            color={theme.colors.blue[6]}
                          />
                        </Center>
                      </a>
                    </Link>
                    { (location.pathname === '/problems' || location.pathname === '/ccc' || location.pathname === '/usaco') && 
                      <div style={{ marginLeft: '-10px', position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'var(--accent)', height: '2px' }}/>}
                  </div>
                </HoverCard.Target>

                <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                  <Group justify="space-between" px="md">
                    <Text fw={500}>Workspace</Text>
                  </Group>

                  <Divider my="sm" />

                  <SimpleGrid cols={2} spacing={0}>
                    {links}
                  </SimpleGrid>
                </HoverCard.Dropdown>
              </HoverCard>

              <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                <HoverCard.Target>
                  <div style={{ position: 'relative', height: '100%' }}>
                    <Link to='/problems'>
                      <a href="#" className={classes.link}>
                        <Center inline>
                          <Box component="span" mr={5}>
                            <Text c={(location.pathname === '/userprofile' || location.pathname === '/leaderboard') ? 'white' : 'var(--dim-text)'}>
                              Community
                            </Text>
                          </Box>
                          <IconChevronDown
                            style={{ width: rem(16), height: rem(16) }}
                            color={theme.colors.blue[6]}
                          />
                        </Center>
                      </a>
                    </Link>
                    { (location.pathname === '/userprofile' || location.pathname === '/leaderboard') && 
                      <div style={{ marginLeft: '-10px', position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'var(--accent)', height: '2px' }}/>}
                  </div>
                </HoverCard.Target>

                <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                  <Group justify="space-between" px="md">
                    <Text fw={500}>Community</Text>
                  </Group>

                  <Divider my="sm" />

                  <SimpleGrid cols={2} spacing={0}>
                    {communityLinks}
                  </SimpleGrid>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>

            <Group visibleFrom="sm" gap={8}>

              { authenticatedUser ? <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <UnstyledButton
                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                  >
                    <Group gap={7}>
                      <Avatar src={user.image} alt={userData && userData.username} radius="xl" size={20} />
                      <Text fw={500} size="sm" lh={1} mr={3}>
                        {userData && userData.username}
                      </Text>
                      <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Link to="/userprofile">
                    <Menu.Item
                      leftSection={
                        <IconUserCircle
                          style={{ width: rem(16), height: rem(16) }}
                          color={theme.colors.blue[6]}
                          stroke={1.5}
                        />
                      }
                    >
                      Profile
                    </Menu.Item>
                  </Link>
                  <Menu.Item
                    leftSection={
                      <IconStar
                        style={{ width: rem(16), height: rem(16) }}
                        color={theme.colors.yellow[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    Saved problems
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconMessage
                        style={{ width: rem(16), height: rem(16) }}
                        color={theme.colors.red[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    Your submissions
                  </Menu.Item>

                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                  >
                    Account settings
                  </Menu.Item>
                  <Link to="/">
                    <Menu.Item
                      leftSection={
                        <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                      }
                      onClick={userSignOut}
                    >
                      Logout
                    </Menu.Item>
                  </Link>

                  <Menu.Divider />

                  <Menu.Label>Danger zone</Menu.Label>
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                  >
                    Delete account
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              : (
                <>
                  <Link to="/login">
                    <Button variant="default">Log in</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Sign up</Button>
                  </Link>
                </>
              )}
              <Popover 
                width={400}
                position="bottom-end"
                withArrow
                shadow="md"
                offset={4}          
              >
                <Popover.Target>
                  <ThemeIcon variant="default" size="lg" color="indigo">
                    <NotificationsNoneIcon className={classes.notificationButton} />
                  </ThemeIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="xs">Your notifs</Text>
                </Popover.Dropdown>
              </Popover>
              <ThemeIcon color="indigo" size="lg">
                <IconBrandDiscord />
              </ThemeIcon>
              <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <ThemeIcon variant="default" size="lg" color="indigo">
                    <ShareIcon className={classes.shareButton}/>
                  </ThemeIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <IconBrandX
                        style={{ width: rem(16), height: rem(16) }}
                        color={theme.colors.blue[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    Share to Twitter
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
          </Group>
        </header>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Navigation"
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
            <Divider my="sm" />

            <a href="#" className={classes.link}>
              Home
            </a>
            <UnstyledButton className={classes.link} onClick={toggleLinks}>
              <Center inline>
                <Box component="span" mr={5}>
                  Workspace
                </Box>
                <IconChevronDown
                  style={{ width: rem(16), height: rem(16) }}
                  color={theme.colors.blue[6]}
                />
              </Center>
            </UnstyledButton>
            <Collapse in={linksOpened}>{links}</Collapse>
            <a href="#" className={classes.link}>
              Learn
            </a>
            <a href="#" className={classes.link}>
              Academy
            </a>

            <Divider my="sm" />

            <Group justify="center" grow pb="xl" px="md">
              <Button variant="default">Log in</Button>
              <Button>Sign up</Button>
            </Group>
          </ScrollArea>
        </Drawer>
      </Box>
    </>
  );
}

export default Navigation;
