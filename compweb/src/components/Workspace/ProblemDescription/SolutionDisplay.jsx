import React from 'react';
import { Card, Button, Code, Text, Group } from '@mantine/core';

const SolutionDisplay = ({ solution, index, selectedSolution, toggleCodeVisibility }) => {
  return (
    <Card shadow="sm" padding="lg" style={{ marginBottom: '1rem' }}>
      <Group position="apart" style={{ marginBottom: 5 }}>
        <Text weight={500}>User ID: {solution.userId}</Text>
        <Text color="dimmed">Execution Time: {solution.executionTime}</Text>
      </Group>
      <Button variant="outline" onClick={() => toggleCodeVisibility(index)}>
        {selectedSolution === index ? 'Hide Code' : 'Show Code'}
      </Button>
      {selectedSolution === index && (
        <Code block style={{ marginTop: '1rem' }}>
          {solution.solution}
        </Code>
      )}
    </Card>
  );
};

export default SolutionDisplay;
