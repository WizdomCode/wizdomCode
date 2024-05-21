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
import { Hero } from "../components/Home/Hero";
import { Section } from "../components/Home/Section";
import { ReverseSection } from "../components/Home/ReverseSection";
import { Section3 } from "../components/Home/Section3";
import { Section4 } from "../components/Home/Section4";
import { Section5 } from "../components/Home/Section5";
import { Section6 } from "../components/Home/Section6";
import { FAQ } from "../components/Home/FAQ";
import { Signup } from "../components/Home/Signup";
import { Footer } from "../components/Home/Footer";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Home = () => {
    return (
        <div style={{ backgroundColor: 'var(--site-bg)' }}>
            <Navigation />
            <Hero />
            <Section />
            <ReverseSection />
            <Section3 />
            <Section4 />
            <Section5 />
            <Section6 />
            <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
              <Signup />
            </div>
            <Footer />
        </div>
    );
};

export default Home;