import React from 'react';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';

interface HeaderRowTableProps {
  data: {
    [key: string]: {
      label: string;
      value: any;
    };
  };
}
function HeaderRowTable({ data }: HeaderRowTableProps) {
  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Table>
        <TableBody
          sx={{
            '& tr::first-of-type th': {
              borderTopLeftRadius: '10px',
            },
            '& td::first-of-type': {
              borderBottomLeftRadius: '10px',
            },
            '& td:last-child': {
              borderBottomRightRadius: '10px',
            },
            '& tr:last-child th': {
              borderBottomLeftRadius: '10px',
            },
          }}
        >
          {data &&
            Object.keys(data).map((k) => {
              const { label, value } = data[k];
              return (
                <TableRow key={label}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      width: 'max-content',
                      whiteSpace: 'nowrap',
                      borderRight: '1px solid #ccc',
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </TableCell>
                  <TableCell style={{ width: '100%' }}>{value}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default HeaderRowTable;
