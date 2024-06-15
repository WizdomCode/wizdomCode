import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, Card, Stack, Overlay } from '@mantine/core';
import { IconBrandDatabricks, IconCheck, IconMath1Divide2, IconSortDescending, IconStar, IconTool } from '@tabler/icons-react';
import classes from './HeroBullets.module.css';
import CircleProgressBar from '../Paths/CircleProgressBar';
import { ClickAwayListener, Paper, styled } from '@mui/material';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export function PathsPreview() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            A <span className={classes.highlight}>linear</span> progression <br /> of learning goals
          </Title>
          <Text c="dimmed" mt="md" display={'none'}>
            Build fully functional accessible web applications faster than ever – Mantine includes
            more than 120 customizable components and hooks to cover you in any situation
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Learn by doing</b> – master your coding contest of choice through practice and repetition
            </List.Item>
            <List.Item>
              <b>High-value resources</b> – optimize your learning with hand-picked problemsets
            </List.Item>
            <List.Item>
              <b>Progress Tracking</b> – Keep track of your progress in terms of topics learned
            </List.Item>
          </List>
        </div>
        <ScrollRow />
      </div>
    </Container>
  );
}

const Item = styled(Paper)(({ theme }) => ({
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));  

const LessonBackgroundRect = ({ onButtonClick, isFocused, userData, ...props }) => {

    const activeCategoryId = undefined;

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
    const activeCategoryId = undefined;
    const lessonQuestionList = undefined;
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

    return (
        <div className="universal" style={{ position: 'relative' }}>
            { false &&
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
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Points</th>
                                                <th>Topics</th>
                                                <th>Contest</th>
                                                <th>Solved</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {lessonQuestionList.map((q) => (
                                                q && q.title &&
                                                <tr key={q.id}>
                                                    <td>{q.title}</td>
                                                    <td>{q.points}</td>
                                                    <td>{q.topics.join(", ")}</td>
                                                    <td>{q.contest}</td>
                                                    { userData && userData.solved ? <td>{userData.solved.includes(q.title) ? "yes" : "no"}</td> : <td>no</td> }
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className='open-question'
                                                        >
                                                        <img src='/open.png' alt='open' style={{background:'transparent', maxHeight: '20px'}}/>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })}
                </div>
            {/* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#16161e+0,16161e+100&1+0,0+15,0+85,1+100 */}
            <Overlay backgroundOpacity={0.85} style={{ background: `linear-gradient(to bottom,  rgba(22,22,30,1) 0%,rgba(22,22,30,0) 15%,rgba(22,22,30,0) 85%,rgba(22,22,30,1) 100%)`}}/>
        </div>
    );
};
