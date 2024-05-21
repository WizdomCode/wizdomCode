import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from './ReverseSection.module.css';

export function ReverseSection() {
  return (
    <Container size="lg">
      <div className={classes.inner}>
        <Image src={'/logo512.png'} className={classes.image} mt={'-6rem'}/>
        <div className={classes.content} style={{ marginLeft: '15rem', marginRight: '0' }}>
          <Title className={classes.title}>
            <span className={classes.highlight}>250+</span> Problems
          </Title>
          <Text c="dimmed" mt="md">
            Practice all possible topics with problems pulled from your favorite programming contests.
          </Text>
        </div>
      </div>
    </Container>
  );
}