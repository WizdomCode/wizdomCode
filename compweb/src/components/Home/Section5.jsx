import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import classes from './Section.module.css';

export function Section5() {
  return (
    <Container size="lg">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Feature-rich workspace
          </Title>
          <Text c="dimmed" mt="md">
            Instantly test code against official problem data or custom inputs. Custom code templates and personalized settings make your coding fast and seamless.
          </Text>
        </div>
        <Image src={'/logo512.png'} className={classes.image} mt={'-6rem'}/>
      </div>
    </Container>
  );
}