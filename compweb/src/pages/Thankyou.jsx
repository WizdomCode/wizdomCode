import { Title, Text, Button, Container, Group } from '@mantine/core';
import classes from './NotFoundTitle.module.css';

export default function Thankyou() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(165deg, rgba(36,41,62,1) 0%, rgba(26,27,38,1) 100%)' }}>
      <Container className={classes.root}>
        <Title className={classes.title}>Thank you for signing up!</Title>
        <Text c="dimmed" size="lg" ta="center" className={classes.description}>
          We'll keep you up-to-date with all the latest happenings!
        </Text>
      </Container>
    </div>
  );
}