import React, { useEffect, useState, useRef } from 'react';
import styles from './FileList.module.css';
import '../../styles/Editor.css';
import * as monaco from 'monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import { auth, db } from "../../../firebase.js";
import { getDoc, doc, setDoc } from "firebase/firestore";
import Divider from '@mui/material/Divider';
import { useLocation } from "react-router-dom";
import { 
  NativeSelect,
  Text,
} from '@mantine/core';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { TEMPLATES } from './Templates.js';
import { TEMPLATE_CODE } from '../templates.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {
  IconTrash
} from '@tabler/icons-react';

const initialData = [
  {
    "id": 1,
    "parent": 0,
    "droppable": true,
    "text": "Folder 1"
  },
  {
    "id": 2,
    "parent": 1,
    "text": "File 1-1",
    "data": {
      "language": "python"
    }
  },
  {
    "id": 3,
    "parent": 1,
    "text": "File 1-2",
    "data": {
      "language": "cpp"
    }
  },
  {
    "id": 4,
    "parent": 0,
    "droppable": true,
    "text": "Folder 2"
  },
  {
    "id": 5,
    "parent": 4,
    "droppable": true,
    "text": "Folder 2-1"
  },
  {
    "id": 6,
    "parent": 5,
    "text": "File 2-1-1",
    "data": {
      "language": "python"
    }
  }
];

const initialCode = {
  2: "print('File 1-1')",
  3: `#include <iostream>

int main() {
    std::cout << "Hello World!";
    return 0;
}`,
  6: "print('File 2-1-1')",
};

const FILE_EXTENSION = {
  python: ".py",
  java: ".java",
  cpp: ".cpp"
};

const drawerWidth = 240;

const LANGUAGE_ICON = {
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-plain.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-plain.svg",
    cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg"  
};


