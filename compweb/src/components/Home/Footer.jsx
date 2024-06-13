import { Container, Group, ActionIcon, rem, Image, Text } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconMail } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <div className={classes.footer} style={{ backgroundColor: 'var(--site-bg)' }}>
      <Container className={classes.inner}>
        <Group gap={6}>
          <Image src={'/templogo.png'} w={60} h={'50px'} style={{ marginLeft: '10px' }}/>
          <Text>WizdomCode</Text>
        </Group>
        <Group gap={8} className={classes.links} justify="flex-end" wrap="nowrap">
          <IconMail style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          <Text>admin@wizdomcode.com</Text>
        </Group>
      </Container>
    </div>
  );
}