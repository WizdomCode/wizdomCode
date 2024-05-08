import React, {  } from "react";
import Navigation from "../components/Navigation/Navigation";
import styles from '../components/styles/ProblemDescription.module.css';
import "../Fonts.css";
import { Link } from "react-router-dom";
import '../components/styles/Workspace.css';
import "../components/styles/Paths.css";
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Home = () => {
    return (
        <>
            <Navigation />
            <div className='universal'>
                <div className={styles.wrapper}>
                  <div className='hero'>
                    <div>
                      <br />
                      <h1>Learn competitive programming.</h1>
                      <h1>Master any contest.</h1>
                      <br />
                      <p className={styles.customLatex}>Notice: This is a conceptual version. This project is very early in development and we welcome any and all feedback or suggestions. Contact us: competitive.programming2197@gmail.com</p>
                      <br />
                      <Link to="/signup" className={styles.img}>
                        <button className={styles.runAll} style={{color: 'white'}}>Get started</button>
                      </Link>
                      <br /> 
                    </div>
                  </div>
                  <br /> 
                  <ThemeProvider theme={darkTheme}>
                    <Box sx={{ width: '100%' }}>
                      <Card variant="outlined">
                        <CardMedia
                          sx={{ height: 140 }}
                          image="/problems.png"
                          title="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            Problem database
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Study from 10+ hand-picked problems on the ultimate platform for preparing for competitive programming contests.
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Link to="/problems" className={styles.img}>
                            <Button size="small">Get Started</Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Box>
                    <br />
                    <Box sx={{ width: '100%' }}>
                      <Card variant="outlined">
                      <CardMedia
                          sx={{ height: 140 }}
                          image="/duopaths.png"
                          title="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            Learning paths
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Waste no time learning topics in a logical progression.
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Link to="/ccc" className={styles.img}>
                            <Button size="small">CCC Topics</Button>
                          </Link>
                          <Link to="/usaco" className={styles.img}>
                            <Button size="small">USACO Topics</Button>
                          </Link>
                        </CardActions>
                      </Card>
                    </Box>
                    <br />
                    <Box sx={{ width: '100%' }}>
                      <Card variant="outlined">
                      <CardMedia
                          sx={{ height: 140 }}
                          image="/workspace.png"
                          title="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            Feature-rich workspace
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Instantly test code against official problem data or custom inputs.
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small">Learn More</Button>
                        </CardActions>
                      </Card>
                    </Box>
                    <br />
                    <Box sx={{ width: '100%' }}>
                      <Card variant="outlined">
                      <CardMedia
                          sx={{ height: 140 }}
                          image="/templates.png"
                          title="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            Code Templates
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Waste no time crafting solutions with our extensive collection of code templates.
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button size="small">Learn More</Button>
                        </CardActions>
                      </Card>
                    </Box>
                  </ThemeProvider>
                  <br />
                  <br />
                  <h1>Start from a contest</h1>
                  <br />
                  <Link to="/ccc" className={styles.img}>
                    <button className={styles.runAll} style={{color: 'white'}}>CCC</button>
                  </Link>
                  <br />
                  <Link to="/usaco" className={styles.img}>
                    <button className={styles.runAll} style={{color: 'white'}}>USACO</button>
                  </Link>
                  <br />
                </div>
              </div>
        </>
    );
};

export default Home;