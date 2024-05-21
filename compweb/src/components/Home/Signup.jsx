import { Text, Title, TextInput, Button, Image } from '@mantine/core';
import classes from './Signup.module.css';
import { CodeHighlight } from '@mantine/code-highlight';

export function Signup() {
  return (
    <div 
      style={{ 
        width: '60%', 
        backgroundColor: 'var(--code-bg)', 
        border: 'rem(1px) solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-8))' 
      }}
    >
      <div
        style={{
          padding: 'var(--mantine-spacing-xl)'
        }}
      >
        <CodeHighlight 
code='Learn competitive programming
Master that contest with The Top Solver'
          styles={{
            root: { backgroundColor: 'var(--code-bg)'},
            code: { fontSize: '30px' },
          }}
/>
      </div>
      <div  
        style={{ backgroundColor: 'var(--site-bg)', height: '8rem', display: 'flex', alignItems: 'center' }}
      >
          <Button size='xl'>Get started</Button>
      </div>
    </div>
  );
}