const FileList = (props) => {
  const fileTabs = useSelector(state => state.fileTabs);
  const activeTabIndex = useSelector(state => state.activeFileTab);

  const [filesOpen, setFilesOpen] = React.useState(false);



  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

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
            setUserData(userData); // Set the user data in the state
          } else {
          }
        }
      } catch (error) {
      }
    };
  
    fetchUserData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts
  
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const [expanded, setExpanded] = React.useState('');


  const [anchorEl, setAnchorEl] = React.useState(null);

  const [code, setCode] = useState(null);
  const [output, setOutput] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const languageRef = useRef(language); // Create a ref for the language

  useEffect(() => {
    if (fileTabs[activeTabIndex]) {
      setCode(fileTabs[activeTabIndex].code);
    }
  }, [activeTabIndex]);

  // Update the ref whenever the language changes
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const inputData = useSelector(state => state.inputData);
  const outputData = useSelector(state => state.outputData);
  const [localInputData, setLocalInputData] = useState(inputData);
  const [localOutputData, setLocalOutputData] = useState(outputData);

  const dispatch = useDispatch();

  const editorRef = useRef(null);

  const [actions, setActions] = useState([]); 
  

  useEffect(() => {
      if (editorRef.current) {
          Object.entries(TEMPLATES).forEach(([label, templates], index) => {
              editorRef.current.addAction({
                  id: `insert-template-${index}`,
                  label: label,
                  keybindings: [
                      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | (monaco.KeyCode.KEY_1 + index),
                  ],
                  contextMenuGroupId: 'navigation',
                  contextMenuOrder: 1.5,
                  run: function(ed) {
                      const position = ed.getPosition();
                      ed.executeEdits("", [
                          {
                              range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                              text: templates[languageRef.current] // Use the current value of the ref
                            }
                      ]);
                      return null;
                  }
              });
          });
      }
  }, [editorRef.current]);  

  const location = useLocation();
  const currentTab = useSelector(state => state.currentTab);
  const lessonProblemData = useSelector(state => state.lessonProblemData);
  const tabIndex = useSelector(state => state.lessonTabIndex);
  useEffect(() => {
    const fetchCode = async () => {
      let questionName = "";
  
      // Determine the question name based on the location and Redux state
      if (location.pathname === '/problems' && currentTab && currentTab.data) {
        questionName = currentTab.data.title;
      } else if (lessonProblemData && lessonProblemData[tabIndex]) {
        if (lessonProblemData[tabIndex].data && lessonProblemData[tabIndex].data.title) {
          questionName = lessonProblemData[tabIndex].data.title;
        }
      }
  
      // Check if the user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return;
      }
  
      // Check if the question name exists
      if (questionName) {
        try {
          // Get the document reference for the current user from Firestore
          const userDocRef = doc(db, "Users", currentUser.uid);
  
          // Fetch user data from Firestore
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const savedCode = userData.questionsIDE?.[questionName]; // Get saved code if it exists
  
            if (savedCode) {
              setCode(savedCode); // Set the code to the saved code
            } else {
              setCode(props.boilerPlate); // Use default boilerplate code
            }
          } else {
          }
        } catch (error) {
        }
      }
    };
  
    fetchCode();
  }, [currentTab, lessonProblemData, tabIndex, props.boilerPlate]);
  
  
  
    const [showFileForm, setShowFileForm] = useState(false);
    const [fileTypeInputValue, setFileTypeInputValue] = useState("cpp");
    const [showFolderForm, setShowFolderForm] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isContentSaved, setIsContentSaved] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [editedContent, setEditedContent] = useState("");
    const [currentFolder, setCurrentFolder] = useState("ide"); // Default folder is "ide"

    const handleFileSubmit = async (event) => {
        event.preventDefault();

        const parentId = openFile ? (openFile.droppable ? openFile.id : openFile.parent) : 0;
        const newFile = { 
            id: treeData[treeData.length - 1].id + 1, 
            parent: parentId, 
            text: inputValue, 
            data: { language: fileTypeInputValue } 
        };
    
        dispatch({ type: 'ADD_FILE_TAB', payload: { id: treeData[treeData.length - 1].id + 1, language: fileTypeInputValue, name: inputValue, code: "" } });

        dispatch({ type: 'UPDATE_FILE_CODE', key: treeData[treeData.length - 1].id + 1, value: "" });

        const newTreeData = [...treeData, newFile];
        dispatch({ type: 'SET_TREE_DATA', payload: newTreeData });
        setTreeData(newTreeData);
    };
    
    const handleFolderSubmit = async (event) => {
        event.preventDefault();

        const parentId = openFile ? (openFile.droppable ? openFile.id : openFile.parent) : 0;
        const newFile = { 
            id: treeData[treeData.length - 1].id + 1, 
            parent: parentId, 
            text: inputValue, 
            droppable: true
        };
    
        const newTreeData = [...treeData, newFile];
        setTreeData(newTreeData);    

        if (false) {
          const uid = auth.currentUser.uid;
          const ideRef = doc(db, "IDE", uid);
          try {
              const ideSnapshot = await getDoc(ideRef);
              if (ideSnapshot.exists()) {
                  const existingIdeMap = ideSnapshot.data().ide || {};
                  const folderPath = currentFolder !== "ide" ? `${currentFolder}.` : ""; // Add folder path if it's not the root folder
                  if (inputValue.trim() !== "") { // Check if inputValue is not empty
                      const updatedIdeMap = {
                          ...existingIdeMap,
                          [`${folderPath}${inputValue}`]: {} // Create an empty object for the folder
                      };
                      await setDoc(ideRef, { ide: updatedIdeMap }, { merge: true });
                  }
              } else {
              }
              setInputValue("");
              setShowFolderForm(false);
              fetchUserData(); // Call fetchUserData to update the file list
          } catch (error) {
          }
        }
    };


    useEffect(() => {
    }, [activeTabIndex]);
    
    useEffect(() => {
    }, [fileTabs]);
    
     const handleItemClick = async (itemName) => {
        try {
            const uid = auth.currentUser.uid;
            const ideRef = doc(db, "IDE", uid);
            const ideSnapshot = await getDoc(ideRef);
            if (ideSnapshot.exists()) {
                const itemData = ideSnapshot.data().ide[itemName];
                const itemType = ideSnapshot.data().fileTypes[itemName];
                setSelectedItem(itemName);
                setEditedContent(itemData); // Set the edited content to the selected item data
                setCode(itemData);

                // Check if file with same name already exists
                const existingTabIndex = fileTabs.findIndex(tab => tab.name === itemName);
                if (existingTabIndex !== -1) {
                    // If file exists, set the active tab index to that file
                    dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: existingTabIndex });
                } else {
                    // If file doesn't exist, create a new file and set it as the active tab
                    dispatch({ type: 'ADD_FILE_TAB', payload: { language: itemType, name: itemName, code: itemData } });
                    dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: fileTabs.length });
                }
            } else {
            }
        } catch (error) {
        }
    };


    const handleSave = async () => {
        try {
            const uid = auth.currentUser.uid;
            const ideRef = doc(db, "IDE", uid);
            const ideSnapshot = await getDoc(ideRef);
            if (ideSnapshot.exists()) {
                const existingIdeMap = ideSnapshot.data().ide || {};
                const updatedIdeMap = {
                    ...existingIdeMap,
                    [fileTabs[activeTabIndex].name]: code // Update the content of the selected item
                };
                await setDoc(ideRef, { ide: updatedIdeMap }, { merge: true });
                setIsContentSaved(true);

                const updateFileCode = async (newFileCode) => {
                
                  try {
                    await setDoc(ideRef, { code: newFileCode }, { merge: true });
                  } catch (error) {
                  }
                }; 
            
                updateFileCode(fileCode);
            } else {
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchUserData(); // Call fetchUserData on component mount
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserData(); // Call fetchUserData when auth state changes
            }
        });
        return unsubscribe;
    }, []);

    const fetchUserData = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUserId(currentUser.uid);
                const userDocRef = doc(db, "IDE", currentUser.uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setUserData(userData);
                } else {
                }
            }
        } catch (error) {
        }
    };
    const renderFileOrFolder = (itemName, isFolder) => {
        if (isFolder) {
            return (
                <li key={itemName} onClick={() => handleItemClick(itemName)}>
                    <strong>Folder:</strong> {itemName}
                    <ul>
                        {userData && userData.ide && Object.keys(userData.ide).map((itemName) => (
                            renderFileOrFolder(itemName, userData.ide[itemName].__isFolder)
                        ))}
                    </ul>
                </li>
            );
        } else {
            return (
                <li key={itemName} onClick={() => handleItemClick(itemName)}>
                    {itemName}
                </li>
            );
        }
    };
    useEffect(() => {
        // Compare edited content with content saved in Firebase
        const checkContentSaved = async () => {
        };

        checkContentSaved(); // Call the function on component mount and whenever editedContent or selectedItem changes
    }, [code, selectedItem]);


  const [treeData, setTreeData] = useState(initialData);
  const fileCode = useSelector(state => state.fileCode);

  useEffect(() => {
  }, [fileCode]);

  const handleDrop = async (newTreeData) => {
    setTreeData(newTreeData);
  }; 

  useEffect(() => {
    const updateTree = async (newTreeData) => {
      if (auth.currentUser && auth.currentUser.uid) {
        const uid = auth.currentUser.uid;
      
        const docRef = doc(db, "IDE", uid);
        
        try {
            await setDoc(docRef, { files: newTreeData }, { merge: true });
        } catch (error) {
        }
      }
    }; 

    updateTree(treeData);
  }, [treeData]);
  
  useEffect(() => {
    const fetchData = async (userId) => {
      const docRef = doc(db, "IDE", userId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        setTreeData(docSnap.data().files || initialData);

        dispatch({type: 'REPLACE_FILE_CODE', newState: docSnap.data().code || initialCode});
      } else {
        setTreeData(initialData);
        dispatch({type: 'REPLACE_FILE_CODE', newState: docSnap.data().code || initialCode});
      }
    };  

    if (userId) {
      fetchData(userId);
    }
  }, [userId]);

  const [openFile, setOpenFile] = useState(null);

  useEffect(() => {
    const handleFileClick = async () => {
      setSelectedItem(openFile.text);
      setEditedContent(fileCode[openFile.id]);
      setCode(fileCode[openFile.id]);

      // Check if file with same name already exists
      const existingTabIndex = fileTabs.findIndex(tab => tab.id === openFile.id);
      if (existingTabIndex !== -1) {
          // If file exists, set the active tab index to that file
          dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: existingTabIndex });
      } else {
          // If file doesn't exist, create a new file and set it as the active tab
          dispatch({ type: 'ADD_FILE_TAB', payload: { id: openFile.id, language: openFile.data.language, name: openFile.text, code: fileCode[openFile.id] } });
          dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: fileTabs.length });
      }
    };

    if (openFile && !openFile.droppable) {
      handleFileClick();
    }
  }, [openFile]);

  const handleFileDelete = () => {
    if (openFile && openFile.id) {
      const id = openFile.id;
      const removeIndex = fileTabs.findIndex(object => object.id === id);
      dispatch({ type: 'REMOVE_FILE_TAB_BY_ID', payload: id });
      setTreeData(prevArray => prevArray.filter(object => object.id !== id));
      dispatch({ type: 'DELETE_FILE_CODE', key: id });

      if (fileTabs.length > 1) {

        if (activeTabIndex === fileTabs.length - 1) {
          setCode(fileTabs[activeTabIndex - 1].code);
          dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: activeTabIndex - 1 });
          return;
        } else if (removeIndex < activeTabIndex) {
          setCode(fileTabs[activeTabIndex - 1].code);
          dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: activeTabIndex - 1 });
          return;
        }
        setCode(fileTabs[activeTabIndex].code);
        dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: activeTabIndex });
        return;
      } else {
        setCode(null);
        dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: 0 });
        return;
      }
    }
  }

  useEffect(() => {
    dispatch({ type: 'SET_TREE_DATA', payload: treeData });
  }, [treeData]);
  
  useEffect(() => {
    dispatch({ type: 'SET_OPEN_FILE', payload: openFile });
  }, [openFile]);

  const [hoveredFile, setHoveredFile] = useState(null);
  const openTemplate = useSelector(state => state.openTemplate);
  const templateIsClicked = useSelector(state => state.templateIsClicked);
  const filesSectionOpen = useSelector(state => state.filesSectionOpen);
  const templatesSectionOpen = useSelector(state => state.templatesSectionOpen);

  return (
    <div style={{ minWidth: '240px', backgroundColor: 'var(--site-bg)', borderRight: '1px solid var(--border)' }}>
        <div style={{ height: "49px", alignItems: "center", display: "flex", direction: "row", borderBottom: '1px solid var(--border)' }}>
            <ChevronRightIcon 
                style={{ marginLeft: '10px', height: "30px", width: "30px" }}
                onClick={() => { dispatch({ type: 'SET_IS_FILE_LIST_OPEN', payload: false }); }}    
            />
        </div>
        <div style={{ marginTop: '4px' }} className={`${styles.selectedBackground} ${styles.fileNameButtonRow} ${styles.vertCenterIcons}`}>
            <span className={styles.vertCenterIcons} onClick={() => dispatch({ type: 'TOGGLE_FILES_SECTION_OPEN' })}>{filesSectionOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
            <p className={`${styles.marginSpacing} ${styles.classTwo}`} style={{ color: 'var(--dim-text)' }}>
              <Text fw={700} size="lg">
                FILES
              </Text>
            </p>
            <div className={`${styles.rightAlign} ${styles.vertCenterIcons}`}>
                <NoteAddOutlinedIcon style={{ color: 'var(--dim-text)' }} className={`${styles.languageIcon}`} onClick={() => setShowFileForm(!showFileForm)}/>
                <CreateNewFolderOutlinedIcon style={{ color: 'var(--dim-text)' }} className={`${styles.languageIcon}`} onClick={() => setShowFolderForm(!showFolderForm)}/>
                <IconTrash style={{ color: 'var(--dim-text)' }} className={`${styles.languageIcon}`} onClick={() => handleFileDelete()}/>
            </div>
        </div>
            <div className={styles.marginSpacing}>
            {showFileForm && (
                <div>
                  <form onSubmit={handleFileSubmit}>
                      <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          autoFocus
                          style={{color: "white"}}
                          placeholder="File Name"
                      />
                      <NativeSelect 
                        label="Language" 
                        data={['cpp', 'python', 'java']} 
                        onChange={(e) => setFileTypeInputValue(e.target.value)}
                      />
                      <button type="submit">Submit</button>
                  </form>
                </div>
            )}
            {showFolderForm && (
                <form onSubmit={handleFolderSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        style={{color: "white"}}
                        placeholder="Folder Name"
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
            {selectedItem && (
                <div>
                    {isContentSaved ? (
                        <h3>Saved</h3>
                    ) : (
                        <h3>Not Saved</h3>
                    )}
                    <button onClick={handleSave}>Save</button>
                </div>
            )}
            </div>
        { filesSectionOpen &&
          <DndProvider backend={MultiBackend} options={getBackendOptions()} style={{ height: "100%" }}>
            <Tree
              tree={treeData}
              rootId={0}
              onDrop={handleDrop}
              render={(node, { depth, isOpen, onToggle }) => (
                <div 
                  style={{ backgroundColor: openFile && openFile.text === node.text ? 'var(--selected-item)' : hoveredFile === node ? 'var(--hover)' : 'transparent' }}
                  onClick={() => {setOpenFile(node);}}
                  onMouseEnter={() => {
                    setHoveredFile(node);
                  }}
                  onMouseLeave={() => {
                    setHoveredFile(null); 
                  }}
                >
                  <div style={{ marginLeft: (depth + 1) * 20, color: (hoveredFile === node) || (openFile && openFile.text === node.text) ? 'white' : 'var(--dim-text)' }} className={styles.vertCenterIcons}>
                    {node.droppable && (
                      <span className={styles.vertCenterIcons} onClick={onToggle}>{isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
                    )}
                    <img src={node.data && node.data.language ? LANGUAGE_ICON[node.data.language] : ''} className={styles.languageIcon}/>
                    {`${node.text}${node.data && node.data.language ? FILE_EXTENSION[node.data.language] : ''}`}
                  </div>
                </div>
              )}
              dragPreviewRender={(monitorProps) => (
                <div>{monitorProps.item.text}</div>
              )}
              style={{ height: "100%" }}
            />
          </DndProvider> 
        }   
        <div style={{ marginTop: '4px' }} className={`${styles.selectedBackground} ${styles.fileNameButtonRow} ${styles.vertCenterIcons}`}>
            <span className={styles.vertCenterIcons} onClick={() => dispatch({ type: 'TOGGLE_TEMPLATES_SECTION_OPEN' })}>{templatesSectionOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
            <p className={`${styles.marginSpacing} ${styles.classTwo}`} style={{ color: 'var(--dim-text)' }}>
              <Text fw={700} size="lg">
                CODE TEMPLATES
              </Text>
            </p>
            <div className={`${styles.rightAlign} ${styles.vertCenterIcons}`}>
            </div>
        </div>
        { templatesSectionOpen &&
          <DndProvider backend={MultiBackend} options={getBackendOptions()} style={{ height: "100%" }}>
            <Tree
              tree={TEMPLATES}
              rootId={0}
              render={(node, { depth, isOpen, onToggle }) => (
              <CopyToClipboard text={node.data && node.data.language ? TEMPLATE_CODE[node.text][node.data.language] : ''}>
                <div 
                  style={{ 
                    marginLeft: (depth + 1) * 20,
                    backgroundColor: openFile && openFile.text === node.text ? 'var(--selected-item)' : hoveredFile === node ? 'var(--hover)' : 'transparent',
                    color: (hoveredFile === node) || (openFile && openFile.text === node.text) ? 'white' : 'var(--dim-text)'
                  }}
                  onClick={() => {}}
                  onMouseEnter={() => {
                      setHoveredFile(node); 
                      if (!node.droppable)
                      dispatch({ type: 'SET_OPEN_TEMPLATE', payload: { name: node.text, language: node.data.language }})}}
                  onMouseLeave={() => {
                      setHoveredFile(null); 
                      if (!node.droppable && !templateIsClicked)
                      dispatch({ type: 'SET_OPEN_TEMPLATE', payload: null });}}          
                  className={styles.vertCenterIcons}
                >
                  {node.droppable && (
                    <span className={styles.vertCenterIcons} onClick={onToggle}>{isOpen ? <ExpandMoreIcon />: <ChevronRightIcon />}</span>
                  )}
                  <img src={node.data && node.data.language ? LANGUAGE_ICON[node.data.language] : ''} className={styles.languageIcon}/>
                  {`${node.text}${node.data && node.data.language ? FILE_EXTENSION[node.data.language] : ''}`}
                </div>
                </CopyToClipboard>
              )}
              dragPreviewRender={(monitorProps) => (
                <div>{monitorProps.item.text}</div>
              )}
              style={{ height: "100%" }}
            />
          </DndProvider>
        }
    </div>
  );
};

export default FileList;
