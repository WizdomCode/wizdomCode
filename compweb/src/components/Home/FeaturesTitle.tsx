import { Title, SimpleGrid, Text, Button, ThemeIcon, Grid, rem, Stack, Center, Group, Paper, Image, Card, Overlay } from '@mantine/core';
import { IconReceiptOff, IconFlame, IconCircleDotted, IconFileCode, IconBrowser, IconFolder, IconPlayerPlay, IconCode } from '@tabler/icons-react';
import classes from './FeaturesTitle.module.css';
import { Link } from 'react-router-dom';

const features = [
  {
    imgPath: '/codeeditor.png',
    icon: <IconBrowser />,
    title: 'Browser-based editor',
    description: 'Skip the hassle of needing to write code on another IDE with our built-in code editor.',
  },
  {
    imgPath: '/filesystem.png',
    icon: <IconFolder />,
    title: 'Complete file system',
    description: 'Add, modify, delete, or save your code files online, and continue just where you left off!',
  },
  {
    imgPath: '/inputoutput.png',
    icon: <IconPlayerPlay />,
    title: 'Custom input/output',
    description:
      'Easily debug your code with custom inputs. Create test cases to diagnose problems in your code.',
  },
  {
    imgPath: '/templates.png',
    icon: <IconCode />,
    title: 'Templates',
    description:
      'Access algorithm and data structure templates in Python, Java, and C++.',
  },
];

export function FeaturesTitle() {
  const items = features.map((feature) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder bg="radial-gradient(circle, rgba(34,42,69,1) 0%, rgba(29,34,53,1) 21%, rgba(22,22,30,1) 50%)" style={{ border: '1px solid var(--code-bg)', position: 'relative' }}>
      <div key={feature.title}>
        <Text fz="lg" mt="sm" fw={500} c="white" ta="left" style={{ zoom: '125%' }}>
          {feature.title}
        </Text>
        <Text c="var(--dim-text)" fz="sm" maw={320} ta="left" style={{ zoom: '110%' }}>
          {feature.description}
        </Text>
        <Image src={feature.imgPath} maw={380} my={20} style={{ border: '1px solid var(--border)' }}/>
      </div>
    </Card>
  ));

  return (
    <div className={classes.wrapper}>
      <Center>
              <Title className={classes.title} style={{ zoom: '125%' }}>
                Home of the internet's best<br />
                <Text component="span" className={classes.highlight} inherit c="indigo">
                  browser-based IDE
                </Text>
              </Title>
      </Center>
      <Center>  
        <Grid gutter={80} mt={100} mb={80}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80}>
            {items}
          </SimpleGrid>
        </Grid>
      </Center>
    </div>
  );
}