import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from './Section.module.css';

export function Section3() {
  return (
    <Container size="lg">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            <span className={classes.highlight}>59</span> Problemsets
          </Title>
          <Text c="dimmed" mt="md">
            All carefully designed to provide thorough understanding of topics.
          </Text>
        </div>
        <Image src={'/logo512.png'} className={classes.image} mt={'-6rem'}/>
      </div>
    </Container>
  );
}