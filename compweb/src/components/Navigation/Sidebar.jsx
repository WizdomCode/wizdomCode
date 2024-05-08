import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import styles from '../styles/Sidebar.module.css';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from "../../firebase"
import { onAuthStateChanged, signOut} from "firebase/auth";
import { 
  useMantineTheme,
  Center,
  UnstyledButton, 
  Stack, 
  rem
} from '@mantine/core';

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: '18px',
  },
}));

const Sidebar = ({ onUsacoClick, onCccClick }) => {
  const location = useLocation();

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
    console.log("sidebar authenticatedUser percep:", authenticatedUser);
  }, [authenticatedUser]);

  const theme = useMantineTheme();

  return (
    <div className={styles.sidebar} style={{ backgroundColor: theme.colors.navbar[0] }}>
        <Link to="/problems" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/problems' ? styles.activeTab : ''}`}>
            <BootstrapTooltip title="Problems" placement="right">
              <img src='/question.png' alt="Problems" className={styles.img} style={{width: '50px', height: '50px', background: 'transparent'}}/>
            </BootstrapTooltip>
          </button>
        </Link>
        <Link to="/usaco" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/usaco' ? styles.activeTab : ''}`} onClick={onUsacoClick}>
            <BootstrapTooltip title="USACO Problems" placement="right">
              <img src='/usaco.png' alt="Usaco Paths" className={styles.img} style={{width: '50px', height: '50px', background: 'transparent'}}/>
            </BootstrapTooltip>
          </button>
        </Link>
        <Link to="/ccc" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/ccc' ? styles.activeTab : ''}`} onClick={onCccClick}>
            <BootstrapTooltip title="CCC Problems" placement="right">
              <img src='/ccc.png' alt="CCC Paths" className={styles.img} style={{width: '50px', height: '50px', background: 'transparent'}}/>
            </BootstrapTooltip>
          </button>
        </Link>
        <Link to="/" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/' ? styles.activeTab : ''}`}>
            <BootstrapTooltip title="Home" placement="right">
              <img src='/home.png' alt="Home" className={styles.img} style={{width: '50px', height: '50px', background: 'transparent'}}/>
            </BootstrapTooltip>
          </button>
        </Link>
        <Link to="/leaderboard" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/leaderboard' ? styles.activeTab : ''}`}>
            <BootstrapTooltip title="Leaderboard" placement="right">
              <img src='/leaderboard.png' alt="Leaderboard" className={styles.img} style={{width: '50px', height: '50px', background: 'transparent'}}/>
            </BootstrapTooltip>
          </button>
        </Link>
        { !authenticatedUser ? (
          <>
            <Link to="/signup" className={styles.img}>
              <button className={`${styles.button} ${location.pathname === '/signup' ? styles.activeTab : ''}`}>
                <BootstrapTooltip title="Sign Up" placement="right">
                  <AppRegistrationIcon style={{width: '50px', height: '50px', background: 'transparent', color: 'white'}}/>
                </BootstrapTooltip>
              </button>
            </Link>
            <Link to="/login" className={styles.img}>
              <button className={`${styles.button} ${location.pathname === '/login' ? styles.activeTab : ''}`}>
                <BootstrapTooltip title="Login" placement="right">
                  <LoginIcon style={{width: '50px', height: '50px', background: 'transparent', color: 'white'}}/>
                </BootstrapTooltip>
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/userprofile" className={styles.img}>
              <button className={`${styles.button} ${location.pathname === '/userprofile' ? styles.activeTab : ''}`}>
                <BootstrapTooltip title="Profile" placement="right">
                  <img src='/profile.png' alt="Profile" className={styles.img} style={{width: '50px', height: '50px', background: 'transparent'}}/>
                </BootstrapTooltip>
              </button>
            </Link>
            <Link to="/" className={styles.img}>
              <button className={`${styles.button} ${location.pathname === '/logout' ? styles.activeTab : ''}`} onClick={userSignOut}>
                <BootstrapTooltip title="Logout" placement="right">
                  <LogoutIcon style={{width: '50px', height: '50px', background: 'transparent', color: 'white'}}/>
                </BootstrapTooltip>
              </button>
            </Link>
          </>
        )}
          <button className={`${styles.button} ${location.pathname === '/settings' ? styles.activeTab : ''}`}>
            <BootstrapTooltip title="Settings" placement="right">
              <img src='/settings.png' alt="Settings" className={styles.img} style={{width: '50px', height: '50px', background: 'transparent'}}/>
            </BootstrapTooltip>
          </button>
    </div>
  )
}

export default Sidebar;
