import { Title, Text, Button, Container } from '@mantine/core';
import { Dots } from './Dots.jsx';
import classes from './HeroText.module.css';
import { Link, useLocation } from "react-router-dom";

export function Hero() {
  return (
    <div style={{ 
        height: '80vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
    }}>    
        <Container className={classes.wrapper} size={1400} style={{ width: '80%', zoom: '150%' }}>
        <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
        <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
        <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

        <div className={classes.inner}>
            <Title className={classes.title}>
            The{' '}
            <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
                fastest way
            </Text>{' '}
            to learn competitive programming.
            </Title>

            <Container p={0} size={600}>
            <Text size="lg" c="dimmed" className={classes.description}>
                Ace your next programming contest with our all-in-one study guide.
            </Text>
            </Container>

            <div className={classes.controls}>
            <Button className={classes.control} size="md" variant="default" color="gray">
                I HAVE AN ACCOUNT
            </Button>
            <Link to={'/signup'}>
                <Button className={classes.control} size="md">
                    GET STARTED
                </Button>
            </Link>
            </div>
        </div>
        </Container>
    </div>
  );
}