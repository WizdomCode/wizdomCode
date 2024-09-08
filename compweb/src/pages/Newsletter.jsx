import React, { useState } from 'react';
import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
} from '@mantine/core';
import classes from './Newsletter.module.css';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emailDoc = doc(db, 'Newsletter', 'emails');
      await updateDoc(emailDoc, {
        emails: arrayUnion(email),
      });
      navigate('/newsletter/thankyou');
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(165deg, rgba(36,41,62,1) 0%, rgba(26,27,38,1) 100%)' }}>
      <Container size={460} py={30} style={{ zoom: '150%' }}>
        <Title className={classes.title} ta="center">
          Sign up for the newsletter!
        </Title>
        <Text c="dimmed" fz="sm" ta="center">
          Receive the latest product updates.
        </Text>

        <Paper withBorder shadow="md" p={20} radius="md" mt="xl" bg={'var(--site-bg)'} style={{ borderColor: 'black' }}>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Your email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              styles={{ input: { background: 'var(--code-bg)', borderColor: 'black' } }}
            />
            <Group justify="end" mt="sm" className={classes.controls}>
              <Button type="submit" className={classes.control} variant='light'>Submit</Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
