import React, { useState } from 'react';
import { Link } from "react-router-dom";
import styles from '../styles/Sidebar.module.css';

const Sidebar = ({ onUsacoClick, onCccClick }) => {
  const [currentTab, setCurrentTab] = useState('home');

  return (
    <div className={styles.sidebar}>
        <Link to="/problems" className={styles.img}>
          <button className={`${styles.button} ${currentTab === 'problems' ? styles.activeTab : ''}`} onClick={() => setCurrentTab('problems')}>
            <img src='/question.png' alt="Problems" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <Link to="/learningpath" className={styles.img}>
          <button className={`${styles.button} ${currentTab === 'learningpath' ? styles.activeTab : ''}`} onClick={() => setCurrentTab('learningpath')}>
            <img src='/paths.png' alt="Learning Path" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <button className={`${styles.button} ${currentTab === 'usaco' ? styles.activeTab : ''}`} onClick={() => {setCurrentTab('usaco'); onUsacoClick();}}>
          <img src='/usaco.png' alt="Usaco Paths" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
        </button>
        <button className={`${styles.button} ${currentTab === 'ccc' ? styles.activeTab : ''}`} onClick={() => {setCurrentTab('ccc'); onCccClick();}}>
          <img src='/ccc.png' alt="CCC Paths" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
        </button>
        <Link to="/" className={styles.img}>
          <button className={`${styles.button} ${currentTab === 'home' ? styles.activeTab : ''}`} onClick={() => setCurrentTab('home')}>
            <img src='/home.png' alt="Home" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <Link to="/addproblem" className={styles.img}>
          <button className={`${styles.button} ${currentTab === 'addproblem' ? styles.activeTab : ''}`} onClick={() => setCurrentTab('addproblem')}>
            <img src='/addproblem.png' alt="Add Problems" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <Link to="/signup" className={styles.img}>
          <button className={`${styles.button} ${currentTab === 'signup' ? styles.activeTab : ''}`} onClick={() => setCurrentTab('signup')}>
            <img src='/profile.png' alt="Sign Up" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
        <Link to="/settings" className={styles.img}>
          <button className={`${styles.button} ${currentTab === 'settings' ? styles.activeTab : ''}`} onClick={() => setCurrentTab('settings')}>
            <img src='/settings.png' alt="Settings" className={styles.img} style={{minWidth: '50px', minHeight: '50px', background: 'transparent'}}/>
          </button>
        </Link>
    </div>
  )
}

export default Sidebar;
