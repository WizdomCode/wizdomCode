import React, {useState} from "react";
import {auth, app} from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./index.css";
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
  } from '@mantine/core';
import classes from './SignUp.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            navigate("/");
        })
        .catch((error) => {
            // Handle error here
        });
    };

    const handlePasswordReset = () => {
        if (email) {
            sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent!");
            })
            .catch((error) => {
                // Handle error here
                alert("Error sending password reset email: " + error.message);
            });
        } else {
            alert("Please enter your email address.");
        }
    };

    return (
        <>
            <Container size={420} my={40} w={800}>
                <Title ta="center" className={classes.title}>
                    Welcome back!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Don't have an account?{' '}
                    <Anchor size="sm" component="button" onClick={() => navigate('/signup')}>
                        Create account
                    </Anchor>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ backgroundColor: 'var(--site-bg)', border: '1px solid var(--border)' }}>
                    <TextInput
                        label="Email"
                        placeholder="you@mantine.dev"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        styles={{ 
                            input: { backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)'}, 
                        }}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required
                        mt="md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        styles={{ 
                            input: { backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)'}, 
                        }}
                    />
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me" display={'none'}/>
                        <Anchor component="button" size="sm" onClick={handlePasswordReset}>
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl" variant="light" onClick={signIn}>
                        Sign in
                    </Button>
                </Paper>
            </Container>
        </>
    );
};

export default Login;
