import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from './Section.module.css';

export function Section() {
  return (
    <Container size="lg">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Free. Fun. <span className={classes.highlight}>Effective.</span>
          </Title>
          <Text c="dimmed" mt="md">
            The Top Solver is the fastest and most robust way to learn competitive programming online.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>250+ Problems</b> – practice all possible topics with problems pulled from your favorite programming contests
            </List.Item>
            <List.Item>
              <b>59 Problemsets</b> – carefully designed to provide thorough understanding of topics
            </List.Item>
            <List.Item>
              <b>Linear progression</b> – Build your skills from the ground up by learning topics in a carefully designed progression
            </List.Item>
          </List>
        </div>
        <Image src={'/logo512.png'} className={classes.image} />
      </div>
    </Container>
  );
}