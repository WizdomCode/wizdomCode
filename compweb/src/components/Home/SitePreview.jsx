import React, { useRef } from 'react'
import styles from '../styles/ProblemDescription.module.css';
import "../../Fonts.css";
import { Link } from "react-router-dom";
import '../styles/Workspace.css';
import "../styles/Paths.css";
import { 
  ScrollArea,
  Group,
  Button,
  rem,
  Tooltip,
  UnstyledButton,
  Center,
  Stack,
  Container,
  ActionIcon,
  Text
} from '@mantine/core';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  IconNotebook,
  IconCircleDashedCheck,
  IconBook,
  IconFlask,
  IconSearch,
  IconUserCircle,
  IconSettings,
  IconTrash,
  IconPointFilled,
  IconDeviceFloppy,
  IconMaximize,
  IconMinimize
} from '@tabler/icons-react'
import classes from '../Navigation/NavbarMinimal.module.css';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CodeHighlight } from '@mantine/code-highlight';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { TEMPLATES } from '../Workspace/ProblemDescription/Templates.js';
import { DndProvider } from 'react-dnd';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import fileStyles from '../Workspace/ProblemDescription/FileList.module.css';
import { styled } from '@mui/material';
import { Editor } from '@monaco-editor/react';
import editorStyles from '../styles/Editor.module.css';

function NavbarLink({ icon: Icon, label, active, onClick, path }) {
  return (
    <Link to={path}>
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
            <Icon style={{ width: rem(40), height: rem(40) }} stroke={1.5} />
        </UnstyledButton>
        </Tooltip>
    </Link>
  );
}

const UsacoIcon = () => <img src='/usaco.png' alt="Usaco Paths" style={{width: rem(40), height: rem(40)}}/>;
const CCCIcon = () => <img src='/ccc.png' alt="CCC Paths" style={{width: rem(40), height: rem(40)}}/>;

const mockdata = [
    { icon: IconSearch, label: 'Problems', path: '/problems', isActive: true },
];

const contestdata = [
    { icon: UsacoIcon, label: 'USACO', path: '/usaco', dispatch: { type: 'SET_ACTIVE_PATH_TAB', payload: 'usaco' } },
    { icon: CCCIcon, label: 'CCC', path: '/ccc', dispatch: { type: 'SET_ACTIVE_PATH_TAB', payload: 'ccc' } },
];

function SideNav() {

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.isActive}
    />
  ));

  const contestlinks = contestdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
    />
  ));

  return (
    <>
      <nav className={classes.navbar} style={{ backgroundColor: 'var(--site-bg)' }}>
        <Center>
          <Stack justify="center" gap={10}>
            {links}
          </Stack>
        </Center>

        <div className={classes.navbarMain}>
          <Stack justify="center" gap={10}>
            {contestlinks}
          </Stack>
        </div>

        <Stack justify="center" gap={0}>
              <NavbarLink icon={IconUserCircle} label="Profile" path={"/userprofile"}/>
              <NavbarLink icon={IconSettings} label="Settings" path={""}/>
        </Stack>
      </nav>
    </>
  );
}

const tabs = [
  {
    data: null,
    id: "601e22cc-5259-47c8-8633-54beffaedf17",
    type: 'newTab'
  },
  {
    data: {
      constraints: '',
      contest: 'CCC',
      description: "There is a new conveyor belt sushi restaurant in town. Plates of sushi travel around the restaurant on a raised conveyor belt and customers choose what to eat by removing plates.\n\nEach red plate of sushi costs $$\\$3$$, each green plate of sushi costs $$\\$4$$, and each blue plate of sushi costs $$\\$5$$.\n\nYour job is to determine the cost of a meal, given the number of plates of each colour chosen by a customer.",
      folder: "conveyorBeltSushi",
      inputFormat: "The first line of input contains a non-negative integer, $R$, representing the number of red plates chosen. The second line contains a non-negative integer, $G$, representing the number of green plates chosen. The third line contains a non-negative integer, $B$, representing the number of blue plates chosen.",
      outputFormat: "Output the non-negative integer, $C$, which is the cost of the meal in dollars.",
      points: 3,
      sample1: {
        explanation: "This customer chose $0$ red plates, $2$ green plates, and $4$ blue plates. Therefore, the cost of the meal in dollars is $0 \\times 3 + 2 \\times 4 + 4 \\times 5 = 28$.",
        input: "0\n2\n4",
        output: "28"
      },
      specificContest: "Canadian Computing Competition: 2024 Stage 1, Junior #1",
      title: "Conveyor Belt Sushi"
    },
    id: "2e700698-5cf5-48bc-bb59",
    type: 'problem',
    isActive: true
  },
]

