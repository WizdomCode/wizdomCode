import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from './ReverseSection.module.css';

export function Section6() {
  return (
    <Container size="lg">
      <div className={classes.inner}>
        <Image src={'/logo512.png'} className={classes.image} mt={'-6rem'}/>
        <div className={classes.content} style={{ marginLeft: '15rem', marginRight: '0' }}>
          <Title className={classes.title}>
            Effortless progress tracking
          </Title>
          <Text c="dimmed" mt="md">
            Monitor your growth with quantifiable metrics such as rank, point totals, and proficiency analysis based on solved problems. Understand your strengths and identify areas for improvement.
          </Text>
        </div>
      </div>
    </Container>
  );
}