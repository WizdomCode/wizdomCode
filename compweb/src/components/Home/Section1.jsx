import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, Card, Paper, Center, ScrollArea, ActionIcon } from '@mantine/core';
import { IconCheck, IconCircleDashedCheck, IconDeviceFloppy, IconFlask, IconMaximize, IconMinimize, IconNotebook, IconPointFilled } from '@tabler/icons-react';
import classes from './HeroBullets.module.css';
import styles from '../styles/ProblemDescription.module.css';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CodeHighlight } from '@mantine/code-highlight';
import { useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import editorStyles from '../styles/Editor.module.css';

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
];

export function Section1() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Free. Fun. <span className={classes.highlight}>Effective.</span>
          </Title>
          <Text c="var(--dim-text)" mt="md" mr={25}>
            Stop wasting time searching for problems and tutorials. WizdomCode provides a comprehensive, organized roadmap carefully designed and crafted for USACO contestants – available to everyone, for free.
          </Text>
        </div>
        <div style={{ position: 'relative', width: '1600px', height: '420px' }}>
            <Card shadow="sm" padding="lg" radius="md" w={400} h={400} withBorder bg="radial-gradient(circle, rgba(22,22,30,1) 50%, rgba(26,27,38,1) 100%)" style={{ border: '1px solid var(--code-bg)', position: 'absolute', top: '0', left: '0', boxShadow: '0 -1px 25px #0b0b0f' }}>
                <div className={styles.problemStatement} style={{ overflow: 'hidden', zoom: '75%' }}>
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
                    <ProblemDescription currentTab={tabs[1]} selectedTab={'question'}/>
                </div>
            </Card>
            <div shadow="xs" p="xl" style={{ position: 'absolute', top: '300px', left: '200px', height: '30vh', width: '30vw', zoom: '75%', backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)', boxShadow: '-5px -5px 15px #0b0b0f' }}>
                <CodeEditor />
            </div>
        </div>
      </div>
    </Container>
  );
}

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
                <CodeHighlight withCopyButton={false} styles={{pre: { backgroundColor: 'var(--code-bg)' }, code: { fontSize: '18px', color: 'var(--dim-text)' }}} code={currentTab.data.sample1.input.replace(/\\n/g, '\n')} language="txt" />
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
    </>
  );
};