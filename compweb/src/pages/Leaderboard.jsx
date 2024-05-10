import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import styles from './Leaderboard.module.css';
import ViewUser from "./ViewUser";
import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  rem, 
  Card,
  Button,
  Code,
  NativeSelect,
  Combobox,
  useCombobox,
  Box,
  TextInput,
  Paper
} from '@mantine/core';
import { 
  IconPencil, 
  IconTrash,
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconSearch
} from '@tabler/icons-react';
import { useSelector } from "react-redux";
import { 
  useMantineTheme
} from '@mantine/core';

const Leaderboard = () => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch('');
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserRankData, setCurrentUserRankData] = useState(null);
  const [active, setActive] = useState('Billing');
  const [countryList, setCountryList] = useState([]);
  
  const userData = useSelector(state => state.userInfo);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(db, "Users");
        const usersQuery = query(usersCollectionRef, orderBy("points", "desc"));
        const querySnapshot = await getDocs(usersQuery);
        const userData = querySnapshot.docs.map(doc => doc.data());
        const rankedUsers = assignRanks(userData);
        setUsers(rankedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userData]);

  const assignRanks = (usersData) => {
    let currentRank = 1;
    let currentPoints = usersData[0].points;
    let countries = new Set();

    for (let i = 0; i < usersData.length; i++) {
      if (usersData[i].points < currentPoints) {
        currentRank = i + 1;
        currentPoints = usersData[i].points;
      }
      usersData[i].rank = currentRank;

      if (userData && usersData[i].username === userData.username) {
        console.log("Your rank:", usersData[i]);
        setCurrentUserRankData(usersData[i]);
      }

      countries.add(usersData[i].country);
    }

    setCountryList(Array.from(countries));

    return usersData;
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
  user.username?.toLowerCase().includes(searchQuery.toLowerCase())
);

  const handleUserClick = (userData) => {
    setSelectedUser(userData);
  };

  const handleCloseUser = () => {
    setSelectedUser(null);
  };

  const rows = filteredUsers.map((item) => (
    <Table.Tr key={item.username} onClick={() => handleUserClick(item)}>
      <Table.Td>
        <Badge color={'blue'} variant="light">
          {item.rank}
        </Badge>
      </Table.Td>

      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} src={item.avatar} radius={30} />
          <Text fz="sm" fw={500}>
            {item.username}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Anchor component="button" size="sm">
          {item.points}
        </Anchor>
      </Table.Td>

      <Table.Td>
        <Text fz="sm">{item.country}</Text>
      </Table.Td>

      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const options = countryList
    .filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
    .map((item) => (
      <Combobox.Option value={item} key={item}>
        {item}
      </Combobox.Option>
    ));

  return (
    <div>
      <div style={{display: 'flex', direction: 'row'}}>
        <div style={{ width: '100%' }}>
          <Group justify="center" grow preventGrowOverflow={false}>
            <div style={{ backgroundColor: 'var(--navbar)', borderRadius: '8px' }}>
              <div style={{ backgroundColor: 'var(--light-bg)', padding: '1px' }}>
                <div className={styles.marginSpacing}>  
                  <h1 className={styles.leaderboardHeader}>Leaderboard</h1>
                  <div style={{ width: '100%', display: 'flex', row: 'display', gap: '30px' }}>
                    <TextInput
                      label="Filter"
                      placeholder="Seach users"
                      leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} />}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      classNames={{ label: styles.searchLabel }}
                      style={{ width: '100%' }}
                    />
                    <div>
                      <Box mb="xs">
                        <Text span size="sm" c="dimmed">
                          Selected:{' '}
                        </Text>

                        <Text span size="sm">
                          {selectedItem || 'Nothing selected'}
                        </Text>
                      </Box>

                      <Combobox
                        store={combobox}
                        width={250}
                        position="bottom-start"
                        withArrow
                        onOptionSubmit={(val) => {
                          setSelectedItem(val);
                          combobox.closeDropdown();
                        }}
                      >
                        <Combobox.Target withAriaAttributes={false}>
                          <Button onClick={() => combobox.toggleDropdown()} style={{ width: '200px' }}>Select region</Button>
                        </Combobox.Target>

                        <Combobox.Dropdown>
                          <Combobox.Search
                            value={search}
                            onChange={(event) => setSearch(event.currentTarget.value)}
                            placeholder="Search countries"
                          />
                          <Combobox.Options>
                            {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
                          </Combobox.Options>
                        </Combobox.Dropdown>
                      </Combobox>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              {selectedUser ? (
                <ViewUser userData={selectedUser} onClose={handleCloseUser} />
              ) : (
                <>
                  <Table.ScrollContainer className={styles.leaderboardTable} minWidth={800}>
                    <Table verticalSpacing="sm">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Rank</Table.Th>
                          <Table.Th>User</Table.Th>
                          <Table.Th>Points</Table.Th>
                          <Table.Th>Country</Table.Th>
                          <Table.Th />
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </>    
              )}
            </div>
            { currentUserRankData &&
              <Card withBorder padding="xl" radius="md" className={styles.card}>
                <Card.Section
                  h={100}
                />
                <Avatar
                  src={currentUserRankData.avatar}
                  size={80}
                  radius={80}
                  mx="auto"
                  mt={-30}
                  className={styles.avatar}
                />
                <Text ta="center" fz="lg" fw={500} mt="sm">
                  {currentUserRankData.username}
                </Text>
                <Text ta="center" fz="sm" c="dimmed">
                  Bronze
                </Text>
                <Group mt="md" justify="center" gap={30}>
                <div>
                  <Text ta="center" fz="lg" fw={500}>
                    {currentUserRankData.rank}
                  </Text>
                  <Text ta="center" fz="sm" c="dimmed" lh={1}>
                    Rank
                  </Text>
                </div>
                <div>
                  <Text ta="center" fz="lg" fw={500}>
                    {currentUserRankData.points}
                  </Text>
                  <Text ta="center" fz="sm" c="dimmed" lh={1}>
                    Points
                  </Text>
                </div>
                <div>
                  <Text ta="center" fz="lg" fw={500}>
                    {currentUserRankData.solved.length}
                  </Text>
                  <Text ta="center" fz="sm" c="dimmed" lh={1}>
                    Solved
                  </Text>
                </div>
                </Group>
                <Button fullWidth radius="md" mt="xl" size="md" variant="default">
                  View profile
                </Button>
              </Card>
              }
          </Group>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;