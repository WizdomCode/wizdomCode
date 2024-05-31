import React, { useState, useMemo, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
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
  Divider,
  Center,
  Box,
  Progress,
  Combobox,
  useCombobox,
  ScrollArea,
  Input, 
  InputBase,
  NumberInput
} from '@mantine/core';
import classes from './SignUp.module.css';
import { GoogleButton } from './GoogleButton';
import { TwitterButton } from './TwitterButton';
import { IconCheck, IconX } from '@tabler/icons-react';
import countryList from 'react-select-country-list'

function PasswordRequirement(props) {
  const { meets, label } = props;
  return (
    <Text component="div" color={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size="0.9rem" stroke={1.5} /> : <IconX size="0.9rem" stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const addUserIdToPointsArray = async (userId) => {
    const documentIds = ["General", "Challenges", "ComputingContest", "Community", "Miscellaneous"];

    for (const documentId of documentIds) {
      try {
        const docRef = doc(db, "Achievements", documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          let updated = false;

          // Iterate over each key in the document data
          for (const key in data) {
            if (data.hasOwnProperty(key) && typeof data[key] === 'object' && data[key] !== null) {
              // Check if the object has a points property and it's an array
              if (Array.isArray(data[key].points)) {
                // Add the userId: 0 to the points array
                data[key].points.push({ [userId]: 0 });
                updated = true;
              }
            }
          }

          // If any updates were made, update the document
          if (updated) {
            await updateDoc(docRef, data);
          } else {
          }
        } else {
        }
      } catch (error) {
      }
    }
  };

  const signUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set user information with the same ID as the user's authentication UID
      const userDocRef = doc(db, "Users", user.uid);

      // Create an empty array called "solved" for each new user
      const skills = {
        "Ad Hoc": 0,
        "Data Structures": 0,
        "Dynamic Programming": 0,
        "Graph Theory": 0,
        "Greedy Algorithms": 0,
        "Math": 0,
        "String Algorithms": 0
        // Add more skills here if needed
      };

      const userData = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        country: country,
        city: city,
        age: parseInt(age, 10),
        points: 0,
        coins: 0,
        solved: [], // Empty array for solved problems
        solvedCategories: [],
        streak: 0,
        skills: skills // Assign the skills map to userData
      };

      await setDoc(userDocRef, userData);
      await addUserIdToPointsArray(user.uid);

      // Redirect to the home page after successful sign-up
      navigate("/"); // Replace "/" with the path of your home page

    } catch (error) {
    }
  };

  const strength = getStrength(password);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: '0ms' } }}
        value={
          password.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
        }
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        key={index}
        size={4}
      />
    ));

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });  

  const countries = useMemo(() => countryList().getData(), []);

  const options = countries
    .filter((item) => item.label.toLowerCase().includes(searchCountry.toLowerCase().trim()))
    .map((item) => (
      <Combobox.Option value={item.label} key={item.label}>
        {item.label}
      </Combobox.Option>
    ));

  useEffect(() => {
    // we need to wait for options to render before we can select first one
    combobox.selectFirstOption();
  }, [searchCountry]);    

  return (
    <>
      <Container size={580} my={40}>
        <Title ta="center" className={classes.title}>
          Welcome to The Top Solver!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Already a user?{' '}
          <Anchor size="sm" component="button">
            Login
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ backgroundColor: 'var(--code-bg)', border: '1px solid var(--border)' }}>
          <Text size="lg" fw={500}>
            Sign up with
          </Text>

          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Google</GoogleButton>
            <TwitterButton radius="xl">Twitter</TwitterButton>
          </Group>

          <Divider label="Or continue with email" labelPosition="center" my="lg" />

          <TextInput label="Username" placeholder="Username" mb={8} styles={{
              input: { backgroundColor: 'var(--site-bg)' }
            }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />

          <Group justify="space-between" grow>
            <TextInput label="First name" placeholder="First name" mb={8} styles={{
              input: { backgroundColor: 'var(--site-bg)' }
            }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextInput label="Last name" placeholder="Last name" mb={8} styles={{
              input: { backgroundColor: 'var(--site-bg)' }
            }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Group>
          <TextInput label="Email" placeholder="you@mantine.dev" required mb={8} styles={{
            input: { backgroundColor: 'var(--site-bg)' }
          }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              label="Password"
              required
              styles={{
                input: { backgroundColor: 'var(--site-bg)' }
              }}
              mb={8}
            />

            { password && (
              <>
                <Group gap={5} grow mt="xs" mb="md">
                  {bars}
                </Group>

                <PasswordRequirement label="Has at least 6 characters" meets={password.length > 5} />
                {checks}
              </>
            )}
          </div>

          <Group justify="space-between" grow>
            <Combobox
              store={combobox}
              position="bottom-start"
              withinPortal={false}
              onOptionSubmit={(val) => {
                console.log('c', val);
                setCountry(val);
                setSearchCountry(val);
                combobox.closeDropdown();
              }}
            >
              <Combobox.Target withAriaAttributes={false}>
                <InputBase
                  rightSection={<Combobox.Chevron />}
                  onClick={() => combobox.toggleDropdown()}
                  rightSectionPointerEvents="none"
                  value={searchCountry}
                  onChange={(event) => {
                    console.log('a', event.currentTarget.value);
                    combobox.openDropdown();
                    combobox.updateSelectedOptionIndex();      
                    setSearchCountry(event.currentTarget.value)
                  }}
                  label="Select country"
                  placeholder="Select country"
                  onBlur={() => {
                    console.log('b', country);
                    combobox.closeDropdown();
                    setSearchCountry(country || '');
                  }}
                  styles={{
                    input: { backgroundColor: 'var(--site-bg)' }
                  }}
                />
              </Combobox.Target>

              <Combobox.Dropdown>
                <Combobox.Options>
                  <ScrollArea.Autosize type="scroll" mah={200}>
                    {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
                  </ScrollArea.Autosize>
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>

            <NumberInput value={age} onChange={setAge} label="Age" placeholder="Enter your age"styles={{
              input: { backgroundColor: 'var(--site-bg)' }
            }}
              clampBehavior="strict"
              min={1}
              max={120}
              allowDecimal={false}      
            />
          </Group>

          <Button fullWidth mt="xl" onSubmit={signUp}>
            CREATE ACCOUNT
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default SignUp;
