import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from './ReverseSection.module.css';

export function Section4() {
  return (
    <Container size="lg">
      <div className={classes.inner}>
        <Image src={'/logo512.png'} className={classes.image} mt={'-6rem'}/>
        <div className={classes.content} style={{ marginLeft: '15rem', marginRight: '0' }}>
          <Title className={classes.title}>
            Linear progression
          </Title>
          <Text c="dimmed" mt="md">
            Build your skills from the ground up by learning topics in a carefully designed progression.
          </Text>
        </div>
      </div>
    </Container>
  );
}