const Tab = ({ index, tab, isActive, type, setDraggedTab, setQuestionID, currentPage }) => {

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
    <div style={{ position: 'relative' }}>
      <button 
        id={index}
        draggable="true"
        className={styles.buttonTab} 
        style={{borderRight: 'calc(0.0625rem* var(--mantine-scale)) solid var(--border)', borderTop: 'none', background: isActive ? 'var(--site-bg)' : 'var(--site-bg)', color: "white", width: `${text.length * 1.3}ch`, minWidth: '156px'}} 
      >
        <p className={styles.buttonText} style={{ color: (isActive) ? 'white' : 'var(--dim-text)'}}>{text}</p>
        { (isActive) && type !== 'lesson' &&
        <img 
          className={styles.closeIcon} 
          src='/close.png' 
          alt="Close tab" 
          style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}}            
        />
        }
      </button>
      
      { isActive && <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'var(--accent)', height: '2px' }}/>}
    </div>
  );
};

const ProblemDescription = ({ currentTab, selectedTab }) => {

  function isList(str) {
    const regex = /^(- |\d+\. )/;
    return regex.test(str);
  }
  
  function parseText(str) {
    return str
      .split('\n')
      .map((str) => {
        if (str.startsWith('<img')) {
          return `<div class="${styles.descriptionImgWrapper}">${str}</div>`
        } else if (!isList(str)) {
          return `<span class="${styles.descriptionText}">${str}</span><br />`;
        } else {
          return `<span class="${styles.indent}">${str}</span>\n`;
        }
      })
      .join('\n')
  }

  function customParser(text) {
      const newText = text
        .split('!table')
        .map((str, index) => {
          if (index % 2 === 0) {
            return `${parseText(str)}`;
          } else {
            return str;
          }
        })
        .join('')
      return newText;
    }

  return (
    <Container>
      {selectedTab === 'question' && (            
        <div className={styles.wrapper}>
          <br />
          <Center>
            <Group>
              <div className={styles.problemTitleRow}>
                <h1 className={styles.title}>{currentTab.data.title}</h1>
              </div>
            </Group>
          </Center>
          <br />
          <div className={styles.description}>
            {currentTab.data.description && (
              <>
                {currentTab.data.specificContest && <h3>{currentTab.data.specificContest}</h3>}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  children={customParser(currentTab.data.description.replace(/\\n/g, '\n'))}
                />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.inputFormat && (
              <>
                <h3>Input Format</h3>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  children={customParser(currentTab.data.inputFormat.replace(/\\n/g, '\n'))}
                />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.constraints && (
              <>
                <h3>Constraints</h3>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  children={customParser(currentTab.data.constraints.replace(/\\n/g, '\n'))}
                />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.outputFormat && (
              <>
                <h3>Output Format</h3>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  children={customParser(currentTab.data.outputFormat.replace(/\\n/g, '\n'))}
                />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.sample1 && currentTab.data.sample1.input && (
              <>
                <h3>Sample Input 1</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample1.input.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Output for Sample Input 1</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample1.output.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Explanation for Sample 1</h3>
                {currentTab.data.sample1.explanation && 
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    children={customParser(currentTab.data.sample1.explanation.replace(/\\n/g, '\n'))} 
                  />
                }
                <br />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.sample2 && currentTab.data.sample2.input && (
              <>
                <h3>Sample Input 2</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample2.input.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Output for Sample Input 2</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample2.output.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Explanation for Sample 2</h3>
                {currentTab.data.sample2.explanation && 
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    children={customParser(currentTab.data.sample2.explanation.replace(/\\n/g, '\n'))} 
                  />
                }                <br />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.sample3 && currentTab.data.sample3.input && (
              <>
                <h3>Sample Input 3</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample3.input.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Output for Sample Input 3</h3>
                <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample3.output.replace(/\\n/g, '\n')} language="txt" />
                <br />
                <h3>Explanation for Sample 3</h3>
                {currentTab.data.sample3.explanation && 
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    children={customParser(currentTab.data.sample3.explanation.replace(/\\n/g, '\n'))} 
                  />
                }                <br />
                <div className={styles.divider}></div>
                <br />
              </>
            )}
            {currentTab.data.points && (
              <>
                <h3>Points</h3>
                <p>{currentTab.data.points}</p>
              </>
            )}
          </div>
          <br />
          <br />
          <button className={styles.runAll} style={{color: 'white'}}>Run all tests</button>
          <br />
        </div> 
      )}
    </Container>
  );
};

const SitePreview = () => {
  
  return (
    <>
      <div style={{ 
        display: 'flex', 
        direction: 'row', 
        height: '80vh', 
        width: '80vw', 
        border: '1px solid var(--border)', 
        boxShadow: '0px -2px 0px 0px #202740, 0 -20px 80px 1px #181a25'
      }}>
      <SideNav />
      <PanelGroup direction="horizontal" style={{ overflow: 'auto' }}>
      <Panel defaultSize={35} minSize={14} collapsible={true} collapsedSize={0}>
      <div className={styles.row} style={{ backgroundColor: 'var(--site-bg)' }}>
        <div className={styles.problemStatement} style={{ borderRight: '1px solid var(--border)' }}>
          <div style={{ width: '100%' }}>
          <ScrollArea scrollbars="x" scrollHideDelay={0} style={{ width: '100%' }} styles={{
            scrollbar: { background: 'transparent', backgroundColor: 'transparent', height: '7px', opacity: '1' },
            thumb: { backgroundColor: 'var(--selected-item)', borderRadius: '0' }
          }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderBottom: '1px solid var(--border)' }} onDragOver={(e) => e.preventDefault()}>
                {tabs.map((tab, index) => (
                  <>
                    <Tab
                      key={index}
                      index={index}
                      tab={tab}
                      isActive={tab.isActive}
                    />
                  </>
                ))}
                <button className={styles.newTab}>
                  <img src='/add.png' alt="New tab" style={{minWidth: '10px', minHeight: '10px', background: 'transparent'}}/>
                </button>
                <div className={styles.rightAlign}>
                </div>
            </div>
          </ScrollArea>
          </div>
          <Group gap={0} bg={'var(--code-bg)'} mt={6}>
            <Button style={{ color: true ? 'white' : 'var(--dim-text)' }} size="compact-md" variant="subtle" leftSection={<IconNotebook style={{ marginRight: '-8' }}/>}>Description</Button>
            <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--selected-item)' }} />
            <Button style={{ color: false ? 'white' : 'var(--dim-text)' }} size="compact-md" variant="subtle" leftSection={<IconFlask style={{ marginRight: '-8' }}/>}>Test cases</Button>
            <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--selected-item)' }} />
            <Button style={{ color: false ? 'white' : 'var(--dim-text)' }} size="compact-md" variant="subtle" leftSection={<IconCircleDashedCheck style={{ marginRight: '-8' }}/>}>Solutions</Button>
          </Group>
          <ScrollArea scrollHideDelay={0} className={styles.scrollableContent} styles={{
            scrollbar: { background: 'transparent', backgroundColor: 'transparent', width: '15px', opacity: '1' },
            thumb: { backgroundColor: 'var(--selected-item)', borderRadius: '0' }
          }}>
            <ProblemDescription currentTab={tabs[1]} selectedTab={'question'}/>
          </ScrollArea>
        </div>
      </div>
      </Panel>
      <PanelResizeHandle className={styles.panelResizeHandle} />
      <Panel defaultSize={65} minSize={14} collapsible={true} collapsedSize={0} style={{display: 'grid', gridTemplateColumns: true ? '1fr 3fr' : '1fr' }}>
        <FileList />
        <CodeEditor />
      </Panel>
      </PanelGroup>
      </div>
    </>
  )
}

const FileList = (props) => {
  
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
  
  const LANGUAGE_ICON = {
      python: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-plain.svg",
      java: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-plain.svg",
      cpp: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-plain.svg"  
  };

  const openFile = initialData[2];
  const hoveredFile = null;
  const openTemplate = null;
  const clickedTemplate = null;
  const hoveredTemplate = null;

  return (
    <div style={{ minWidth: '240px', backgroundColor: 'var(--site-bg)', borderRight: '1px solid var(--border)' }}>
        <div style={{ height: "51px", alignItems: "center", display: "flex", direction: "row", borderBottom: '1px solid var(--border)' }}>
          <ActionIcon variant="subtle" aria-label="Settings" style={{ marginLeft: '10px' }}>
            <ChevronRightIcon 
                style={{ height: "30px", width: "30px" }}
            />
          </ActionIcon>  
        </div>
        <div style={{ marginTop: '4px' , paddingLeft: '2px' }} className={`${fileStyles.selectedBackground} ${fileStyles.fileNameButtonRow} ${fileStyles.vertCenterIcons}`}>
            <span className={fileStyles.vertCenterIcons}>{true ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
            <p className={`${fileStyles.marginSpacing} ${fileStyles.classTwo}`} style={{ color: 'var(--dim-text)' }}>
              <Text fw={700} size="lg">
                FILES
              </Text>
            </p>
            <div className={`${fileStyles.rightAlign} ${fileStyles.vertCenterIcons}`}>
              <ActionIcon variant="subtle"> 
                <NoteAddOutlinedIcon style={{ color: 'var(--dim-text)' }}/>
              </ActionIcon>
              <ActionIcon variant="subtle">
                <CreateNewFolderOutlinedIcon style={{ color: 'var(--dim-text)' }}/>
              </ActionIcon>
              <ActionIcon variant="subtle">
                <IconTrash style={{ color: 'var(--dim-text)' }}/>
              </ActionIcon>
            </div>
        </div>
            <div className={fileStyles.marginSpacing}>
            </div>
          <DndProvider backend={MultiBackend} options={getBackendOptions()} style={{ height: "100%" }}>
            <Tree
              tree={initialData}
              rootId={0}
              render={(node, { depth, isOpen, onToggle }) => (
                <div 
                  style={{ backgroundColor: openFile && openFile.id === node.id ? 'var(--selected-item)' : hoveredFile && hoveredFile.id === node.id ? 'var(--hover)' : 'transparent' }}
                >
                  <div style={{ marginLeft: (depth + 1) * 20 + 2, color: (hoveredFile && hoveredFile.id === node.id) || (openFile && openFile.id === node.id) ? 'white' : 'var(--dim-text)' }} className={fileStyles.vertCenterIcons}>
                    {node.droppable && (
                      <span className={fileStyles.vertCenterIcons} onClick={onToggle}>{isOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
                    )}
                    <img src={node.data && node.data.language ? LANGUAGE_ICON[node.data.language] : ''} className={fileStyles.languageIcon}/>
                    {`${node.text}${node.data && node.data.language ? FILE_EXTENSION[node.data.language] : ''}`}
                  </div>
                </div>
              )}
              dragPreviewRender={(monitorProps) => (
                <div>{monitorProps.item.text}</div>
              )}
              style={{ height: "100%" }}
              initialOpen={true}
            />
          </DndProvider> 
        <div style={{ marginTop: '4px', paddingLeft: '2px' }} className={`${fileStyles.selectedBackground} ${fileStyles.fileNameButtonRow} ${fileStyles.vertCenterIcons}`}>
            <span className={fileStyles.vertCenterIcons}>{true ? <ExpandMoreIcon /> : <ChevronRightIcon />}</span>
            <p className={`${fileStyles.marginSpacing} ${fileStyles.classTwo}`} style={{ color: 'var(--dim-text)' }}>
              <Text fw={700} size="lg">
                CODE TEMPLATES
              </Text>
            </p>
            <div className={`${fileStyles.rightAlign} ${fileStyles.vertCenterIcons}`}>
            </div>
        </div>
        <DndProvider backend={MultiBackend} options={getBackendOptions()} style={{ height: "100%" }}>
          <Tree
            tree={TEMPLATES}
            rootId={0}
            render={(node, { depth, isOpen, onToggle }) => (
              <div 
                style={{ 
                  backgroundColor: (openTemplate || node.droppable) && clickedTemplate && clickedTemplate.id === node.id ? 'var(--selected-item)' : hoveredTemplate && hoveredTemplate.id === node.id ? 'var(--hover)' : 'transparent'
                }}          
                className={fileStyles.vertCenterIcons}
              >
                <div style={{ marginLeft: (depth + 1) * 20 + 2, color: (openTemplate || node.droppable) && ((hoveredTemplate && hoveredTemplate.id === node.id) || (clickedTemplate && clickedTemplate.id === node.id)) ? 'white' : 'var(--dim-text)' }} className={fileStyles.vertCenterIcons}>
                  {node.droppable && (
                    <span className={fileStyles.vertCenterIcons} onClick={onToggle}>{isOpen ? <ExpandMoreIcon />: <ChevronRightIcon />}</span>
                  )}
                  <img src={node.data && node.data.language ? LANGUAGE_ICON[node.data.language] : ''} className={fileStyles.languageIcon}/>
                  {`${node.text}${node.data && node.data.language ? FILE_EXTENSION[node.data.language] : ''}`}
                </div>
              </div>
            )}
            dragPreviewRender={(monitorProps) => (
              <div>{monitorProps.item.text}</div>
            )}
            style={{ height: "100%" }}
            initialOpen={[3]}
          />
        </DndProvider>
    </div>
  );
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

const CodeEditor = (props) => {

  const fileTabs =[
    {
      code: undefined,
      id: 1,
      language: "python",
      name: "File 1-1",
      isSaved: true
    },
    {
      code: "print(int(input()) * 3 + int(input()) * 4 + int(input()) * 5)",
      id: 2,
      language: "cpp",
      name: "File 1-2",
      isActive: true
    }
  ];

  const FILE_EXTENSION = {
    python: ".py",
    java: ".java",
    cpp: ".cpp"
  };  

  const code = `#include <iostream>
  
int main() {
    std::cout << "Hello World!";
    return 0;
}`;

  const editorRef = useRef(null);

  const inputOutputTab = 'input';
  
  const localInputData = '';

  const localOutputData = '';

  return (
    <>
      <Main open={false} style={{ width: '100%' }}>
      <div className={editorStyles.scrollableContent} style={{ backgroundColor: 'var(--code-bg)' }}>
        <Group justify="space-between" bg={'var(--site-bg)'} style={{ borderBottom: '1px solid var(--border)'}}>
          <ScrollArea scrollbars="x" scrollHideDelay={0} style={{ width: 'calc(100% - 100px)' }} styles={{
            scrollbar: { background: 'transparent', backgroundColor: 'transparent', height: '7px', opacity: '1' },
            thumb: { backgroundColor: 'var(--selected-item)', borderRadius: '0' }
          }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {fileTabs.map((tab, index) => (
                <button className={editorStyles.button} style={{ position: 'relative', height: '50px', background: 'var(--site-bg)', color: tab.isActive ? "white" : "white", borderRight: '1px solid var(--border)' }}>
                  <p style={{ color: tab.isActive ? 'white' : 'var(--dim-text)', marginRight: '16px' }} className={editorStyles.buttonText}>{`${tab.name}${tab.language ? FILE_EXTENSION[tab.language] : ''}`}</p>
                  { !tab.isSaved && <IconPointFilled style={{ margin: '0 5px' }}/>}
                  {<img className={editorStyles.closeIcon} src='/close.png' alt="X" style={{maxWidth: '13px', maxHeight: '13px', background: 'transparent'}} />}
                  { tab.isActive && <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'var(--accent)', height: '2px' }}/>}
                </button>          
              ))
              }
            </div>
          </ScrollArea>
          <Group gap={8} pr={16} style={{ height: '50px' }}>
            <ActionIcon variant="subtle" aria-label="Settings">
              <IconDeviceFloppy />
            </ActionIcon>
            <ActionIcon variant="subtle" aria-label="Settings">
                { !document.fullscreenElement ?
                  <IconMaximize />
                :
                  <IconMinimize />
                }
            </ActionIcon>
          </Group>
        </Group>
        <br />
        <PanelGroup direction="vertical" style={{ width: '100%' }}>
        <Panel style={{ width: '100%' }} defaultSize={45}>
          <div className={editorStyles.codeEditor}>
            <Editor
                theme="vs-dark"
                defaultLanguage="cpp"
                height="100%"
                value={code}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  fetch('/themes/Night Owl Custom.json')
                    .then(data => data.json())
                    .then(data => {
                      monaco.editor.defineTheme('night-owl', data);
                      editor.updateOptions({ theme: 'night-owl', fontSize: 18 });
                    })
                }}
              />
          </div>
        </Panel>
        <PanelResizeHandle style={{ position: 'relative', cursor: 'row-resize', background: 'var(--border)', height: '1px', zIndex: 1 }}/>
        <Panel>
          <div className={editorStyles.inputOutputSection}>
            <div className={editorStyles.tabWrapper} style={{ borderBottom: '1px solid var(--border)' }}>
                <div className={editorStyles.buttonRow} style={{ backgroundColor: 'var(--site-bg)' }}>
                  <button 
                    className={editorStyles.buttonTab} 
                    style={{position: 'relative', background: 'var(--site-bg)', color: "white", borderRight: '1px solid var(--border)' }} 
                  >
                    <p style={{color: inputOutputTab === 'input' ? 'white' : 'var(--dim-text)'}} className={editorStyles.buttonText}>Input</p>
                    { inputOutputTab === 'input' && <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'var(--accent)', height: '2px' }}/>}
                  </button>
                  <button 
                    className={editorStyles.buttonTab} 
                    style={{position: 'relative', background: 'var(--site-bg)', color: "white", borderRight: '1px solid var(--border)' }} 
                  >
                    <p style={{color: inputOutputTab === 'output' ? 'white' : 'var(--dim-text)'}} className={editorStyles.buttonText}>Output</p>
                    { inputOutputTab === 'output' && <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'var(--accent)', height: '2px' }}/>}
                  </button>
                  <div className={editorStyles.rightAlign}>
                    <Group gap={8}>
                      <Button
                        loaderProps={{ type: 'dots' }}
                        variant="light"
                      >
                        RUN
                      </Button>
                      <Button
                        variant="outline" 
                        display={'none'}
                      >
                        SUBMIT
                      </Button>
                    </Group>
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
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  fetch('/themes/Night Owl Custom.json')
                    .then(data => data.json())
                    .then(data => {
                      monaco.editor.defineTheme('night-owl', data);
                      editor.updateOptions({ theme: 'night-owl', fontSize: 18 });
                    })
                }}
              />
            ) : (
                <Editor
                  theme="vs-dark"
                  defaultLanguage="cpp"
                  height="80%"
                  value={localOutputData}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    fetch('/themes/Night Owl Custom.json')
                      .then(data => data.json())
                      .then(data => {
                        monaco.editor.defineTheme('night-owl', data);
                        editor.updateOptions({ theme: 'night-owl', fontSize: 18 });
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

export default SitePreview