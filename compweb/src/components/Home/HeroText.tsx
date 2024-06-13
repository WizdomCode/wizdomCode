import { Title, Text, Button, Container, Group } from '@mantine/core';
import { Dots } from './Dots';
import classes from './HeroText.module.css';
import { Link } from 'react-router-dom';

export function HeroText() {
  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
          <Title className={classes.title}>
            Wizdom Code,{' '}
            <span className={classes.break}>the fastest way to learn</span>{' '}
            <Text component="span" className={classes.highlight} inherit>
              competitive programming
            </Text>
          </Title>
        {/*
        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            All in one platform which will streamline your path to acing all of your competitive programing endeavors
          </Text>
        </Container>
         Hello World */}

        <div className={classes.controls}>
          <Group>
            <Link to={'/login'}>
              <Button className={classes.control} size="lg" variant="light">
                LOG IN
              </Button>
            </Link>
            <Link to={'/signup'}>
              <Button className={classes.control} size="lg" variant="white">
                GET STARTED
              </Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  );
}