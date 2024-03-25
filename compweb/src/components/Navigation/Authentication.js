import React, {useEffect, useState} from "react";
import {auth, app} from "../../firebase"
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut} from "firebase/auth";
import styles from '../styles/Navigation.module.css';

const Authentication = () => {
  const [authenticatedUser, setauthenticatedUser] = useState("");

  useEffect(() => {
    const listenAuth = onAuthStateChanged(auth, (user) =>{
      if (user){
        setauthenticatedUser(user)
      } else {
        setauthenticatedUser(null)
      }
    }
    )
    return () => {
      listenAuth();
    }
  },[])
  
  const userSignOut = () => {
    signOut(auth)
  }

  return (
    <>
    {authenticatedUser == null ? 
    <>
      <Nav.Link className={styles.navLink} href="/login">Login</Nav.Link>
      <Nav.Link className={styles.navLink} href="/signup">Signup</Nav.Link>
      
    </> : 
      <>
        <Nav.Link href="/" onClick={userSignOut}>Sign Out</Nav.Link>
        <Nav.Link href="/userprofile">UserProfile</Nav.Link>
      </>
      }
    </>
  );
}

export default Authentication;