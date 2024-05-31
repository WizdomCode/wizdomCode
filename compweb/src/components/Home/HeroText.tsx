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
          The{' '}
          <Text component="span" className={classes.highlight} inherit>
            fastest
          </Text>{' '}
          way to learn competitive programming
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" c="dimmed" className={classes.description}>
            All in one platform which will streamline your path to acing all of your competitive programing endeavors
          </Text>
        </Container>

        <div className={classes.controls}>
          <Group>
            <Link to={'/login'}>
              <Button className={classes.control} size="lg" variant="default" color="gray">
                LOG IN
              </Button>
            </Link>
            <Link to={'/signup'}>
              <Button className={classes.control} size="lg">
                GET STARTED
              </Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  );
}