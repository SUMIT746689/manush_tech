import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { TextFieldWrapper } from '@/components/TextFields';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  due: number
) {
  return { name, calories, fat, carbs, protein, due };
}

const rows = [
  createData('Tuition Fees', 159, 100, 6.0, 24, 4.0),
  createData('Admission Fees', 237, 100, 9.0, 37, 4.3),
  createData('Total', 262, 100, 16.0, 24, 6.0)
];

export default function LeftFeesTable({
  leftFeesTableData,
  leftFeesTableColumnDataState,
  leftFeesTableColumnData,
  currDiscount,
  setCurrDiscount,
  leftFeesTableTotalCalculation,
  tableData,
  feesUserData,
  selectedRows,
  setSelectedRows,
  selectAll,
  setSelectAll
}) {
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedRows = tableData.map((row) => row.feeId);

      let newArrSelectedRow = [];

      for (let i = 0; i < newSelectedRows.length; i++) {
        for (let j = 0; j < tableData.length; j++) {
          if (
            tableData[j].feeId === newSelectedRows[i] &&
            tableData[j].dueAmount > 0
          ) {
            newArrSelectedRow.push(newSelectedRows[i]);
          }
        }
      }

      // old version code
      // setSelectedRows(newSelectedRows);
      // setSelectAll(true);

      // new version code
      setSelectedRows(newArrSelectedRow);
      setSelectAll(true);
    } else {
      setSelectedRows([]);
      setSelectAll(false);
    }
  };

  const handleClick = (event, feeId) => {
    const selectedIndex = selectedRows.indexOf(feeId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, feeId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    // check if dueAmount is 0 or greater than
    // let newSelectedRow = tableData.filter((item, i) => {
    //   if (item.feeId === newSelected[i] && item.dueAmount > 0) {
    //     console.log('item');
    //     console.log(item);
    //     return item.feeId;
    //   }
    // });
    let newSelectedRow = [];

    for (let i = 0; i < newSelected.length; i++) {
      for (let j = 0; j < tableData.length; j++) {
        if (
          tableData[j].feeId === newSelected[i] &&
          tableData[j].dueAmount > 0
        ) {
          newSelectedRow.push(newSelected[i]);
        }
      }
    }

    // old version code

    // setSelectedRows(newSelected);
    // setSelectAll(newSelected.length === tableData.length);

    // new version code

    setSelectedRows(newSelectedRow);
    setSelectAll(newSelected.length === tableData.length);
  };

  const handleCurrDiscountChange = (feeId, value) => {
    const obj = { ...currDiscount, [feeId]: value };
    const arr = [];

    for (const key in obj) {
      arr.push({ id: parseInt(key), value: obj[key] });
    }

    const singleFeeInfo = leftFeesTableData?.find((item) => {
      return item?.feeId === feeId;
    });

    if (isNaN(value)) {
      for (let key in obj) {
        if (isNaN(obj[key])) {
          delete obj[key];
        }
      }

      setCurrDiscount(obj);
      leftFeesTableColumnData(leftFeesTableColumnDataState, arr);
      return;
    }

    if (parseInt(value) < parseInt(singleFeeInfo?.mainDueAmount)) {
      setCurrDiscount(obj);
      leftFeesTableColumnData(leftFeesTableColumnDataState, arr);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 0.5 }}>
      <Table
        sx={{ minWidth: 650, height: tableData.length === 0 ? 250 : '' }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                indeterminate={
                  selectedRows.length > 0 &&
                  selectedRows.length < tableData.length
                }
                checked={selectAll}
                onChange={handleSelectAllClick}
              />
            </TableCell>
            <TableCell sx={{ textTransform: 'none' }}>Fees Head</TableCell>
            <TableCell sx={{ textTransform: 'none' }} align="right">
              Amount
            </TableCell>
            <TableCell sx={{ textTransform: 'none' }} align="right">
              Late Fee
            </TableCell>
            <TableCell sx={{ textTransform: 'none' }} align="right">
              Prev. Discount
            </TableCell>
            <TableCell sx={{ textTransform: 'none' }} align="right">
              Paid Amount
            </TableCell>

            <TableCell sx={{ textTransform: 'none' }} align="right">
              Curr. Discount
            </TableCell>
            <TableCell sx={{ textTransform: 'none' }} align="right">
              Due
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow
              key={row.title}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedRows.indexOf(row.feeId) !== -1}
                  onChange={(event) => handleClick(event, row.feeId)}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.late_fee}</TableCell>
              <TableCell align="right">{row.discount}</TableCell>
              <TableCell align="right">{row.paidAmount}</TableCell>

              <TableCell>
                <TextFieldWrapper
                  disabled={
                    selectedRows.find((item) => item === row.feeId)
                      ? false
                      : true
                  }
                  label="Amount"
                  name=""
                  type="number"
                  touched={undefined}
                  errors={undefined}
                  // value={currDiscount || ''}
                  value={currDiscount[row.feeId] || ''}
                  handleChange={(e) => {
                    const int_value = parseInt(e.target.value);
                    const value = Math.abs(int_value);
                    handleCurrDiscountChange(row.feeId, value);
                  }}
                  handleBlur={undefined}
                />
              </TableCell>
              <TableCell align="right">{row.dueAmount}</TableCell>
            </TableRow>
          ))}
          {tableData.length === 0 ? (
            ''
          ) : (
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row"></TableCell>
              <TableCell component="th" scope="row">
                {leftFeesTableTotalCalculation && 'Total'}
              </TableCell>
              <TableCell align="right">
                {leftFeesTableTotalCalculation &&
                  leftFeesTableTotalCalculation.amount}
              </TableCell>
              <TableCell align="right">
                {leftFeesTableTotalCalculation &&
                  leftFeesTableTotalCalculation.late_fee}
              </TableCell>
              <TableCell align="right">
                {leftFeesTableTotalCalculation &&
                  leftFeesTableTotalCalculation.discount}
              </TableCell>
              <TableCell align="right">
                {leftFeesTableTotalCalculation &&
                  leftFeesTableTotalCalculation.paidAmount}
              </TableCell>
              <TableCell align="center">
                {leftFeesTableTotalCalculation &&
                  leftFeesTableTotalCalculation.currDiscount}
              </TableCell>

              <TableCell align="right">
                {leftFeesTableTotalCalculation &&
                  leftFeesTableTotalCalculation.dueAmount}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
