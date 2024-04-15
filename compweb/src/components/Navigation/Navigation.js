import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import Authentication from './Authentication';

// Import your styles
import styles from '../styles/Navigation.module.css';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 200 ) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  })

  let navbarClasses=[styles.navbar];
  if(scrolled){
    navbarClasses.push(styles.navbarScrolled);
  }

  return (
    <Navbar expand="lg" className={navbarClasses.join(" ")}>
      <Container className={styles.container}>
        <Navbar.Brand href="#home">Competitive Programming Website</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`me-auto ${styles.nav}`}>
            <Nav.Link className={styles.navLink} href="/">Home</Nav.Link>
            <Authentication/>
            <Nav.Link className={styles.navLink} href="/aboutus">AboutUs</Nav.Link>
            <Nav.Link className={styles.navLink} href="/leaderboard">Leaderboard</Nav.Link>
            <Nav.Link className={styles.navLink} href="/learningpath">LearningPath</Nav.Link>
            <Nav.Link className={styles.navLink} href="/problems">Problems</Nav.Link>
            <Nav.Link className={styles.navLink} href="/addproblem">AddProblems</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
