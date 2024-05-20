import React, { useEffect, useState, useRef, useReducer } from 'react';
import Split from 'react-split';
import styles from '../../styles/Editor.module.css';
import '../../styles/Editor.css';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import * as monaco from 'monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { auth, app, db } from "../../../firebase.js";
import { collection, getDocs, addDoc, getDoc, doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { TEMPLATE_CODE } from '../templates.js';
import SaveIcon from '@mui/icons-material/Save';
import { useLocation } from "react-router-dom";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { dark } from '@mui/material/styles/createPalette.js';
import { 
  NativeSelect,
  useMantineTheme,
} from '@mantine/core';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import CodeSpace from './CodeSpace.jsx';
import { CodeHighlight } from '@mantine/code-highlight';
import {
  IconFolderOpen
} from '@tabler/icons-react';

const FILE_EXTENSION = {
  python: ".py",
  java: ".java",
  cpp: ".cpp"
};

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
    /**
     * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
     * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
     * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
     * proper interaction with the underlying content.
     */
    position: 'relative',
  }),
);


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


const CodeEditor = (props) => {
  const fileTabs = useSelector(state => state.fileTabs);
  const activeTabIndex = useSelector(state => state.activeFileTab);

  const mantineTheme = useMantineTheme();
  const [filesOpen, setFilesOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setFilesOpen(true);
  };


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
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [code, setCode] = useState(null);
  const [output, setOutput] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const languageRef = useRef(language); // Create a ref for the language

  useEffect(() => {
    if (fileTabs[activeTabIndex]) {
      console.log(fileTabs[activeTabIndex]);
      setCode(fileTabs[activeTabIndex].code);
    }
  }, [activeTabIndex]);

  // Update the ref whenever the language changes
  useEffect(() => {
    languageRef.current = language;
    console.log("language", language);
  }, [language]);

  const inputOutputTab = useSelector(state => state.inputOutputTab);
  const inputData = useSelector(state => state.inputData);
  const outputData = useSelector(state => state.outputData);
  const [localInputData, setLocalInputData] = useState(inputData);
  const [localOutputData, setLocalOutputData] = useState(outputData);

  const dispatch = useDispatch();

  const editorRef = useRef(null);

  const [actions, setActions] = useState([]); 
  

  useEffect(() => {
      if (editorRef.current) {
          Object.entries(TEMPLATE_CODE).forEach(([label, templates], index) => {
              console.log("AAAAAAAAAAAAAAAAAAH");
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

  useEffect(() => {
    props.getCode(code, language);
    if (fileTabs && fileTabs[activeTabIndex] && fileTabs[activeTabIndex].language) {
      dispatch({
        type: 'SET_CODE_STATE',
        payload: {
          language: fileTabs[activeTabIndex].language,
          code: code
        }
      })
    }

    console.log("CODE TO SUBMIT", code);
    if (fileTabs && fileTabs[activeTabIndex] && fileTabs[activeTabIndex].language) console.log("Language", fileTabs[activeTabIndex].language);
  }, [code]);

  const submitCode = async () => {
    console.log("CUSTOM TEST:", localInputData);

    // Start the timer
    const startTime = performance.now();

    const response = await fetch(`${import.meta.env.VITE_APP_JUDGE_URL}execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language: language,
        code: code,
        test_cases: [{ key: 1, input: localInputData, output: ''}]
      })
    });

    // End the timer and calculate the elapsed time
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(`Execution time: ${elapsedTime} milliseconds`);

    console.log("sent code");
    const data = await response.json();
    console.log(data);
    setLocalOutputData(data[0].stdout + `\nExecution time: ${data[0].time}s`);
  };  


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
        console.log("User is not authenticated");
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
              console.log("Code loaded for question:", questionName);
            } else {
              setCode(props.boilerPlate); // Use default boilerplate code
              console.log("No saved code found for question. Using default boilerplate.");
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching code:", error);
        }
      }
    };
  
    fetchCode();
  }, [currentTab, lessonProblemData, tabIndex, props.boilerPlate]);
  
  
  const saveCode = async () => {
    let questionName = "";
  
    // Determine the question name based on the location and Redux state
    if (location.pathname === '/problems' && currentTab && currentTab.data) {
      console.log("a");
      console.log("This is the question name:", currentTab.data.title);
      questionName = currentTab.data.title;
    } else if (lessonProblemData && lessonProblemData[tabIndex]) {
      console.log("b");
      console.log("This is the question name:", lessonProblemData[tabIndex].data.title);
      questionName = lessonProblemData[tabIndex].data.title;
    } else {
      console.log("No active question");
      return; // Exit the function if there's no active question
    }
  
    // Check if the user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("User is not authenticated");
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
          // Update the questionsIDE map with the word "amongus" inside the key corresponding to the question name
          await updateDoc(userDocRef, {
            [`questionsIDE.${questionName}`]: code
          });
          console.log("Word", code, "saved for question:", questionName);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error saving code:", error);
      }
    }
  }
  
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

    const handleTabClose = (index) => {
      console.log("removing index", index);
      console.log("Current filetabs len", fileTabs.length);

      dispatch({ type: 'REMOVE_FILE_TAB_BY_INDEX', payload: index });
    
      if (fileTabs.length > 1) {
        console.log("New filetabs len", fileTabs.length);
        console.log("prevIndex", activeTabIndex);

        if (activeTabIndex === fileTabs.length - 1) {
          console.log("New filetabs len", fileTabs.length);
          setCode(fileTabs[activeTabIndex - 1].code);
          dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: activeTabIndex - 1 });
          return;
        } else if (index < activeTabIndex) {
          setCode(fileTabs[activeTabIndex - 1].code);
          dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: activeTabIndex - 1 });
          return;
        }
        console.log("b");
        console.log("prevIndex", activeTabIndex);
        setCode(fileTabs[activeTabIndex].code);
        dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: activeTabIndex });
        return;
      } else {
        setCode(null);
        dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: 0 });
        return;
      }
    };

    useEffect(() => {
      console.log("Change in activeTabIndex", activeTabIndex);
    }, [activeTabIndex]);
    
    useEffect(() => {
      console.log("Change in fileTabs", fileTabs);
    }, [fileTabs]);

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
                    console.log("No such document!");
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

  const treeData = useSelector(state => state.treeData);
  const fileCode = useSelector(state => state.fileCode);

  useEffect(() => {
    console.log("CHANGE IN FILECODE", fileCode);
  }, [fileCode]);

  const openFile = useSelector(state => state.openFile);

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
          console.log("New tab:", { id: openFile.id, language: openFile.data.language, name: openFile.text, code: fileCode[openFile.id] });
      }
    };

    if (openFile && !openFile.droppable) {
      handleFileClick();
    }
  }, [openFile]);

  const openTemplate = useSelector(state => state.openTemplate);

  return (
    <>
      <Main open={filesOpen} style={{ width: '100%' }}>
      <div className={styles.scrollableContent} style={{ backgroundColor: 'var(--code-bg)' }}>
        <div className={styles.tabWrapper}>
        <div className={styles.buttonRow} style={{ backgroundColor: 'var(--site-bg)', justifyContent: 'space-between', display: 'flex', flexDirection: 'row', width: '100%', maxWidth: '100%', boxSizing: 'border-box'}}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {<IconFolderOpen 
              className={styles.newTab}
              onClick={() => dispatch({ type: 'SET_IS_FILE_LIST_OPEN', payload: true })}
              style={{ ...(filesOpen && { display: 'none' }), marginRight: '10px' }}            
            />}
            {fileTabs.map((tab, index) => (
              <button className={styles.button} style={{background: index === activeTabIndex ? 'var(--code-bg)' : 'var(--site-bg)', color: index === activeTabIndex ? "white" : "white"}} onClick={() => { dispatch({ type: 'SET_ACTIVE_FILE_TAB', payload: index }); }}>
                <p className={styles.buttonText}>{`${tab.name}${tab.language ? FILE_EXTENSION[tab.language] : ''}`}</p>
                {<img className={styles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}} onClick={(e) => { e.stopPropagation(); handleTabClose(index); }}/>}
              </button>          
            ))
            }
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <ThemeProvider theme={darkTheme}>
              <div>
                {['right'].map((anchor) => (
                  <React.Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>TEMPLATES</Button>
                    <Drawer
                      anchor={anchor}
                      open={state[anchor]}
                      onClose={toggleDrawer(anchor, false)}
                    >
                      {Object.entries(TEMPLATE_CODE).map(([templateName, languages], index) => (
                        <Accordion expanded={expanded === `${index}`} onChange={handleChange(`${index}`)} key={`${index}`}>
                          <AccordionSummary aria-controls={`${index}-content`} id={`${index}-header`}>
                            <Typography>{`Insert ${templateName}`}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                          {Object.entries(languages).map(([language, code]) => (
                            <div key={language}>
                              <Typography variant="h6">{language.toUpperCase()}</Typography>
                              <div style={{position: 'relative'}}>
                                <SyntaxHighlighter language={language.toLowerCase()} style={solarizedlight}>
                                  {code}
                                </SyntaxHighlighter>
                                <CopyToClipboard text={code}>
                                  <button style={{position: 'absolute', top: 2, right: 2}}><ContentCopyIcon /></button>
                                </CopyToClipboard>
                                </div>
                            </div>
                          ))}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Drawer>
                  </React.Fragment>
                ))}
              </div>
              <div>
                <IconButton
                  className={styles.buttonIcon}
                  onClick={() => {
                }}>
                  <SaveIcon style={{color: 'white'}} onClick={() => { saveCode() }}/>
                </IconButton>
              </div>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                sx={{ ...(true && { display: 'none' }) }}
              >
                <MenuIcon style={{color: "white"}}/>
              </IconButton>
              <MenuIcon
                style={{color: "white"}}
                onClick={() => { dispatch({ type: 'SET_IS_FILE_LIST_OPEN', payload: true }); }}
              />
            </ThemeProvider>
          </div>
        </div>
        </div>
        <br />
        <PanelGroup direction="vertical" style={{ width: '100%' }}>
        <Panel style={{ width: '100%' }} defaultSize={70}>
        {openTemplate ? 
        (
          <div>
            <Typography variant="h6">{openTemplate.name}</Typography>
            <div style={{position: 'relative'}}>
              <SyntaxHighlighter language={openTemplate.language} style={solarizedlight}>
                {TEMPLATE_CODE[openTemplate.name][openTemplate.language]}
              </SyntaxHighlighter>
              <CopyToClipboard text={TEMPLATE_CODE[openTemplate.name][openTemplate.language]}>
                <button style={{position: 'absolute', top: 2, right: 2}}><ContentCopyIcon /></button>
              </CopyToClipboard>
              </div>
          </div>
        ) :
        (fileTabs.length > 0 ?
          <div className={styles.codeEditor}>
            <CodeSpace
              height="100%"
              language={fileTabs[activeTabIndex].language}
              value={fileCode[fileTabs[activeTabIndex].id]}
              onValueChange={(value) => {
                dispatch({ type: 'UPDATE_FILE_CODE', key: fileTabs[activeTabIndex].id, value: value })
                setCode(value);
              }}
              fileTabs={fileTabs}
              fileCode={fileCode}
              treeData={treeData}
              path={fileTabs[activeTabIndex].id}
            />
          </div> :
          <div>
            Open a file to start coding!
          </div>
        )}
        </Panel>
        <PanelResizeHandle style={{ position: 'relative', cursor: 'row-resize', background: '#ccc', height: '10px', zIndex: 1 }}/>
        <Panel>
        <div className={styles.inputOutputSection}>
          <div className={styles.tabWrapper}>
              <div className={styles.buttonRow} style={{ backgroundColor: 'var(--site-bg)' }}>
                <button 
                  className={styles.buttonTab} 
                  style={{background: inputOutputTab === 'input' ? 'var(--code-bg)' : 'var(--site-bg)', color: "white"}} 
                  onClick={() => {dispatch({ type: 'SET_INPUT_OUTPUT_TAB', payload: 'input' })}}
                >
                  <p className={styles.buttonText}>Input</p>
                </button>
                <button 
                  className={styles.buttonTab} 
                  style={{background: inputOutputTab === 'output' ? 'var(--code-bg)' : 'var(--site-bg)', color: "white"}} 
                  onClick={() => {dispatch({ type: 'SET_INPUT_OUTPUT_TAB', payload: 'output' })}}
                >
                  <p className={styles.buttonText}>Output</p>
                </button>
                <div className={styles.rightAlign}>
                  <button 
                    className={styles.buttonIcon}
                    onClick={() => {
                    submitCode();
                    dispatch({ type: 'SET_INPUT_OUTPUT_TAB', payload: 'output' });
                  }}>
                    <p className={styles.buttonText}>RUN</p>
                  </button>
                </div>
              </div>
          </div>
          <br />
          { inputOutputTab === 'input' ? (
            <Editor
              theme="vs-dark"
              defaultLanguage="cpp"
              height="80%"
              value={localInputData}
              onChange={(value) => setLocalInputData(value)}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                fetch('/themes/Night Owl Custom.json')
                  .then(data => data.json())
                  .then(data => {
                    console.log("theme data:", data);
                    monaco.editor.defineTheme('night-owl', data);
                    editor.updateOptions({ theme: 'night-owl' });
                  })
              }}
            />
          ) : (
            <Editor
              theme="vs-dark"
              defaultLanguage="cpp"
              height="80%"
              value={localOutputData}
              onChange={(value) => setLocalOutputData(value)}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                fetch('/themes/Night Owl Custom.json')
                  .then(data => data.json())
                  .then(data => {
                    console.log("theme data:", data);
                    monaco.editor.defineTheme('night-owl', data);
                    editor.updateOptions({ theme: 'night-owl' });
                  })
              }}
            />
          )}
        </div>
        </Panel>
        </PanelGroup>
      </div>
      </Main>
    </>
  );
};

export default CodeEditor;
