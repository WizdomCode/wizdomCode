// ViewUser.jsx

import React, { useEffect } from "react";
import styles from './ViewUser.module.css';
import SpiderChart from "./SpiderChart";
import { Avatar, Button, Card, Container, Divider, Group, rem, Table, Tabs } from "@mantine/core";
import { IconMapPin, IconMessageCircle, IconPhoto } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ViewUser = ({ userData, onClose, setReadCount }) => {
    const iconStyle = { width: rem(12), height: rem(12) };

    const allMetaData = useSelector(state => state.allMetaData);

    const dispatch = useDispatch();

    useEffect(() => {
        const docRef = doc(db, "ProblemMetadata", "AllData");
    
        const fetchData = async () => {
            try {
                const docSnap = await getDoc(docRef);
                setReadCount(prevReadCount => prevReadCount + 1);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    dispatch({ type: 'SET_ALL_META_DATA', payload: data });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error getting document:', error);
            }
        };
    
        if (!allMetaData) {
            console.log("Fetching all problem metadata...");
            fetchData();
        } else {
            console.log("All problem metadata already exsitsw");
        }
    }, []);

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
            <Card style={{ backgroundColor: 'var(--site-bg)' }}>
                <div style={{ height: '160px', backgroundColor: 'var(--code-bg)', borderRadius: '8px' }}/>
                <Container ml={16}>
                    <Avatar src={userData && userData.avatar} style={{ width: '100px', height: '100px', marginTop: '-50px' }}/>
                    <div style={{ display: 'flex', direction: 'row', alignItems: 'center', gap: '10px' }}>
                        { userData && (
                        userData.firstName && userData.lastName ? (
                            <div>
                            <h1>{`${userData.firstName} ${userData.lastName}`}</h1>
                            <p style={{ fontSize: '16px', marginTop: '-6px', color: 'gray'}}>{userData.username}</p>
                            </div>
                        ) : (
                            <h1>{userData.username}</h1>
                        )
                        )}
                    </div>

                    <br />

                    <Group>
                        <div style={{ display: 'flex', direction: 'row' }}>
                        <h4>{userData && userData.points}</h4>
                        <p style={{ fontSize: '16px', color: 'gray', marginLeft: '6px' }}> Points</p>
                        </div>

                        <div style={{ display: 'flex', direction: 'row' }}>
                        <h4>{userData && userData.solved.length}</h4>
                        <p style={{ fontSize: '16px', color: 'gray', marginLeft: '6px' }}> Problems solved</p>
                        </div>
                    </Group>

                    <div style={{ height: '10px' }}/>

                    <Group>
                        <IconMapPin />
                        <p style={{ marginTop: '1px'}}>{userData && userData.country}</p>
                    </Group>
                </Container>

                <Divider my="xl" color='var(--border)'/>

                {userData && userData.about && (
                    <div>
                        <h3>About</h3>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{userData.about}</pre>
                    </div>
                )}

                <br />

                <h3>Solved Problems</h3>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                        <Table.Th>Contest</Table.Th>
                        <Table.Th>Year</Table.Th>
                        <Table.Th>Level</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Points</Table.Th>
                        <Table.Th>Topics</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        { userData.solved && 
                            userData.solved.map((problem) => {
                                problem = allMetaData[problem];

                                return (
                                    <Table.Tr key={problem.title}>
                                        <Table.Td>{problem.contest}</Table.Td>
                                        <Table.Td>{extractYear(problem.specificContest)}</Table.Td>
                                        <Table.Td>{extractLevel(problem.specificContest)}</Table.Td>
                                        <Table.Td>{problem.title}</Table.Td>
                                        <Table.Td>{problem.points}</Table.Td>
                                        <Table.Td>{problem.topics}</Table.Td>
                                    </Table.Tr>
                                )
                            })
                        }
                    </Table.Tbody>
                </Table>

                <br />

                {userData && userData.skills && (
                    <div>
                        <h3>Skill Distribution</h3>
                        <SpiderChart skills={userData.skills} />
                    </div>
                )}
                <Card.Section>
                    <Button size="md" variant="light" onClick={onClose} m={10}>Back</Button>
                </Card.Section>
            </Card>
        </Container>
    );
};

export default ViewUser;
