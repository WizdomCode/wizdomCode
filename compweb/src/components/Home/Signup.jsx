import { Text, Title, TextInput, Button, Image, Card, Center, Container } from '@mantine/core';
import classes from './Signup.module.css';
import { CodeHighlight } from '@mantine/code-highlight';

export function Signup() {
  return (
      <Card className={classes.wrapper} w={900} shadow="sm" p={80} radius="md" withBorder bg="linear-gradient(0deg, rgba(22,22,30,1) 0%, rgba(26,27,38,1) 75%)" style={{ border: '1px solid var(--code-bg)'}}>
        <div className={classes.inner}>
          <Title className={classes.title} style={{ zoom: '110%' }}>
            Ready to streamline your
          </Title>
          <Title className={classes.title} style={{ zoom: '110%' }}>
            coding experience?
          </Title>

          <Container p={0} size={600} mt={18}>
            <Text c="var(--dim-text)" className={classes.description}>
            Join us to simplify your competitive programming education<br /> 
            and achieve success in your contest of choice
            </Text>
          </Container>

          <div className={classes.controls}>
            <Button className={classes.control} size="lg" variant='white' radius="xl" mt={18}>
              Get started for free
            </Button>
          </div>
        </div>
      </Card>
  );
}