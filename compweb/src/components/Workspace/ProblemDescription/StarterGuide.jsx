import { ActionIcon, Modal, Overlay, ScrollArea, Select as MantineSelect, Stepper, Table, TextInput, Card, Stack, Title, Tooltip, UnstyledButton, rem, Center, LoadingOverlay, Loader } from '@mantine/core';
import Select from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import classes from '../../Home/HeroText.module.css';
import { Container, Text, Button, Group } from '@mantine/core';
import { IconDeviceFloppy, IconMaximize, IconMinimize, IconPlayerPlay, IconPointFilled, IconSearch, IconSettings, IconUserCircle } from '@tabler/icons-react';
import { Editor } from '@monaco-editor/react';
import editorStyles from '../../styles/Editor.module.css';
import * as monaco from 'monaco-editor';
import {
  Tree,
  getBackendOptions,
  MultiBackend,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { TEMPLATES } from './Templates.js';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  IconCheck,
  IconCopy,
  IconPlus,
  IconTrash
} from '@tabler/icons-react';
import fileStyles from './FileList.module.css'
import anime from 'animejs/lib/anime.es.js';
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { GiArrowCursor } from "react-icons/gi";
import newTabStyles from "../../styles/ProblemDescription.module.css"
import { Accordion, AccordionDetails, AccordionSummary, Box, createTheme, Grid, Input, Slider, TablePagination, ThemeProvider, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../../Fonts.css'
import '../../styles/Workspace.css';
import "../../styles/Paths.css";

import CircleProgressBar from '../../Paths/CircleProgressBar.jsx';
import { IconBrandDatabricks, IconMath1Divide2, IconSortDescending, IconStar, IconTool } from '@tabler/icons-react';
import { ClickAwayListener, Paper, styled } from '@mui/material';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';

import navClasses from '../../Navigation/NavbarMinimal.module.css'
import { CodeHighlight } from '@mantine/code-highlight';
import { useDisclosure } from '@mantine/hooks';
import { Footer } from '../../Home/Footer.jsx';

const StarterGuide = () => {
    const [opened, { open, close }] = useDisclosure(true);

    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current)); 
    
    const [showNewFiles, setShowNewFiles] = useState(false);

    const dispatch = useDispatch();

    const handleClose = () => {
      close();
      dispatch({ type: 'SET_SHOW_BEGINNER_TUTORIAL', payload: false });
    };

  return (
    <Modal.Root opened={opened} onClose={handleClose} centered size="auto">
        <Modal.Overlay />
        <Modal.Content>
            <Modal.Body bg={'var(--site-bg)'}>
                <Container m={50}>
                    <Stack>
                        <Title>1. Create a file</Title>
                        <div style={{ position: 'relative', width: '100%', height: '480px', display: 'grid', gridTemplateColumns: true ? '1fr 3fr' : '1fr', backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)' }}>
                            <FileList showNewFiles={showNewFiles} setShowNewFiles={setShowNewFiles}/>
                            <div style={{ height: '480px', backgroundColor: 'var(--code-bg)' }}>
                                <CodeEditor showNewFiles={showNewFiles} setShowNewFiles={setShowNewFiles}/>
                            </div>
                            <Overlay backgroundOpacity={0} />
                        </div>

                        <br />

                        <Title>2. Find a problem</Title>
                        <Title order={3} c="var(--dim-text)">From here...</Title>
                        <div style={{ position: 'relative' }}>
                            <Group style={{ height: '900px', zoom: '90%', border: '1px solid var(--border)' }}>
                                <SideNav activeLabel={'Problems'} />
                                <div style={{ width: '90%' }}>
                                  <ProblemSearch />
                                </div>
                            </Group>
                            <Overlay backgroundOpacity={0} />
                        </div>

                        <br />

                        <Title order={3} c="var(--dim-text)">...or here</Title>
                        <Center pos="relative">
                            <Group pr={15} style={{ height: '900px', zoom: '90%', border: '1px solid var(--border)' }}>
                                <SideNav activeLabel={'CCC'} />
                                <div style={{ zoom: '80%', padding: '0 69px' }}>
                                    <ScrollRow />
                                </div>
                            </Group>
                            <Overlay backgroundOpacity={0} />
                        </Center>

                        <br />

                        <Title>3. Submit your solution</Title>
                        <Center pos="relative">
                            <ProblemDescription />
                            <Overlay backgroundOpacity={0} />
                        </Center>
                    </Stack>
                </Container>

                <Container className={classes.wrapper} size={1400} style={{ zoom: '150%' }}>
                <div className={classes.inner}>
                    <Title className={classes.title}>
                        Welcome to{' '}
                    </Title>
                    <Title className={classes.title} style={{ zoom: '125%' }}>
                        <Text component="span" className={classes.highlight} inherit c="indigo">
                            WizdomCode!
                        </Text>
                    </Title>

                    <div className={classes.controls}>
                        <Group>
                            <Button onClick={handleClose} className={classes.control} radius="xl" w={120} variant="light">
                                Exit tutorial
                            </Button>
                        </Group>
                    </div>
                </div>
                </Container>

                <Footer />
            </Modal.Body>
        </Modal.Content>
    </Modal.Root>
  )
}

