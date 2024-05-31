import {
    Badge,
    Group,
    Title,
    Text,
    Card,
    Button,
    SimpleGrid,
    Container,
    Center,
    rem,
    useMantineTheme,
  } from '@mantine/core';
  import { IconGauge, IconUser, IconCookie } from '@tabler/icons-react';
  import classes from './FeaturesCards.module.css';
  import { Link } from 'react-router-dom'; // Import Link from react-router-dom
  
  const mockdata = [
    {
      title: 'Miscellaneous problems',
      description:
        'Filter through our ultimate collection of practice problems from your favourite contests and learn the topics of your choice at the difficulties of your choice.',
      icon: IconGauge,
      path: '/problems', // Add path for each feature
    },
    {
      title: 'Canadian Computing Competition',
      description:
        'The CCC is an annual programming competition for secondary school students in Canada, organized by the CEMC at the University of Waterloo.',
      icon: IconUser,
      path: '/ccc', // Add path for each feature
    },
    {
      title: 'USA Computing Olympiad',
      description:
        'The USACO supports computing education in the USA and worldwide by identifying, motivating, and training high-school computing students at all levels.',
      icon: IconCookie,
      path: '/usaco', // Add path for each feature
    },
  ];
  
  export function FeaturesCards() {
    const theme = useMantineTheme();
    const features = mockdata.map((feature) => (
      <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl" bg={'var(--code-bg)'} style={{ border: '1px solid var(--border)' }}>
        <feature.icon
          style={{ width: rem(50), height: rem(50) }}
          stroke={2}
          color={theme.colors.blue[6]}
        />
        <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
          {feature.title}
        </Text>
        <Text fz="sm" c="dimmed" mt="sm">
          {feature.description}
        </Text>
        <Link to={feature.path}> {/* Add Link component with path */}
          <Button variant="outline" color="blue" fullWidth mt="xl"> {/* Add Button component */}
            Learn more
          </Button>
        </Link>
      </Card>
    ));
  
    return (
      <Container size="lg" py="xl">
        <Title order={2} className={classes.title} ta="center" mt="sm">
          Master your contest of choice
        </Title>
      
        <Center>
        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          Practice from curated sets of problems pulled directly from your favourite programming contests. Prepare for all possible topics in a logical progression.
        </Text>      
        </Center>
  
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
          {features}
        </SimpleGrid>
      </Container>
    );
  }
  