import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, Card, LoadingOverlay, Loader, Overlay } from '@mantine/core';
import { IconCheck, IconPlayerPlay } from '@tabler/icons-react';
import classes from './HeroBullets.module.css';
import styles from '../styles/ProblemDescription.module.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { CodeHighlight } from '@mantine/code-highlight';

export function Section2() {
  return (
    <Container size="md">
      <Group gap={80} justify="center">
        <Card w={420} h={400} shadow="sm" radius="md" withBorder bg="radial-gradient(circle, rgba(34,42,69,1) 0%, rgba(29,34,53,1) 21%, rgba(22,22,30,1) 50%)" style={{ border: '1px solid var(--code-bg)', position: 'relative' }}>
            <ProblemDescription />
            <Overlay gradient='linear-gradient(to bottom, rgba(0,0,0,0) 1%,rgba(22,31,57,0) 36%,rgba(61,89,161,0.10) 100%)'/>
        </Card>
        <div style={{ maxWidth: '420px' }}>
          <Title className={classes.title}>
            Learn by doing
          </Title>
          <Text c="var(--dim-text)" mt="md">
            WizdomCode makes you get hands-on with <b style={{color:'white'}}>real contest challenges</b> - so you can practice the skills you'll actually use in competition.
          </Text>
        </div>
      </Group>
    </Container>
  );
}

const ProblemDescription = () => {
  const testCasesVisible = true;
  const displayCases = [
    {key: 1, input: '0\n2\n4\n', output: '28\n', boxShadow: '0 -1px 15px #0b0b0f' },
    {key: 2, input: '2\n9\n5\n', output: '67\n', boxShadow: '0 -5px 15px #0b0b0f' },
    {key: 3, input: '103\n22\n497\n', output: '2882\n'},
    {key: 4, input: '2\n0\n5\n', output: '31\n'},
    {key: 5, input: '2\n9\n0\n', output: '42\n'},
    {key: 6, input: '0\n0\n0\n', output: '0\n'}
  ];
  const expandAllCases = [true, true, true, true, true, true];
  const results = [
    {status: {description: 'Accepted', id: 1}, stdout: '28\n', time: '0.231', memory: 6.75, key: 1}
  ];
  const runningCase = 2;
  const runningAllCases = false;

  return (
    <Container style={{ width: '100%', zoom: '67%' }}>
        <div style={{ position: 'relative', height: !testCasesVisible ? 'calc(100vh - 150px)' : '100%', overflow: !testCasesVisible ? 'hidden' : 'auto' }}>
        <LoadingOverlay mt={16} visible={!testCasesVisible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, color: 'var(--site-bg)' }} loaderProps={{ children: <Button variant='outline' size="md">Show test cases</Button> }}/>      

            <div className={styles.testCases} style={{ marginTop: '20px' }}>
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
                                {results[index] && results[index].status.description === 'Accepted' && <span className={styles.passIcon}> ✔️</span>}
                                {results[index] && results[index].status.description === 'Wrong Answer' && <span className={styles.failIcon}> ❌</span>}
                                {results[index] && results[index].status.description === 'Time Limit Exceeded' && <span className={styles.failIcon}> (Time limit exceeded)</span>}
                                {results[index] && results[index].status.description === 'Memory Limit Exceeded' && <span className={styles.failIcon}> (Memory limit exceeded)</span>}
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