const ProblemDescription = () => {
  const testCasesVisible = true;
  const displayCases = [
    {key: 1, input: '0\n2\n4\n', output: '28\n', boxShadow: '0 -1px 15px #0b0b0f' },
    {key: 2, input: '2\n9\n5\n', output: '67\n', boxShadow: '0 -1px 15px #0b0b0f' },
    {key: 3, input: '103\n22\n497\n', output: '2882\n'},
    {key: 4, input: '2\n0\n5\n', output: '31\n'},
    {key: 5, input: '2\n9\n0\n', output: '42\n'},
    {key: 6, input: '0\n0\n0\n', output: '0\n'}
  ];
  const expandAllCases = [true, false, false, false, false, false];
  const results = [
    {status: {description: 'Accepted', id: 1}, stdout: '28\n', time: '0.231', memory: 6.75, key: 1}
  ];
  const runningCase = 2;
  const runningAllCases = false;

  return (
    <Container style={{ width: '100%', zoom: '67%' }}>
        <div style={{ position: 'relative', height: !testCasesVisible ? 'calc(100vh - 150px)' : '100%', overflow: !testCasesVisible ? 'hidden' : 'auto' }}>
        <LoadingOverlay mt={16} visible={!testCasesVisible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, color: 'var(--site-bg)' }} loaderProps={{ children: <Button variant='outline' size="md">Show test cases</Button> }}/>      

            <div className={newTabStyles.testCases} style={{ marginTop: '20px' }}>
            {displayCases ? displayCases.map((testCase, index) => {
                const shouldDisplay = results && results[index] && results[index].key !== 'stop';

                return (
                <Accordion
                    key={testCase.key}
                    sx={{
                      bgcolor: 'var(--site-bg)',
                      border: 1, 
                      boxShadow: testCase.boxShadow || 'none' 
                    }}
                    expanded={expandAllCases[index] || false}
                >
                    <AccordionSummary>
                    <Group justify="space-between" style={{ width: '100%' }}>
                        <div>
                        <br />
                        <h3>
                            Case {testCase.key}
                            {shouldDisplay && (
                            <>
                                {results[index] && results[index].status.description === 'Accepted' && <span className={newTabStyles.passIcon}> ✔️</span>}
                                {results[index] && results[index].status.description === 'Wrong Answer' && <span className={newTabStyles.failIcon}> ❌</span>}
                                {results[index] && results[index].status.description === 'Time Limit Exceeded' && <span className={newTabStyles.failIcon}> (Time limit exceeded)</span>}
                                {results[index] && results[index].status.description === 'Memory Limit Exceeded' && <span className={newTabStyles.failIcon}> (Memory limit exceeded)</span>}
                            </>
                            )}
                        </h3>
                        {shouldDisplay && (
                            <>
                                <Title order={5} c={'var(--dim-text)'}>[ {results[index].time || 0}s, {results[index].memory || 0} MB ]</Title>
                            </>
                            )}
                        <br />
                        </div>
                        { (runningCase && runningCase === testCase.key) || runningAllCases ? 
                        <Loader color="blue" type="dots" ml={4}/>
                        :
                        <Button variant="light" leftSection={<IconPlayerPlay size={14} />} >Run</Button>
                        }
                    </Group>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Title order={6}  c={'var(--dim-text)'}>Input:</Title>
                    <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={String(testCase.input).replace(/\\r\\n/g, '\n')} language="txt" />
                    <br />
                    <Title order={6}  c={'var(--dim-text)'}>Expected Output:</Title>
                    <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={String(testCase.output).replace(/\\r\\n/g, '\n')} language="txt" />
                    {shouldDisplay && results[index] && results[index].status.description === 'Wrong Answer' && (
                        <>
                        <br />
                        <Title order={6}  c={'var(--dim-text)'}>Actual Output:</Title>
                        <CodeHighlight styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={results[index].stdout ? results[index].stdout.replace(/\\r\\n/g, '\n') : "No output"} language="txt" />
                        </>
                    )}
                    <br />
                    </AccordionDetails>
                </Accordion>
                );                
            }): (
                <div>
                <h2>Test cases for this problem are coming soon!</h2>
                <br />
                </div>
            )}
            </div>

            <Group style={{ margin: '20px 0' }}>
            <Button variant="subtle">Expand all</Button>
            <Button variant="subtle">Collapse all</Button>
            </Group>
            
        </div>
    </Container>
  );
};

