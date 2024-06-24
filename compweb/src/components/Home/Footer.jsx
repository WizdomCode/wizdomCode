import { Container, Group, ActionIcon, rem, Image, Text } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconMail } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './Footer.module.css';
import Logo from '../Navigation/Logo';

export function Footer() {
  return (
    <div className={classes.footer} style={{ backgroundColor: 'var(--site-bg)' }}>
      <Container className={classes.inner}>
        <Logo />
        <Group gap={8} className={classes.links} justify="flex-end" wrap="nowrap">
          <IconMail stroke={1.5} />
          <Text>admin@wizdomcode.com</Text>
        </Group>
      </Container>
    </div>
  );
}