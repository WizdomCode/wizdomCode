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
  ActionIcon,
  Container,
  CopyButton,
  Group,
  NativeSelect,
  rem,
  ScrollArea,
  Select,
  Text,
  TextInput,
  Tooltip,
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
  IconCheck,
  IconCopy,
  IconPlus,
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
  const [readCount, setReadCount] = useState(0);
  
  useEffect(() => {
    console.log("Filelist reads:", readCount);
  }, [readCount]);

  const fileTabs = useSelector(state => state.fileTabs);
  const activeTabIndex = useSelector(state => state.activeFileTab);

  const [filesOpen, setFilesOpen] = React.useState(false);



  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const [expanded, setExpanded] = React.useState('');


  const [anchorEl, setAnchorEl] = React.useState(null);

  const [output, setOutput] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const languageRef = useRef(language); // Create a ref for the language

  useEffect(() => {
    if (fileTabs[activeTabIndex]) {
      dispatch({ type: 'SET_OPEN_FILE', payload: treeData.find(item => item.id === fileTabs[activeTabIndex].id) });
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
  
    const [showFileForm, setShowFileForm] = useState(false);
    const [fileTypeInputValue, setFileTypeInputValue] = useState("cpp");
    const [showFolderForm, setShowFolderForm] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [folderInputValue, setFolderInputValue] = useState("");
    const [isContentSaved, setIsContentSaved] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [editedContent, setEditedContent] = useState("");
    const [currentFolder, setCurrentFolder] = useState("ide"); // Default folder is "ide"

    const handleFileSubmit = async (event) => {
        event.preventDefault();
        setShowFileForm(false);
        setInputValue("");

        console.log("openFile", openFile);

        const parentId = openFile ? (openFile.droppable ? openFile.id : openFile.parent) : 0;
        const newFile = { 
            id: treeData[treeData.length - 1] ? treeData[treeData.length - 1].id + 1 : 1, 
            parent: parentId, 
            text: inputValue, 
            data: { language: fileTypeInputValue } 
        };
    
        dispatch({ type: 'ADD_FILE_TAB', payload: { id: treeData[treeData.length - 1] ? treeData[treeData.length - 1].id + 1 : 1, language: fileTypeInputValue, name: inputValue, code: "" } });

        dispatch({ type: 'UPDATE_FILE_CODE', key: treeData[treeData.length - 1] ? treeData[treeData.length - 1].id + 1 : 1, value: "" });

        dispatch({ type: 'UPDATE_IS_FILE_SAVED', key: treeData[treeData.length - 1] ? treeData[treeData.length - 1].id + 1 : 1, payload: true });

        const newTreeData = [...treeData, newFile];
        dispatch({ type: 'SET_TREE_DATA', payload: newTreeData });

        dispatch({ type: 'SET_OPEN_FILE', payload: newFile });
    };
    
    const handleFolderSubmit = async (event) => {
        event.preventDefault();
        setShowFolderForm(false);
        setFolderInputValue("");

        const parentId = openFile ? (openFile.droppable ? openFile.id : openFile.parent) : 0;
        const newFile = { 
            id: treeData[treeData.length - 1] ? treeData[treeData.length - 1].id + 1 : 1, 
            parent: parentId, 
            text: folderInputValue, 
            droppable: true
        };
    
        const newTreeData = [...treeData, newFile];
        dispatch({ type: 'SET_TREE_DATA', payload: newTreeData });
    };

  const treeData = useSelector(state => state.treeData);
  const fileCode = useSelector(state => state.fileCode);

  useEffect(() => {
  }, [fileCode]);

  const handleDrop = async (newTreeData) => {
    dispatch({ type: 'SET_TREE_DATA', payload: newTreeData });
  }; 

  const [loadedTreeData, setLoadedTreeData] = useState(false);

  useEffect(() => {
    const updateTree = async (newTreeData) => {
      if (auth.currentUser && auth.currentUser.uid) {
        const uid = auth.currentUser.uid;
      
        const docRef = doc(db, "IDE", uid);
        
        try {
            await setDoc(docRef, { files: newTreeData }, { merge: true });
        } catch (error) {
          console.log(error);
        }
      }
    }; 

    console.log("Change in treeData", treeData);

    if (loadedTreeData) updateTree(treeData);
    else console.log("loadedTreeData", loadedTreeData);
  }, [treeData]);
  
  const [loadedFirestoreCode, setLoadedFirestoreCode] = useState(false);

  useEffect(() => {
    const fetchData = async (userId) => {
      const docRef = doc(db, "IDE", userId);
      const docSnap = await getDoc(docRef);
      setReadCount(prevReadCount => prevReadCount + 1);
  
      if (docSnap.exists()) {
        const data = docSnap.data();

        dispatch({ type: 'SET_TREE_DATA', payload: data.files || initialData });

        if (data.code) {
          dispatch({type: 'REPLACE_FILE_CODE', newState: data.code});

          const initialSaveStates = {};
          for (let key in data.code) {
            initialSaveStates[key] = true;
          }

          dispatch({ type: 'REPLACE_IS_FILE_SAVED', payload: initialSaveStates });
        } else {
          console.log("data.code is undefined, retrying...");
          fetchData(userId);
        }  
      } else {
        dispatch({ type: 'SET_TREE_DATA', payload: initialData });
        dispatch({type: 'REPLACE_FILE_CODE', newState: docSnap.data().code || initialCode});
      }
    };  

    if (fileCode && treeData) {
      // do nothing
    }
    else if (auth.currentUser && auth.currentUser.uid && !loadedFirestoreCode) {
      fetchData(auth.currentUser.uid);
      setLoadedFirestoreCode(true);
      setLoadedTreeData(true);
    }
  }, [auth.currentUser]);

  const openFile = useSelector(state => state.openFile);

  useEffect(() => {
    const handleFileClick = async () => {
      setSelectedItem(openFile.text);
      setEditedContent(fileCode[openFile.id]);

      // Check if file with same name already exists
      const existingTabIndex = fileTabs.findIndex(tab => tab.id === openFile.id);
      if (existingTabIndex !== -1) {
          // If file exists, set the active tab index to that file
          dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: existingTabIndex });
      } else {
          // If file doesn't exist, create a new file and set it as the active tab
          dispatch({ type: 'ADD_FILE_TAB', payload: { id: openFile.id, language: openFile.data.language, name: openFile.text, code: fileCode[openFile.id] } });
          console.log({ type: 'ADD_FILE_TAB', payload: { id: openFile.id, language: openFile.data.language, name: openFile.text, code: fileCode[openFile.id] } });
          dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: fileTabs.length });
      }
    };

    if (openFile && !openFile.droppable) {
      handleFileClick();
    }
  }, [openFile]);

  const handleFileDelete = (openFile, treeData) => {
    console.log("handleFileDelete", openFile);
  
    if (openFile && openFile.id) {
      dispatch({ type: 'SET_OPEN_FILE', payload: null });
  
      let newTreeData = [...treeData]; // Create a copy of treeData
      let newFileTabs = [...fileTabs];
      let newFileCode = {...fileCode};
      let newIsFileSaved = {...isFileSaved};
      let newActiveTabIndex = activeTabIndex;
  
      const deleteFile = (file) => {
        newTreeData = newTreeData.filter(object => object.id !== file.id); // Remove the file from newTreeData
  
        if (file.droppable) { // If the file is a folder, delete its children
          newTreeData.filter(child => child.parent === file.id).forEach(deleteFile);
        } 
        else {
          const id = file.id;
          const removeIndex = fileTabs.findIndex(object => object.id === id);
          newFileTabs = newFileTabs.filter(object => object.id !== file.id);
          delete newFileCode[id];
          delete newIsFileSaved[id];
    
          if (fileTabs.length > 1) {
            if (activeTabIndex === fileTabs.length - 1) {
              newActiveTabIndex--;
            } else if (removeIndex < activeTabIndex) {
              newActiveTabIndex--;
            }
          } else {
            newActiveTabIndex = 0;
          }
        }
      };
  
      deleteFile(openFile); // Start the deletion process
  
      console.log("newTreeData", newTreeData);
      dispatch({ type: 'SET_TREE_DATA', payload: newTreeData });

      console.log("newFileTabs", newFileTabs);
      dispatch({ type: 'SET_FILE_TABS', payload: newFileTabs });

      console.log("newFileCode", newFileCode);
      dispatch({ type: 'SET_FILE_CODE', payload: newFileCode });

      console.log("newIsFileSaved", newIsFileSaved);
      dispatch({ type: 'REPLACE_IS_FILE_SAVED', payload: newIsFileSaved });

      console.log("newActiveTabIndex", newActiveTabIndex);
      dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: newActiveTabIndex });
      
      deleteFirestoreCode(newFileCode, newTreeData);
    }
  };  

  const deleteFirestoreCode = async (newFileCode, newTreeData) => {
    if (auth.currentUser && auth.currentUser.uid) {
      const uid = auth.currentUser.uid;
      const ideRef = doc(db, "IDE", uid);

      try {
        await setDoc(ideRef, { code: newFileCode, files: newTreeData });
      } catch (error) {
        console.log("Error deleting firestore filecode", error);
      }
    }
  }

  const [hoveredFile, setHoveredFile] = useState(null);
  const clickedTemplate = useSelector(state => state.clickedTemplate);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const openTemplate = useSelector(state => state.openTemplate);
  const templateIsClicked = useSelector(state => state.templateIsClicked);
  const filesSectionOpen = useSelector(state => state.filesSectionOpen);
  const templatesSectionOpen = useSelector(state => state.templatesSectionOpen);
  const filesInitialOpen = useSelector(state => state.filesInitialOpen);
  const templatesInitialOpen = useSelector(state => state.templatesInitialOpen);

  const isFileSaved = useSelector(state => state.isFileSaved);

  return (
    <div style={{ minWidth: '240px', backgroundColor: 'var(--site-bg)', borderRight: '1px solid var(--border)' }}>
        <div style={{ height: "51px", alignItems: "center", display: "flex", direction: "row", borderBottom: '1px solid var(--border)' }}>
          <ActionIcon variant="subtle" aria-label="Settings" style={{ marginLeft: '10px' }}>
            <ChevronRightIcon 
                style={{ height: "30px", width: "30px" }}
                onClick={() => { dispatch({ type: 'SET_IS_FILE_LIST_OPEN', payload: false }); }}    
            />
          </ActionIcon>  
        </div>
      <ScrollArea scrollbars="y" scrollHideDelay={0} style={{ height: 'calc(100vh - 100px)' }} styles={{
        scrollbar: { background: 'transparent', backgroundColor: 'transparent', width: '15px', opacity: '1' },
        thumb: { backgroundColor: 'var(--selected-item)', borderRadius: '0' }
      }}>
        <div style={{ marginTop: '4px' , paddingLeft: '2px' }} className={`${styles.selectedBackground} ${styles.fileNameButtonRow} ${styles.vertCenterIcons}`}>
            <span className={styles.vertCenterIcons} onClick={() => dispatch({ type: 'TOGGLE_FILES_SECTION_OPEN' })}>{filesSectionOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
            <p className={`${styles.marginSpacing} ${styles.classTwo}`} style={{ color: 'var(--dim-text)' }}>
              <Text fw={700} size="lg">
                FILES
              </Text>
            </p>
            <div className={`${styles.rightAlign} ${styles.vertCenterIcons}`}>
              <ActionIcon variant="subtle"> 
                <NoteAddOutlinedIcon style={{ color: 'var(--dim-text)' }} onClick={() => {setShowFileForm(!showFileForm); setShowFolderForm(false);}}/>
              </ActionIcon>
              <ActionIcon variant="subtle">
                <CreateNewFolderOutlinedIcon style={{ color: 'var(--dim-text)' }} onClick={() => {setShowFolderForm(!showFolderForm); setShowFileForm(false);}}/>
              </ActionIcon>
              <ActionIcon variant="subtle">
                <IconTrash style={{ color: 'var(--dim-text)' }} onClick={() => handleFileDelete(openFile, treeData)}/>
              </ActionIcon>
            </div>
        </div>
            <div className={styles.marginSpacing}>
            </div>
        { filesSectionOpen && treeData &&
          <DndProvider backend={MultiBackend} options={getBackendOptions()} style={{ height: "100%" }}>
            <Tree
              tree={treeData}
              rootId={0}
              onDrop={handleDrop}
              render={(node, { depth, isOpen, onToggle }) => (
                <div 
                  style={{ backgroundColor: openFile && openFile.id === node.id ? 'var(--selected-item)' : hoveredFile && hoveredFile.id === node.id ? 'var(--hover)' : 'transparent' }}
                  onClick={() => dispatch({ type: 'SET_OPEN_FILE', payload: node })}
                  onMouseEnter={() => {
                    setHoveredFile(node);
                  }}
                  onMouseLeave={() => {
                    setHoveredFile(null); 
                  }}
                >
                  <div style={{ marginLeft: (depth + 1) * 20 + 2, color: (hoveredFile && hoveredFile.id === node.id) || (openFile && openFile.id === node.id) ? 'white' : 'var(--dim-text)' }} className={styles.vertCenterIcons}>
                    {node.droppable && (
                      <span className={styles.vertCenterIcons} onClick={onToggle}>{isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
                    )}
                    <img src={node.data && node.data.language ? LANGUAGE_ICON[node.data.language] : ''} className={styles.languageIcon}/>
                    {`${node.text}${node.data?.language ? FILE_EXTENSION[node.data.language] : ''}`.substring(0, 26 - (Math.floor((depth + 1) * 2.5)))}
                    {`${node.text}${node.data?.language ? FILE_EXTENSION[node.data.language] : ''}`.length > 26 - (Math.floor((depth + 1) * 2.5)) ? '...' : ''}
                  </div>
                </div>
              )}
              dragPreviewRender={(monitorProps) => (
                <div>{monitorProps.item.text}</div>
              )}
              style={{ height: "100%" }}
              onChangeOpen={(newOpenIds) => dispatch({ type: 'SET_FILES_INITIAL_OPEN', payload: newOpenIds })}
              initialOpen={filesInitialOpen ? filesInitialOpen : false}
            />
          </DndProvider> 
        }
        {showFileForm && (
          <Container>
            <form onSubmit={handleFileSubmit} style={{ margin: '10px 0' }}>
                <Select 
                  label="Language" 
                  data={['cpp', 'python', 'java']}
                  value={fileTypeInputValue}
                  onChange={(_value, option) => setFileTypeInputValue(_value)}
                  styles={{ 
                    input: { backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)'}, 
                    dropdown: { backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)'} 
                  }}
                  allowDeselect={false}
                />
                <TextInput
                    label="File name"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.currentTarget.value)}
                    autoFocus
                    styles={{ 
                      input: { backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)'}, 
                    }}  
                    placeholder="File Name"
                    rightSection={<ActionIcon variant="light" type="submit" radius="xl"><IconPlus /></ActionIcon>}
                />
            </form>
          </Container>
      )}
      {showFolderForm && (
        <Container>
          <form onSubmit={handleFolderSubmit}>
              <TextInput
                  label="Folder name"
                  type="text"
                  value={folderInputValue}
                  onChange={(e) => setFolderInputValue(e.currentTarget.value)}
                  autoFocus
                  styles={{ 
                    input: { backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)'}, 
                  }}  
                  placeholder="Folder Name"
                  rightSection={<ActionIcon variant="light" type="submit" radius="xl"><IconPlus /></ActionIcon>}
              />
          </form>
        </Container>
      )}   
        <div style={{ marginTop: '4px', paddingLeft: '2px' }} className={`${styles.selectedBackground} ${styles.fileNameButtonRow} ${styles.vertCenterIcons}`}>
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
                <div 
                  style={{ 
                    backgroundColor: (openTemplate || node.droppable) && clickedTemplate && clickedTemplate.id === node.id ? 'var(--selected-item)' : hoveredTemplate && hoveredTemplate.id === node.id ? 'var(--hover)' : 'transparent'
                  }}
                  onClick={() => {
                    dispatch({ type: 'SET_CLICKED_TEMPLATE', payload: node }); 
                    if (!node.droppable)
                    dispatch({ type: 'SET_OPEN_TEMPLATE', payload: { name: node.text, language: node.data.language }})
                  }}
                  onMouseEnter={() => {
                    setHoveredTemplate(node);
                  }}
                  onMouseLeave={() => {
                    setHoveredTemplate(null);
                  }}          
                  className={styles.vertCenterIcons}
                >
                  <div style={{ marginLeft: (depth + 1) * 20 + 2, color: (openTemplate || node.droppable) && ((hoveredTemplate && hoveredTemplate.id === node.id) || (clickedTemplate && clickedTemplate.id === node.id)) ? 'white' : 'var(--dim-text)' }} className={styles.vertCenterIcons}>
                    {node.droppable && (
                      <span className={styles.vertCenterIcons} onClick={onToggle}>{isOpen ? <ExpandMoreIcon />: <ChevronRightIcon />}</span>
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
              onChangeOpen={(newOpenIds) => dispatch({ type: 'SET_TEMPLATES_INITIAL_OPEN', payload: newOpenIds })}
              initialOpen={templatesInitialOpen ? templatesInitialOpen : false}
            />
          </DndProvider>
        }
      </ScrollArea>
    </div>
  );
};

export default FileList;
