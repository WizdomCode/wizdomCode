import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/ProblemDescription.module.css';

const Tab = ({ tab, isActive, type }) => {
  const dispatch = useDispatch();
  
  let text;
  switch (tab.type) {
    case 'newTab':
      text = 'New Tab';
      break;
    case 'problem':
      text = tab.data.title;
      break;
    case 'division':
      text = tab.data;
      break;
    default:
      text = '';
  }

  return (
    <button 
      className={styles.buttonTab} 
      style={{background: isActive ? "#1B1B32" : "#0A0A23", color: "white"}} 
      onClick={() => {dispatch({ type: type === 'lesson' ? 'SET_LESSON_TAB' : 'SET_CURRENT_TAB', payload: tab })
        console.log("type:", type === 'lesson');
        console.log("payload", tab);
    }}
    >
      <p className={styles.buttonText}>{text}</p>
      <img 
        className={styles.closeIcon} 
        src='/close.png' 
        alt="Close tab" 
        style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}
        onClick={(e) => {
          e.stopPropagation(); // Prevents the click event from bubbling up to the parent button
          dispatch({ type: 'REMOVE_TAB', payload: tab });
        }}            
      />
    </button>
  );
};

export default Tab;
