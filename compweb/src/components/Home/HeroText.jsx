import { Title, Text, Button, Container, Group } from '@mantine/core';
import { Dots } from './Dots';
import classes from './HeroText.module.css';
import { Link } from 'react-router-dom';

export function HeroText() {
  return (
    <Container className={classes.wrapper} size={1400} style={{ zoom: '150%' }}>
      <div className={classes.inner}>
          <Title className={classes.title}>
            The fastest way to learn{' '}
          </Title>
          <Title className={classes.title} style={{ zoom: '110%' }}>
            <Text component="span" className={classes.highlight} inherit c="indigo">
              competitive programming
            </Text>
          </Title>
        <Container mt={15} p={0} size={600}>
          <Text c="var(--dim-text)" className={classes.description} size="xs">
            Streamline your journey with WizdomCode - your comprehensive roadmap,
          </Text>
          <Text c="var(--dim-text)" className={classes.description} size="xs">
            problem bank, code editor, and online judge
          </Text>
        </Container>

        <div className={classes.controls}>
          <Group>
            <Link to={'/login'}>
              <Button className={classes.control} variant="light">
                Log in
              </Button>
            </Link>
            <Link to={'/signup'}>
              <Button className={classes.control} variant="white">
                Get started
              </Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  );
}