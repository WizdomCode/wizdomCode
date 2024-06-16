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
    Overlay,
  } from '@mantine/core';
  import { IconGauge, IconUser, IconCookie } from '@tabler/icons-react';
  import classes from './FeaturesCards.module.css';
  import { Link } from 'react-router-dom'; // Import Link from react-router-dom
  
  const UsacoIcon = () => <img src='/usaco.png' alt="Usaco Paths" style={{width: rem(40), height: rem(40)}}/>;
  const CCCIcon = () => <img src='/ccc.png' alt="CCC Paths" style={{width: rem(40), height: rem(40)}}/>;  

  const mockdata = [
    {
      title: 'Canadian Computing Competition',
      description:
        'The CCC is an annual programming competition for secondary school students in Canada, organized by the CEMC at the University of Waterloo.',
      icon: CCCIcon,
      path: '/ccc', // Add path for each feature
    },
    {
      title: 'USA Computing Olympiad',
      description:
        'The USACO supports computing education in the USA and worldwide by identifying, motivating, and training high-school computing students at all levels.',
      icon: UsacoIcon,
      path: '/usaco', // Add path for each feature
    },
  ];
  
  export function FeaturesCards() {
    const theme = useMantineTheme();
    const features = mockdata.map((feature) => (
      <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl" bg="radial-gradient(circle, rgba(22,22,30,1) 50%, rgba(26,27,38,1) 100%)" style={{ border: '1px solid var(--code-bg)', position: 'relative' }}>
        <feature.icon
          style={{ width: rem(50), height: rem(50) }}
          stroke={2}
          color={theme.colors.blue[6]}
        />
        <Text fz="lg" fw={700} className={classes.cardTitle} mt="md" c="white">
          {feature.title}
        </Text>
        <Text fz="sm" c="var(--dim-text)" mt="sm">
          {feature.description}
        </Text>
        <Link to={feature.path}> {/* Add Link component with path */}
          <Button variant="outline" color="blue" fullWidth mt="xl"> {/* Add Button component */}
            Learn more
          </Button>
        </Link>
        <Overlay gradient='linear-gradient(to bottom, rgba(0,0,0,0) 1%,rgba(22,31,57,0) 36%,rgba(61,89,161,0.10) 100%)'/>
      </Card>
    ));
  
    return (
      <Container size="lg">
        <Title className={classes.title} ta="center" mt="sm" c="white">
          Master your contest of choice
        </Title>
      
        <Center>
        <Text c="var(--dim-text)" className={classes.description} ta="center" mt="md">
          Practice from curated sets of problems pulled directly from your favourite programming contests.
        </Text>      
        </Center>
  
        <Center>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt={50} w={800}>
            {features}
          </SimpleGrid>
        </Center>
      </Container>
    );
  }
  