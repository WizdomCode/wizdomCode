import React from "react";
import Navigation from "../components/Navigation/Navigation";
import styles from '../components/styles/ProblemDescription.module.css';
import "../Fonts.css";
import { Link } from "react-router-dom";
import '../components/styles/Workspace.css';
import "../components/styles/Paths.css";
import Box from '@mui/material/Box';
import { Center, Container } from '@mantine/core';
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
import SitePreview from "../components/Home/SitePreview";
import { PathsPreview } from "../components/Home/PathsPreview";
import { Stats } from "../components/Home/Stats";
import { Signup } from "../components/Home/Signup";
import { Section1 } from "../components/Home/Section1";
import { Section2 } from "../components/Home/Section2";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Home = () => {
    return (
        <div style={{ backgroundColor: 'var(--site-bg)' }}>
            <Navigation />
            <div style={{ background: 'radial-gradient(circle, rgba(34,42,69,1) 0%, rgba(29,34,53,1) 21%, rgba(22,22,30,1) 50%)' }}>
              <HeroText />
              <Center>
                <SitePreview />
              </Center>
            </div>
            <Box 
              sx={{ 
                maxWidth: '1200px',  // Adjust this value to control the width
                margin: '0 auto', 
                transform: 'scale(1.1)', // Adjust this value to control the zoom
                transformOrigin: 'top center',
                marginBottom: '40px',  // Add margin-bottom to create space between the box and the footer
                marginTop: '40px'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Section1 />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Section2 />
              </Box>              

              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <PathsPreview />
              </Box>

              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <FeaturesTitle />
              </Box>

              <Box sx={{ textAlign: 'center', width: '100%', marginBottom: '200px'  }}>
                <FeaturesCards />
              </Box>
              
              <Box sx={{ textAlign: 'center', width: '100%', marginBottom: '640px'  }}>
                <Center>
                  <Signup />
                </Center>
              </Box>
            </Box>
            <Footer />
        </div>
    );
};

export default Home;
