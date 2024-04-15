import React, { useState } from 'react';
import styles from '../../styles/TextField.module.css';

const TextField = ({ defaultValue, onValueChange }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
    onValueChange(event.target.value);
  };

  return (
    <textarea className={styles.customTextField} value={value} onChange={handleChange} />
  );
};

export default TextField;
