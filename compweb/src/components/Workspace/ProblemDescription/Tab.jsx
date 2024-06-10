import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/ProblemDescription.module.css';

const Tab = ({ index, tab, isActive, type, setDraggedTab, setQuestionID, currentPage }) => {
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
    <div style={{ position: 'relative' }}>
      <button 
        id={index}
        draggable="true"
        onDragStart={dragStart}
        onDragEnd={dragEnd}
        onDragEnter={dragEnter}
        onDragOver={dragOver}
        className={styles.buttonTab} 
        style={{border: 'calc(0.0625rem* var(--mantine-scale)) solid var(--border)', borderTop: 'none', background: isActive ? 'var(--site-bg)' : 'var(--site-bg)', color: "white", width: `${text.length * 1.3}ch`, minWidth: '156px'}} 
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}  
        onClick={() => {dispatch({ type: type === 'lesson' ? 'SET_LESSON_TAB' : 'SET_CURRENT_TAB', payload: tab })
          console.log("type:", type === 'lesson');
          console.log("payload", tab);
          if (type === 'lesson') {
            dispatch({
              type: currentPage === 'usaco' ? 'SET_USACO_INDEX' : 'SET_CCC_INDEX',
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
            setQuestionID(null);
          }}            
        />
        }
      </button>
      
      { isActive && <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'var(--accent)', height: '2px' }}/>}
    </div>
  );
};

export default Tab;
