import { Group, Image, Text } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (            
    <Link to="/">
        <Group gap={6}>
        <Image src={'/templogo.png'} w={60} h={'50px'} style={{ marginLeft: '10px' }}/>
        <Text size="xl" fw={900}>WizdomCode</Text>
        </Group>
    </Link>
  )
}

export default Logo