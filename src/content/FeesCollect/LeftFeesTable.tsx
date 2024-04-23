import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Tuition Fees', 159, 6.0, 24, 4.0),
  createData('Admission Fees', 237, 9.0, 37, 4.3),
  createData('Total', 262, 16.0, 24, 6.0)
];

export default function LeftFeesTable() {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 0.5 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ textTransform: 'none' }}>Fees Head</TableCell>
            <TableCell sx={{ textTransform: 'none' }} align="right">
              Amount
            </TableCell>
            <TableCell sx={{ textTransform: 'none' }} align="right">
              Paid Amount
            </TableCell>
            <TableCell sx={{ textTransform: 'none' }} align="right">
              Discount
            </TableCell>
            <TableCell sx={{ textTransform: 'none' }} align="right">
              Due
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
