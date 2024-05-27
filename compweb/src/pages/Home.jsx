import React, {  } from "react";
import Navigation from "../components/Navigation/Navigation";
import styles from '../components/styles/ProblemDescription.module.css';
import "../Fonts.css";
import { Link } from "react-router-dom";
import '../components/styles/Workspace.css';
import "../components/styles/Paths.css";
import Box from '@mui/material/Box';
import { Container} from '@mantine/core';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import { Footer } from "../components/Home/Footer";
import { HeroBullets } from "../components/Home/HeroBullets";
import { HeroText } from "../components/Home/HeroText";
import { FeaturesCards } from "../components/Home/FeaturesCards";
import { FeaturesTitle } from "../components/Home/FeaturesTitle";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Home = () => {
    return (
        <div style={{ backgroundColor: 'var(--site-bg)' }}>
            <Navigation />
            <Container size="md"> {/* You can adjust the size (sm, md, lg, xl) or use a custom width */}
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <HeroText />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <HeroBullets />
              </Box>

              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <FeaturesTitle />
              </Box>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <FeaturesCards />
              </Box>
            </Container>
            <Footer />
        </div>
    );
};

export default Home;