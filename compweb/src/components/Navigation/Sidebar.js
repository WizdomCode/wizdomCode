import React from 'react';
import { Link, useLocation } from "react-router-dom";
import styles from '../styles/Sidebar.module.css';

const Sidebar = ({ onUsacoClick, onCccClick }) => {
  const location = useLocation();

  return (
    <div className={styles.sidebar}>
        <Link to="/problems" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/problems' ? styles.activeTab : ''}`}>
            <img src='/question.png' alt="Problems" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <Link to="/usaco" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/usaco' ? styles.activeTab : ''}`} onClick={onUsacoClick}>
            <img src='/usaco.png' alt="Usaco Paths" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <Link to="/ccc" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/ccc' ? styles.activeTab : ''}`} onClick={onCccClick}>
            <img src='/ccc.png' alt="CCC Paths" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <Link to="/" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/' ? styles.activeTab : ''}`}>
            <img src='/home.png' alt="Home" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <Link to="/addproblem" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/addproblem' ? styles.activeTab : ''}`}>
            <img src='/addproblem.png' alt="Add Problems" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <Link to="/signup" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/signup' ? styles.activeTab : ''}`}>
            <img src='/profile.png' alt="Sign Up" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <Link to="/settings" className={styles.img}>
          <button className={`${styles.button} ${location.pathname === '/settings' ? styles.activeTab : ''}`}>
            <img src='/settings.png' alt="Settings" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
    </div>
  )
}

export default Sidebar;
