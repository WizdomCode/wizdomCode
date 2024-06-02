import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from './HeroBullets.module.css';

export function HeroBullets() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Free. <span className={classes.highlight}>Fun.</span> Effective.<br />
          </Title>
          <Text c="dimmed" mt="md">
            Our comprehensive website promises to provide an efficient and effective learning experience for all
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
              <b>60 Problemsets</b> – carefully designed to provide thorough understanding of topics
            </List.Item>
            <List.Item>
              <b>Linear progression</b> – Build your skills from the ground up by learning topics in a carefully designed progression
            </List.Item>
          </List>
        </div>
        <Image src={'/herobullets.svg'} className={classes.image} />
      </div>
    </Container>
  );
}
