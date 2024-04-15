import React, { useEffect, useState, useRef } from 'react';
import Split from 'react-split';
import styles from '../../styles/Editor.module.css';
import '../../styles/Editor.css';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import * as monaco from 'monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TEMPLATES } from '../templates.js';

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

  const [code, setCode] = useState(props.boilerPlate);
  const [output, setOutput] = useState([]);
  const [language, setLanguage] = useState("cpp");
  const languageRef = useRef(language); // Create a ref for the language

  // Update the ref whenever the language changes
  useEffect(() => {
    languageRef.current = language;
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

  return (
    <>
      <div className={styles.scrollableContent}>
        <div className={styles.buttonRow}>
          <button className={styles.button} style={{background: language === "python" ? BGDARK : UNSELECTED, color: language === "python" ? "white" : "white"}} onClick={() => { setLanguage("python")}}>
            <p className={styles.buttonText}>Python</p>
            {false && <img className={styles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}/>}
          </button>
          <button className={styles.button} style={{background: language === "java" ? BGDARK : UNSELECTED, color: language === "java" ? "white" : "white"}} onClick={() => { setLanguage("java")}}>
            <p className={styles.buttonText}>Java</p>
            {false && <img className={styles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}/>}  
          </button>
          <button className={styles.button} style={{background: language === "cpp" ? BGDARK : UNSELECTED, color: language === "cpp" ? "white" : "white"}} onClick={() => { setLanguage("cpp")}}>
            <p className={styles.buttonText}>C++</p>
            {false && <img className={styles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}/>}  
          </button>
          {false && <button className={styles.newTab}><img src='/add.png' alt="Description" style={{minWidth: '10px', minHeight: '10px', background: 'transparent'}}/></button>}
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
                  id="demo-customized-button"
                  aria-controls={open ? 'demo-customized-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  variant="contained"
                  disableElevation
                  onClick={handleClick}
                >
                  <MoreVertIcon style={{ color: 'white' }}/>
                </IconButton>
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose} disableRipple>
                    <EditIcon />
                    Minimize
                  </MenuItem>
                  <MenuItem onClick={handleClose} disableRipple>
                    <FileCopyIcon />
                    Duplicate
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleClose} disableRipple>
                    <ArchiveIcon />
                    Archive
                  </MenuItem>
                  <MenuItem onClick={handleClose} disableRipple>
                    <MoreHorizIcon />
                    More
                  </MenuItem>
                </StyledMenu>
              </div>
            </ThemeProvider>
          </div>
        </div>
        <br />
        <PanelGroup direction="vertical">
        <Panel>
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
        </div>
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
                    <p className={styles.buttonText}>SUBMIT</p>
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
    </>
  );
};

export default CodeEditor;
