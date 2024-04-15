import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../../styles/ProblemDescription.module.css';

const Tab = ({ index, tab, isActive, type, setDraggedTab }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  
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

  const dragStart = (e) => {
    const target = e.target;
    e.dataTransfer.setData('tab_id', target.id);
    setDraggedTab(index);
    setTimeout(() => {
      target.style.display = "none";
    }, 0);
  }

  const dragEnd = (e) => {
    e.target.style.display = "flex";
  }

  const dragEnter = (e) => {
    e.preventDefault();
  }

  const dragOver = (e) => {
    e.preventDefault();
  }

  return (
    <button 
      id={index}
      draggable="true"
      onDragStart={dragStart}
      onDragEnd={dragEnd}
      onDragEnter={dragEnter}
      onDragOver={dragOver}
      className={styles.buttonTab} 
      style={{background: isActive ? "#1B1B32" : "#0A0A23", color: "white", width: `${text.length * 1.3}ch`, minWidth: '156px'}} 
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}  
      onClick={() => {dispatch({ type: type === 'lesson' ? 'SET_LESSON_TAB' : 'SET_CURRENT_TAB', payload: tab })
        console.log("type:", type === 'lesson');
        console.log("payload", tab);
        if (type === 'lesson') {
          dispatch({
            type: 'SET_LESSON_TAB_INDEX',
            payload: index
          });
        }
    }}
    >
      <p className={styles.buttonText}>{text}</p>
      { (isHovered || isActive) && type !== 'lesson' &&
      <img 
        className={styles.closeIcon} 
        src='/close.png' 
        alt="Close tab" 
        style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: 'REMOVE_TAB', payload: tab });
        }}            
      />
      }
    </button>
  );
};

export default Tab;
