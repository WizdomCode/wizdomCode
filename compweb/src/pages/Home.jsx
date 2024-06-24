import React from "react";
import Navigation from "../components/Navigation/Navigation";
import styles from '../components/styles/ProblemDescription.module.css';
import "../Fonts.css";
import { Link } from "react-router-dom";
import '../components/styles/Workspace.css';
import "../components/styles/Paths.css";
import Box from '@mui/material/Box';
import { Center, Container, Image, Overlay, Stack } from '@mantine/core';
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
              <Center pos={'relative'}>
                <Image src={'/apppreview.png'} w={'80vw'} style={{ 
                  border: '1px solid var(--border)', 
                  boxShadow: '0px -2px 0px 0px #202740, 0 -20px 80px 1px #181a25' 
                }}/>
                <Overlay backgroundOpacity={0} />
              </Center>
            </div>
            <Stack
              align="stretch"
              justify="space-around"
              gap={200}
              my={200}
            >
              <Section1 />
            
              <Section2 />

              <PathsPreview />

              <FeaturesTitle />

              <FeaturesCards />
            
              <Center>
                <Signup />
              </Center>
            </Stack>
            <Footer />
        </div>
    );
};

export default Home;
