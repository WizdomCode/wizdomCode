import { Title, SimpleGrid, Text, Button, ThemeIcon, Grid, rem, Stack, Center, Group, Paper, Image, Card } from '@mantine/core';
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
    <Card shadow="sm" padding="lg" radius="md" withBorder bg="radial-gradient(circle, rgba(22,22,30,1) 50%, rgba(26,27,38,1) 100%)" style={{ border: '1px solid var(--code-bg)'}}>
      <div key={feature.title}>
        <Image src={feature.imgPath} maw={380} my={20} style={{ border: '1px solid var(--border)' }}/>
          <Text fz="lg" mt="sm" fw={500} c="white" ta="left" style={{ zoom: '125%' }}>
            {feature.title}
          </Text>
          <Text c="var(--dim-text)" fz="sm" maw={320} ta="left" style={{ zoom: '110%' }}>
            {feature.description}
          </Text>
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