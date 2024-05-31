import { Title, SimpleGrid, Text, Button, ThemeIcon, Grid, rem, Stack, Center, Group, Paper, Image } from '@mantine/core';
import { IconReceiptOff, IconFlame, IconCircleDotted, IconFileCode } from '@tabler/icons-react';
import classes from './FeaturesTitle.module.css';
import { Link } from 'react-router-dom';

const features = [
  {
    imgPath: '/codeeditor.png',
    title: 'Browser-based editor',
    description: 'Skip the hassle of needing to write code on another IDE with our built-in code editor.',
  },
  {
    imgPath: '/filesystem.png',
    title: 'Complete file system',
    description: 'Add, modify, delete, or save your code files online, and continue just where you left off!',
  },
  {
    imgPath: '/inputoutput.png',
    title: 'Custom input/output',
    description:
      'Easily debug your code with custom inputs. Create test cases to diagnose problems in your code.',
  },
  {
    imgPath: '/templates.png',
    title: 'Templates',
    description:
      'Access algorithm and data structure templates in Python, Java, and C++.',
  },
];

export function FeaturesTitle() {
  const items = features.map((feature) => (
    <div key={feature.title}>
      <Image src={feature.imgPath} maw={380} style={{ border: '1px solid var(--border)' }}/>
      <Center>
        <Text fz="lg" mt="sm" fw={500} style={{ zoom: '110%' }}>
          {feature.title}
        </Text>
      </Center>
      <Center>
        <Text c="dimmed" fz="sm" maw={320} style={{ zoom: '110%' }}>
          {feature.description}
        </Text>
      </Center>
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      <Center>
        <Paper withBorder p="xl" radius="md" bg={'var(--code-bg)'} style={{ border: '1px solid var(--border)' }}>
          <Group w={900} justify="space-between">
            <Stack>
              <Title className={classes.title} order={2} ta={'left'}>
                The best browser-based IDE
              </Title>
              <Text c="dimmed" maw={350} ta={'left'}>
                All in one online IDE which will make sure you never have to use another online IDE again!
              </Text>
            </Stack>

            <Link to={'/problems'}>
              <Button
                variant="gradient"
                gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
                size="lg"
                radius="md"
                mt="md"
              >
                Check it out
              </Button>
            </Link>
          </Group>
        </Paper>
      </Center>
      <Center>  
        <Grid gutter={80} mt={160} mb={80}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80}>
            {items}
          </SimpleGrid>
        </Grid>
      </Center>
    </div>
  );
}