function NavbarLink({ icon: Icon, label, active, onClick, path }) {
    return (
      <Link to={path}>
          <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
          <UnstyledButton onClick={onClick} className={navClasses.link} data-active={active || undefined}>
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
  
  function SideNav({ activeLabel }) {
  
    const links = mockdata.map((link, index) => (
      <NavbarLink
        {...link}
        key={link.label}
        active={link.label === activeLabel}
      />
    ));
  
    const contestlinks = contestdata.map((link, index) => (
      <NavbarLink
        {...link}
        key={link.label}
        active={link.label === activeLabel}
      />
    ));
  
    return (
      <>
        <nav className={navClasses.navbar} style={{ backgroundColor: 'var(--site-bg)' }}>
          <Center>
            <Stack justify="center" gap={10}>
              {links}
            </Stack>
          </Center>
  
          <div className={navClasses.navbarMain}>
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

const Item = styled(Paper)(({ theme }) => ({
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));  

const LessonBackgroundRect = ({ onButtonClick, isFocused, userData, ...props }) => {

    const activeCategoryId = {unitTitle: 'S1 & S2: Algorithmic Foundations', rowIndex: 1, lessonIndex: 0};

    return (
        <div className="universal" style={{ position: 'relative' }}>
            <CircleProgressBar progress={userData[props.lessonName]} style={{position: 'absolute', zIndex: 1}}/>
                <div style={{position: 'absolute', zIndex: 2, top: 25, left: 35, right: -10, bottom: 0}}>
                    <div 
                        className={`lesson-background-rect ${ true ? 'hovered' : ''}`}
                        tabIndex="0" // Add this to make the div focusable
                        style={{ backgroundColor: 'var(--code-bg)' }}
                    >
                        { props.imgPath && typeof props.imgPath === 'string' ? (
                            <img className="lesson-component-icon" src={ props.imgPath } alt="sad"></img>
                        ) : (
                            <>
                                {props.imgPath}
                            </>
                        )}
                        <div>
                            <Item className={`bottom-rectangle ${props.lessonName.length > 12 ? 'long-lesson-name' : 'lesson-name'}`}>{ props.lessonName }</Item>
                        </div>
                    </div>
                {activeCategoryId && activeCategoryId.unitTitle === props.categoryId.unitTitle && activeCategoryId.lessonIndex === props.categoryId.lessonIndex && activeCategoryId.rowIndex === props.categoryId.rowIndex &&
                    <ArrowDropUpRoundedIcon style={{ height: '100px', width: '100px', marginTop: '-30px', marginLeft: '35px' }}/>
                }
            </div>
        </div>
    );
};

const ScrollRow = () => {
    const activeCategoryId = {unitTitle: 'S1 & S2: Algorithmic Foundations', rowIndex: 1, lessonIndex: 0};
    const lessonQuestionList = [ 
        {title: 'Sunflowers', folder: 'sunflowers', points: 5, topics: ['data structures'], contest: 'CCC', specificContest: 'Canadian Computing Competition: 2018 Stage 1, Junior #4, Senior #2', solved: true}, 
        {title: 'Modern Art', topics: ['data structures'], specificContest: 'Canadian Computing Competition: 2021 Stage 1, Junior #5, Senior #2', contest: 'CCC', points: 7, folder: 'modernArt', solved: true},
        {points: 5, title: 'Good Groups', topics: ['data structures'], specificContest: 'Canadian Computing Competition: 2022 Stage 1, Junior #4, Senior #2', contest: 'CCC', folder: 'goodGroups', }
    ];
    const currentPage = "ccc"
    const division = "Senior"
    const lessons = [
        [{ category: "4 Problems", lessonName: "Implementation", imgPath: <IconTool className='lesson-component-icon'/>, problemIds: ["Good Fours and Good Fives", "Trianglane", "Heavy-Light Composition", "Symmetric Mountains"] },
        { category: "5 Problems", lessonName: "Greedy", imgPath: <IconStar className='lesson-component-icon'/>, problemIds: ["Tandem Bicycle", "Jerseys"] }],
        [{ category: "5 Problems", lessonName: "Data structures", imgPath: <IconBrandDatabricks className='lesson-component-icon'/>, problemIds: ["Sunflowers", "Modern Art", "Good Groups"] }],
        [{ category: "4 Problems", lessonName: "Sorting", imgPath: <IconSortDescending className='lesson-component-icon'/>, problemIds: ["High Tide, Low Tide"] },
        { category: "2 Problems", lessonName: "Simple Math", imgPath: <IconMath1Divide2 className='lesson-component-icon'/>, problemIds: ["Crazy Fencing", "Pretty Average Primes"] }]
    ]
    const unitTitle = "S1 & S2: Algorithmic Foundations"
    const unitDescription = ""
    const userData = {
        'Implementation': 100,
        'Greedy': 100,
        'Data structures': 33,
        'Sorting': 0,
        'Simple Math': 0
    }

    const [readCount, setReadCount] = useState(0);
  
    useEffect(() => {
      console.log("UserProfile reads:", readCount);
    }, [readCount]);

    const allMetaData = useSelector(state => state.allMetaData);

    return (
        <div className="universal">
            { true &&
            <div style={{height: '10rem', display: 'flex', alignItems: 'center', background: false ? "url('/val.png') no-repeat center center" : ""}}>
                <Container style={{ width: '100%' }}>
                    <Card radius="md" style={{ width: '100%', justifyContent: 'center' }} h={90} bg={'var(--selected-item)'}>
                        <Group justify="space-between">
                            <Stack justify="center">
                                <Title order={2}>{unitTitle}</Title>
                                { unitDescription && <p>{unitDescription}</p>}
                            </Stack>
                            {true && <Button color="var(--accent)" variant="white" size="md" display={'none'}>Start</Button>}
                        </Group>
                    </Card>
                </Container>
            </div>
            }
                <div className="unit-lessons-wrapper">
                    {lessons.map((row, rowIndex) => {
                        return (
                            <>
                                <div className='lesson-row'>
                                    {row.map((lesson, lessonIndex) => {
                                        return (
                                            <LessonBackgroundRect key={lessonIndex} userData={userData} allMetaData={allMetaData} {...lesson} isFocused={false} division={division} categoryId={{ unitTitle: unitTitle, rowIndex: rowIndex, lessonIndex: lessonIndex }}/>
                                        );
                                    })}
                                </div>
                                { activeCategoryId && activeCategoryId.unitTitle === unitTitle && activeCategoryId.rowIndex === rowIndex && lessonQuestionList && (
                                    <div className="question-list-rect" style={{ zIndex: 9999 }}>
                                        <div>
                                        <Table>
                                                <Table.Thead>
                                                    <Table.Tr>
                                                        <Table.Th>Name</Table.Th>
                                                        <Table.Th>Points</Table.Th>
                                                        <Table.Th>Topics</Table.Th>
                                                        <Table.Th>Contest</Table.Th>
                                                        <Table.Th><IconCheck /></Table.Th>
                                                    </Table.Tr>
                                                </Table.Thead>
                                                <Table.Tbody>
                                                {lessonQuestionList.map((q) => (
                                                    q && q.title &&
                                                    <Table.Tr key={q.id}>
                                                        <Table.Td>
                                                            <Link>
                                                                {q.title}
                                                            </Link>
                                                        </Table.Td>
                                                        <Table.Td>{q.points}</Table.Td>
                                                        <Table.Td>{q.topics.join(", ")}</Table.Td>
                                                        <Table.Td>{q.contest}</Table.Td>
                                                        { q.solved ? <Table.Td>yes</Table.Td> : <Table.Td>no</Table.Td> }
                                                    </Table.Tr>
                                                ))}
                                                </Table.Tbody>
                                            </Table>
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })}
                </div>
        </div>
    );
};

const ProblemSearch = (props) => {

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });      

    const lightTheme = createTheme({
        palette: {
          mode: 'light',
        },
      });

      const [search, setSearch] = useState("");

    // Define your color constants
    const BACKGROUND_COLOR = '#fff'; // This is the color used for the background of the components
    const TEXT_COLOR = '#000'; // This is the color used for the text in the components
    const GRAY = '#ccc';
    const FOCUSED_COLOR = '#ccc'; // This is the color used for the background of a focused option

    const SELECT_STYLES = {
    // The 'control' key targets the control component (the box that the selected value or placeholder is displayed in)
    control: (provided, state) => ({
        ...provided, // Spread in provided styles to maintain other default styles
        backgroundColor: BACKGROUND_COLOR, // Set the background color to the constant defined above
        color: TEXT_COLOR, // Set the text color to the constant defined above
        borderRadius: '8px',
    }),
    
    // The 'menu' key targets the dropdown menu
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: BACKGROUND_COLOR,
        color: TEXT_COLOR,
        borderRadius: '8px',
    }),

    // The 'menuList' key targets the list of options in the dropdown menu
    menuList: (provided, state) => ({
        ...provided,
        backgroundColor: BACKGROUND_COLOR,
        color: TEXT_COLOR,
        borderRadius: '8px',
    }),

    // The 'option' key targets the options in the dropdown menu
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? FOCUSED_COLOR : BACKGROUND_COLOR, // Set the background color to a different color when an option is focused
        color: TEXT_COLOR,
    }),

    // The 'singleValue' key targets the single value displayed in the control when a single option is selected
    singleValue: (provided) => ({
        ...provided,
        color: TEXT_COLOR,
    }),

    // The 'multiValue' key targets the values displayed in the control when multiple options are selected
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: GRAY,
        color: TEXT_COLOR,
    }),

    // The 'multiValueLabel' key targets the label of the values displayed in the control when multiple options are selected
    multiValueLabel: (provided) => ({
        ...provided,
        backgroundColor: GRAY,
        color: TEXT_COLOR,
    }),

    // The 'multiValueRemove' key targets the remove icon of the values displayed in the control when multiple options are selected
    multiValueRemove: (provided) => ({
        ...provided,
        backgroundColor: GRAY,
        color: TEXT_COLOR,
    }),

    // The 'dropdownIndicator' key targets the dropdown indicator in the control
    dropdownIndicator: (provided) => ({
        ...provided,
        backgroundColor: BACKGROUND_COLOR,
        color: TEXT_COLOR,
        borderRadius: '8px',
    }),

    // The 'clearIndicator' key targets the clear indicator in the control
    clearIndicator: (provided) => ({
        ...provided,
        backgroundColor: BACKGROUND_COLOR,
        color: TEXT_COLOR,
    }),

    // The 'indicatorSeparator' key targets the separator between the selected value and the dropdown indicators
    indicatorSeparator: (provided) => ({
        ...provided,
        backgroundColor: BACKGROUND_COLOR,
        color: TEXT_COLOR,
    }),

    // The 'placeholder' key targets the placeholder displayed in the control
    placeholder: (provided) => ({
        ...provided,
        backgroundColor: BACKGROUND_COLOR,
        color: TEXT_COLOR,
    }),

    // The 'input' key targets the input where the user types
    input: (provided) => ({
        ...provided,
        backgroundColor: BACKGROUND_COLOR,
        color: TEXT_COLOR,
        borderRadius: '8px',
    }),

    // The 'valueContainer' key targets the container that holds the value or placeholder
    valueContainer: (provided) => ({
        ...provided,
        backgroundColor: BACKGROUND_COLOR,
        color: TEXT_COLOR,
        borderRadius: '8px',
    }),

    // The 'indicatorsContainer' key targets the container that holds the dropdown indicators
    indicatorsContainer: (provided) => ({
        ...provided,
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: '8px',
        color: TEXT_COLOR,
    }),

    noOptionsMessage: (provided, state) => ({
        ...provided,
        backgroundColor: BACKGROUND_COLOR,
        color: TEXT_COLOR,
    }),
    }; 

    const TOPICS = [
        "ad hoc",
        "advanced dynamic programming",
        "advanced tree techniques",
        "arithmetic",
        "arrays",
        "bfs",
        "binary search",
        "combinatorics",
        "complete search",
        "computational geometry",
        "conditions",
        "custom comparators",
        "data structures",
        "depth-first search",
        "dfs",
        "dynamic programming",
        "euler tour",
        "flood fill",
        "geometry",
        "graph theory",
        "greedy",
        "hashing",
        "implementation",
        "loops",
        "math",
        "matrix exponentation",
        "minimum spanning tree",
        "nested loops",
        "point update range sum",
        "prefix sum",
        "recursion",
        "rectangle geometry",
        "search",
        "searching",
        "segment tree",
        "shortest path",
        "simple math",
        "simulation",
        "sorting",
        "strings",
        "syntax",
        "time complexity",
        "topological sort",
        "trees",
        "two pointers",
        "union find"
      ];
      const CONTESTS = ["CCC", "USACO"];
      const [topics, setTopics] = useState([]);
      const [isFocused, setIsFocused] = useState({topics: false, contests: false, points: false});
      const [contests, setContests] = useState([]);

      const handleFocus = (name) => {
        setIsFocused({...isFocused, [name]: true});
      };
    
      const handleBlur = (name) => {
        setIsFocused({...isFocused, [name]: false});
      };

      const [value, setValue] = React.useState([1, 20]);

      const handleSliderChange = (event, newValue) => {
        setValue(newValue);
      };
    
      const handleInputChangeMin = (event) => {
        setValue([event.target.value === '' ? 0 : Number(event.target.value), value[1]]);
      };
    
      const handleInputChangeMax = (event) => {
        setValue([value[0], event.target.value === '' ? 0 : Number(event.target.value)]);
      };
    
      const handleBlurring = () => {
        if (value[0] < 1) {
          setValue([1, value[1]]);
        } else if (value[1] > 50) {
          setValue([value[0], 50]);
        }
      };
      
      const marks = [
        {
          value: 1,
          label: '1',
        },
        {
          value: 10,
          label: '10',
        },
        {
          value: 20,
          label: '20',
        },
        {
          value: 50,
          label: '50',
        },
      ];      

      const [filteredQuestions, setFilteredQuestions] = useState([]);
      const [questions, setQuestions] = useState([]);

      const allMetaData = useSelector(state => state.allMetaData);

      useEffect(() => {
        if (allMetaData) setQuestions(Object.values(allMetaData));
      }, [allMetaData]);    

      useEffect(() => {
        let filtered = questions;
    
        filtered = filtered.filter((q) => q.points >= value[0] && q.points <= value[1]);
    
        if (search) {
          filtered = filtered.filter((q) => {
            if (q.title) {
              return q.title.toLowerCase().includes(search.toLowerCase());
            }
            return false; // return false if there's no title, so it doesn't get included in the filtered array
          });
        }    
    
        if (topics.length > 0) {
          filtered = filtered.filter((q) =>
            q.topics.some((t) => topics.includes(t))
          );
        }
    
        if (contests.length > 0) {
          filtered = filtered.filter((q) => contests.includes(q.contest));
        }
    
        setFilteredQuestions(filtered);
      }, [questions, value, search, topics, contests]);

      const [page, setPage] = React.useState(0);
      const [rowsPerPage, setRowsPerPage] = React.useState(10);
      
      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };    

      const currentPageData = filteredQuestions.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

      function extractYear(text) {
        const regex = /\b\d{4}\b/;
        let match = text.match(regex);
        return match ? match[0] : null;
      }
      
      function extractLevel(text) {
        if (text.substring(0, 5) === 'USACO') {
          const fullLvl = text.split(', ')[1];
          return fullLvl.substring(0, fullLvl.length - 9) + 'P' + fullLvl.substring(fullLvl.length - 1);
        } else {
          const fullLvls = text.split(', ').slice(1);
          let fullstr = '';
          for (let lvl of fullLvls) {
            fullstr += lvl[0] + lvl[lvl.length - 1] + ', ';
          } 
          return fullstr.substring(0, fullstr.length - 2);
        }
      }    

    return (
        <Container>
        <Container my={24} mt={34}> 
          <div className={newTabStyles.description}>
            <h2 className="title">Problems</h2>
            <div className="search-rect">
                <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%', m: 1 }}>
                  <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }}/>
                  <Input fullWidth placeholder="Search problems..." sx={{ color: 'black', width: '100%' }} style={{ color: 'black' }} theme={lightTheme} value={search} onChange={(e) => setSearch(e.target.value)}/>
                </Box>
            </div>
            <Group>
              <div className="column1">
                <div style={{position: 'relative'}}>
                  <Select 
                    placeholder="Topics..."
                    styles={SELECT_STYLES}
                    options={TOPICS.map(opt => ({ label: opt, value: opt }))}
                    isMulti
                    onChange={(selected) => setTopics(selected.map((s) => s.value))}
                    onFocus={() => handleFocus('topics')}
                    onBlur={() => handleBlur('topics')}
                  />
                  {!topics.length && !isFocused.topics && <div className="dropdown-placeholder">Topic</div>}
                </div>
                <div style={{position: 'relative'}}>
                  <Select 
                    styles={SELECT_STYLES}
                    options={CONTESTS.map(opt => ({ label: opt, value: opt }))}
                    isMulti
                    onChange={(selected) => setContests(selected.map((s) => s.value))}
                    placeholder="Contests..."
                    onFocus={() => handleFocus('contests')}
                    onBlur={() => handleBlur('contests')}
                  />
                  {!contests.length && !isFocused.contests && <div className="dropdown-placeholder">Contest</div>}
                </div>
              </div>
              <div className="column2">
                <ThemeProvider theme={darkTheme}>
                  <Box sx={{ minWidth: 250, ml: 2 }}>
                    <Typography id="input-slider" gutterBottom>
                      Points Range
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs>
                        <Slider
                          value={value}
                          onChange={handleSliderChange}
                          aria-labelledby="input-slider"
                          min={1}
                          max={50}
                          marks={marks}
                        />
                      </Grid>
                      <Grid item style={{ marginTop: '-25px' }}>
                        <Input
                          value={value[0]}
                          size="small"
                          onChange={handleInputChangeMin}
                          onBlur={handleBlurring}
                          inputProps={{
                            step: 1,
                            min: 1,
                            max: 50,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                          }}
                        />
                      </Grid>
                      <Grid item style={{ marginTop: '-25px' }}>
                        <Input
                          value={value[1]}
                          size="small"
                          onChange={handleInputChangeMax}
                          onBlur={handleBlurring}
                          inputProps={{
                            step: 1,
                            min: 1,
                            max: 50,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </ThemeProvider>
              </div>
            </Group>
          </div>
        </Container>
        <div className="question-list">
          <div className="wrapper">
            <ScrollArea>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Contest</Table.Th>
                    <Table.Th>Level</Table.Th>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Year</Table.Th>
                    <Table.Th>Points</Table.Th>
                    <Table.Th>Topics</Table.Th>
                    <Table.Th><IconCheck /></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  { currentPageData && 
                    currentPageData.map((problem) => (
                      <Table.Tr key={problem.title}>
                        <Table.Td>{problem.contest}</Table.Td>
                        <Table.Td>{extractLevel(problem.specificContest)}</Table.Td>
                        <Table.Td>
                          <Link                          >
                            {problem.title}
                          </Link>
                        </Table.Td>
                        <Table.Td>{extractYear(problem.specificContest)}</Table.Td>
                        <Table.Td>{problem.points}</Table.Td>
                        <Table.Td>{problem.topics.join(", ")}</Table.Td>
                        <Table.Td>no</Table.Td>
                      </Table.Tr>
                    ))
                  }
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </div>
        </div>
        <div className='pagination'>
          <ThemeProvider theme={darkTheme}>
            <TablePagination
              component="div"
              count={filteredQuestions.length} // Update the total count
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </ThemeProvider>
        </div>
        <br />
      </Container>   
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
  
  const newData = [
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
    },
    {
      "id": 7,
      "parent": 1,
      "text": "New file",
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
  const newFile = newData[6];
  const hoveredFile = null;
  const openTemplate = null;
  const clickedTemplate = null;
  const hoveredTemplate = null;

  const showFileForm = true;

  const [fileTypeInputValue, setFileTypeInputValue] = useState("cpp");
  const [inputValue, setInputValue] = useState("");

  const [languageDropdownOpened, setLanguageDropdownOpened] = useState(false);

  useEffect(() => {
    const animation = anime.timeline({ loop: true });
    const typingText = "New file"; // The text to be typed
    let typingIndex = 0; // Index for the typing text  
  
    animation
      .add({
        targets: '#animated-cursor',
        left: '60px', // move cursor to the select box
        top: '40px', // 300px - 270px
        easing: 'easeInOutQuad',
        duration: 1000,
        update: (anim) => {
          if (anim.progress >= 100) {
            setLanguageDropdownOpened(true);
          }
        }
      })
      .add({
        targets: '#animated-cursor',
        left: '65px',
        top: '115px', // 365px - 270px
        easing: 'easeInOutQuad',
        duration: 1000
      })
      .add({
        targets: '#animated-cursor',
        left: '65px',
        top: '115px', // small delay before clicking python button
        easing: 'easeInOutQuad',
        duration: 100,
        update: (anim) => {
          if (anim.progress >= 100) {
            setFileTypeInputValue("python");
            setLanguageDropdownOpened(false);
          }
        }
      })
      .add({
        targets: '#animated-cursor',
        left: '65px',
        top: '115px', // delay on the input box to type
        easing: 'easeInOutQuad',
        duration: typingText.length * 200, // Adjust duration based on the length of the text
        update: (anim) => {
          if (anim.progress >= (100 / typingText.length) * (typingIndex + 1)) {
            setInputValue(typingText.slice(0, typingIndex + 1));
            typingIndex++;
          }
        }
      })
      .add({
        targets: '#animated-cursor',
        left: '200px',
        top: '110px', // 360px - 270px
        easing: 'easeInOutQuad',
        duration: 1000,
        update: (anim) => {
            if (anim.progress >= 100) {
              props.setShowNewFiles(true);
            }
          }  
      })
      .add({
        targets: '#animated-cursor',
        left: '200px',
        top: '110px', // delay before reset
        easing: 'easeInOutQuad',
        duration: 2000,
        update: (anim) => {
            if (anim.progress >= 100) {
                setFileTypeInputValue("cpp");
                setInputValue("");
                props.setShowNewFiles(false);
                typingIndex = 0;
            }
          }
      })
      .add({
        targets: '#animated-cursor',
        left: '60px', // reset cursor to initial position
        top: '40px', // reset cursor to initial position
        duration: 1
      });
  
    return () => animation.pause(); // cleanup on component unmount
  }, []);

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
          <DndProvider backend={TouchBackend} style={{ height: "100%" }}>
            <Tree
              tree={props.showNewFiles ? newData : initialData}
              rootId={0}
              render={(node, { depth, isOpen, onToggle }) => {
                const openFile = props.showNewFiles ? newData[6] : initialData[2];

                return (
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
                )
              }}
              dragPreviewRender={(monitorProps) => (
                <div>{monitorProps.item.text}</div>
              )}
              style={{ height: "100%" }}
              initialOpen={[1]}
            />
          </DndProvider> 
          {showFileForm && (
            <Container pos="relative">
                <div id="animated-cursor" style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    pointerEvents: 'none',
                    zIndex: 1000
                }}><GiArrowCursor /></div>
                <form style={{ margin: '10px 0' }}>
                    <MantineSelect
                        id="language-select"
                        label="Language" 
                        data={['cpp', 'python', 'java']}
                        value={fileTypeInputValue}
                        onChange={(_value, option) => setFileTypeInputValue(_value)}
                        styles={{ 
                            input: { backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)' }, 
                            dropdown: { backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)' } 
                        }}
                        allowDeselect={false}
                        dropdownOpened={languageDropdownOpened}
                        comboboxProps={{ zIndex: 900, withinPortal: false }}
                    />
                    <TextInput
                        id="file-name-input"
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
        <DndProvider backend={TouchBackend} style={{ height: "100%" }}>
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
          />
        </DndProvider>
    </div>
  );
};

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
  
  const newFileTabs =[
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
    },
    {
      code: undefined,
      id: 3,
      language: "python",
      name: "New file",
      isActive: true
    }
  ];

  const FILE_EXTENSION = {
    python: ".py",
    java: ".java",
    cpp: ".cpp"
  };  

  const code = `#include <bits/stdc++.h>
typedef long long ll;
using namespace std;

int main()
{
    cin.sync_with_stdio(0);
    cin.tie(0);

    int r, g, b;
    cin >> r >> g >> b;
    cout << r*3 + g*4 + b*5 << endl;

    return 0;
}`;

  const editorRef = useRef(null);

  const inputOutputTab = 'input';
  
  const localInputData = '';

  const localOutputData = '';

  return (
    <>
        <Group justify="space-between" bg={'var(--site-bg)'} style={{ borderBottom: '1px solid var(--border)'}}>
          <ScrollArea scrollbars="x" scrollHideDelay={0} style={{ width: 'calc(100% - 100px)' }} styles={{
            scrollbar: { background: 'transparent', backgroundColor: 'transparent', height: '7px', opacity: '1' },
            thumb: { backgroundColor: 'var(--selected-item)', borderRadius: '0' }
          }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              { (props.showNewFiles ? newFileTabs : fileTabs).map((tab, index) => (
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
            <Editor
                theme="vs-dark"
                defaultLanguage="cpp"
                height="70%"
                value={props.showNewFiles ? "" : code}
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
    </>
  );
};

export default StarterGuide