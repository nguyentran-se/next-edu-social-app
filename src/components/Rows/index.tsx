import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
interface RowsProps {
  data: {
    [key: string]: {
      label: string;
      value: string | boolean | number;
    };
  };
}

function Rows({ data }: RowsProps) {
  const properties = Object.keys(data);
  const rows = chunk(properties, 2);

  return (
    <Paper sx={{ p: 2 }}>
      {rows.map((row, index) => (
        <Box key={index} sx={{ display: 'flex', gap: '0 10px' }}>
          {row.map((property, index) => (
            <Stack key={index}>
              <Box sx={{ fontWeight: 600 }}>{data[property].label}</Box>
              <Box>{data[property].value}</Box>
            </Stack>
          ))}
        </Box>
      ))}
    </Paper>
  );
}

export default Rows;

function chunk<T>(input: T[], size: number) {
  return input.reduce((arr: T[][], item, idx) => {
    return idx % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
}
