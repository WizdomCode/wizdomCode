import React, { useEffect, useState, useRef } from 'react';
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
import { TEMPLATES } from '../templates.js';
import SaveIcon from '@mui/icons-material/Save';
import { useLocation } from "react-router-dom";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { dark } from '@mui/material/styles/createPalette.js';

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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

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

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.grey[300],
    backgroundColor: theme.palette.grey[900],
    boxShadow:
      'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: '#ffffff',
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const CodeEditor = (props) => {
  const [fileTabs, setFileTabs] = React.useState([]);
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  const theme = useTheme();
  const [filesOpen, setFilesOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setFilesOpen(true);
  };

  const handleDrawerClose = () => {
    setFilesOpen(false);
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
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
  
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {Object.keys(TEMPLATES).map((templateKey) => (
          <ListItem key={templateKey} disablePadding>
            <ListItemButton>
              <ListItemText primary={templateKey} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  useEffect(() => {
      if (editorRef.current) {
          Object.entries(TEMPLATES).forEach(([label, templates], index) => {
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
    if (fileTabs.length > 0) {
      const newFileTabs = [...fileTabs];
      newFileTabs[activeTabIndex] = {
        ...newFileTabs[activeTabIndex],
        code: code,
      };
      setFileTabs(newFileTabs);  
    }

    props.getCode(code, language);
    dispatch({
      type: 'SET_CODE_STATE',
      payload: {
        language: language,
        code: code
      }
    })
  }, [code]);

  const submitCode = async () => {
    console.log("CUSTOM TEST:", localInputData);

    // Start the timer
    const startTime = performance.now();

    const response = await fetch('https://e816-66-22-164-190.ngrok-free.app/execute', {
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

  const BGDARK = "#1B1B32";
  const UNSELECTED = "#0A0A23";

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
    const [fileTypeInputValue, setFileTypeInputValue] = useState("");
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
        const uid = auth.currentUser.uid;
        const ideRef = doc(db, "IDE", uid);
        try {
            const ideSnapshot = await getDoc(ideRef);
            if (ideSnapshot.exists()) {
                const existingIdeMap = ideSnapshot.data().ide || {};
                const folderPath = currentFolder !== "ide" ? `${currentFolder}.` : "";
                const updatedIdeMap = {
                    ...existingIdeMap,
                    [`${folderPath}${inputValue}`]: "blank"
                };
                const updatedFileTypes = {
                    ...ideSnapshot.data().fileTypes, // Existing file types map
                    [`${folderPath}${inputValue}`]: fileTypeInputValue // Add file type to fileTypes map
                };
                await setDoc(ideRef, { ide: updatedIdeMap, fileTypes: updatedFileTypes }, { merge: true });
                console.log("Document successfully written!");

                setFileTabs([...fileTabs, { name: `${folderPath}${inputValue}`, language: fileTypeInputValue, code: '' }]);
                setActiveTabIndex(fileTabs.length);
            } else {
                console.log("No such document!");
            }
            setInputValue("");
            setFileTypeInputValue(""); // Clear file type input value
            setShowFileForm(false);
            fetchUserData();
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    };
    
    const handleFolderSubmit = async (event) => {
        event.preventDefault();
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
                    console.log("Document successfully written!");
                }
            } else {
                console.log("No such document!");
            }
            setInputValue("");
            setShowFolderForm(false);
            fetchUserData(); // Call fetchUserData to update the file list
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    };

    const handleTabClose = (index) => {
      console.log("removing index", index);
      console.log("Current filetabs len", fileTabs.length);

      const newFileTabs = fileTabs.filter((_, i) => i !== index);

      setFileTabs(newFileTabs);    
    
      if (fileTabs.length > 1) {
        setActiveTabIndex(prevIndex => {
          console.log("New filetabs len", fileTabs.length);
          console.log("prevIndex", prevIndex);

          if (index === prevIndex && prevIndex === fileTabs.length - 1) {
            setCode(fileTabs[prevIndex - 1].code);
            return prevIndex - 1;
          } else if (index < prevIndex) {
            setCode(fileTabs[prevIndex - 1].code);
            return prevIndex - 1;
          }
          console.log("b");
          console.log("prevIndex", prevIndex);
          setCode(fileTabs[prevIndex].code);
          return prevIndex;
        });
      } else {
        setCode(null);
        setActiveTabIndex(0);
      }
    };

    useEffect(() => {
      console.log("Change in activeTabIndex", activeTabIndex);
    }, [activeTabIndex]);
    
    useEffect(() => {
      console.log("Change in fileTabs", fileTabs);
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
                    setActiveTabIndex(existingTabIndex);
                } else {
                    // If file doesn't exist, create a new file and set it as the active tab
                    setFileTabs([...fileTabs, { language: itemType, name: itemName, code: itemData }]);
                    setActiveTabIndex(fileTabs.length); // Set the new tab as the active tab
                    console.log("New tab:", { language: itemType, name: itemName, code: itemData });
                }
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching item data:", error);
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
                console.log("Document successfully updated!");
                setIsContentSaved(true);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error updating document:", error);
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
                    console.log("No such document!");
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    const renderFileOrFolder = (itemName, isFolder) => {
        if (isFolder) {
            return (
                <li key={itemName} onClick={() => handleItemClick(itemName)}>
                    <strong>Folder:</strong> {itemName}
                    <ul>
                        {userData && userData.ide && Object.keys(userData.ide).map((itemName, index) => (
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
            try {
                //const uid = auth.currentUser.uid;
                const ideRef = doc(db, "IDE", userId);
                const ideSnapshot = await getDoc(ideRef);
                if (ideSnapshot.exists()) {
                    const savedContent = ideSnapshot.data().ide[selectedItem];
                    setIsContentSaved(savedContent === code);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error checking content saved:", error);
            }
        };

        checkContentSaved(); // Call the function on component mount and whenever editedContent or selectedItem changes
    }, [code, selectedItem]);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
      <Main open={filesOpen}>
      <div className={styles.scrollableContent}>
        <div className={styles.tabWrapper}>
        <div className={styles.buttonRow}>
          {fileTabs.map((tab, index) => (
            <button className={styles.button} style={{background: index === activeTabIndex ? BGDARK : UNSELECTED, color: index === activeTabIndex ? "white" : "white"}} onClick={() => { setActiveTabIndex(index)}}>
              <p className={styles.buttonText}>{tab.name}</p>
              {<img className={styles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}} onClick={(e) => { e.stopPropagation(); handleTabClose(index); }}/>}
            </button>          
          ))
          }
          {<button 
            className={styles.newTab}
            onClick={handleDrawerOpen}
            style={{ ...(filesOpen && { display: 'none' }) }}            
          ><img src='/add.png' alt="Description" style={{minWidth: '10px', minHeight: '10px', background: 'transparent'}}/></button>}
          <div className={styles.rightAlign}>
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
                      {Object.entries(TEMPLATES).map(([templateName, languages], index) => (
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
                sx={{ ...(filesOpen && { display: 'none' }) }}
              >
                <MenuIcon style={{color: "white"}}/>
              </IconButton>
            </ThemeProvider>
          </div>
        </div>
        </div>
        <br />
        <PanelGroup direction="vertical">
        <Panel>
        {code ?
          <div className={styles.codeEditor}>
            <Editor
              theme="night-owl"
              height="100%"
              defaultLanguage="cpp"
              value={code}
              onChange={(value) => setCode(value)}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                fetch('/themes/Night Owl.json')
                  .then(data => data.json())
                  .then(data => {
                    console.log("theme data:", data);
                    monaco.editor.defineTheme('night-owl', data);
                    editor.updateOptions({ theme: 'night-owl' });
                  })
              }}
            />
          </div> :
          <div>
            Open a file to start coding!
          </div>
        }
        </Panel>
        <PanelResizeHandle style={{ position: 'relative', cursor: 'row-resize', background: '#ccc', height: '10px', zIndex: 1 }}/>
        <Panel>
        <div className={styles.inputOutputSection}>
          <div className={styles.tabWrapper}>
              <div className={styles.buttonRow}>
                <button 
                  className={styles.buttonTab} 
                  style={{background: inputOutputTab === 'input' ? "#1B1B32" : "#0A0A23", color: "white"}} 
                  onClick={() => {dispatch({ type: 'SET_INPUT_OUTPUT_TAB', payload: 'input' })}}
                >
                  <p className={styles.buttonText}>Input</p>
                </button>
                <button 
                  className={styles.buttonTab} 
                  style={{background: inputOutputTab === 'output' ? "#1B1B32" : "#0A0A23", color: "white"}} 
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
            />
          ) : (
            <Editor
              theme="vs-dark"
              defaultLanguage="cpp"
              height="80%"
              value={localOutputData}
              onChange={(value) => setLocalOutputData(value)}
            />
          )}
        </div>
        </Panel>
        </PanelGroup>
      </div>
      </Main>
      <ThemeProvider theme={darkTheme}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={filesOpen}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
          {!showFileForm && (
                <button onClick={() => setShowFileForm(true)}>Create File</button>
            )}
            {showFileForm && (
                <form onSubmit={handleFileSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        style={{color: "white"}}
                    />
                    <input
                        type="text"
                        value={fileTypeInputValue}
                        onChange={(e) => setFileTypeInputValue(e.target.value)}
                        placeholder="File Type"
                        style={{color: "white"}}
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
            {!showFolderForm && (
                <button onClick={() => setShowFolderForm(true)}>Create Folder</button>
            )}
            {showFolderForm && (
                <form onSubmit={handleFolderSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        autoFocus
                        style={{color: "white"}}
                    />
                    <button type="submit">Submit</button>
                </form>
            )}
            <p>Files and Folders:</p>
            <ul>
                {userData && userData.ide && Object.keys(userData.ide).map((itemName, index) => (
                    renderFileOrFolder(itemName, userData.ide[itemName].__isFolder)
                ))}
            </ul>
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
      </Drawer>
      </ThemeProvider>
    </Box>
    </>
  );
};

export default CodeEditor;
