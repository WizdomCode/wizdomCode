import React from "react";
import Navigation from "../components/Navigation/Navigation";
import styles from '../components/styles/ProblemDescription.module.css';
import "../Fonts.css";
import { Link } from "react-router-dom";
import '../components/styles/Workspace.css';
import "../components/styles/Paths.css";
import Box from '@mui/material/Box';
import { Container } from '@mantine/core';
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
            <Box 
              sx={{ 
                maxWidth: '1200px',  // Adjust this value to control the width
                margin: '0 auto', 
                padding: '20px',
                transform: 'scale(1.1)', // Adjust this value to control the zoom
                transformOrigin: 'top center',
                marginBottom: '40px'  // Add margin-bottom to create space between the box and the footer
              }}
            >
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <HeroText />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <HeroBullets />
              </Box>

              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <FeaturesTitle />
              </Box>
              <Box sx={{ textAlign: 'center', width: '100%', marginBottom: '160px'  }}>
                <FeaturesCards />
              </Box>
            </Box>
            <Footer />
        </div>
    );
};

export default Home;
