import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Input from "@mui/material/Input";
import "./MainTable.scss";
import { styled } from "@mui/material/styles";

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein };
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const MAX_DATE = 31;

// const getRows = () => {
//   const rows = [...Array(MAX_DATE)].map((_, idx) => {
//     return { date: idx + 1, withdraw: 1000, depo: 2000, balance: 200, adb: 300 };
//   });
//   console.log(rows);
//   return rows;
// };
const formatNumber = (num: number) => {
  return num.toFixed(2);
};

const commonInputProps: Partial<TextFieldProps> = { size: "small", variant: "outlined" };

const ROOT = "adb-table";

interface Row {
  withdraw: number;
  depo: number;
  balance: number;
  adb: number;
}

type State = Array<Row>;

const MainTable = () => {
  const initialRows = [...Array(MAX_DATE)].map((_, idx) => {
    return { withdraw: 0, depo: 0, balance: 0, adb: 0 };
  });

  const [rows, setRows] = useState<State>(initialRows);
  const [initialBalance, setInitialBalance] = useState<number>(0);

  const handleChangeWithDr = (value: string, index: number) => {
    const val = Number(value);
    setRows((prevRows) => {
      const rows = [] as State;
      let total = 0;
      prevRows.forEach((row, idx) => {
        if (idx < index) {
          total += row.balance;
          rows.push(row);
        } else {
          const prevBalance = rows[idx - 1]?.balance ?? initialBalance;
          const isCurrentRow = idx === index;
          const newWithdraw = isCurrentRow ? val : row.withdraw;
          const newDepo = row.depo;
          const newBalance = prevBalance - newWithdraw + newDepo;
          total += newBalance;
          const newAdb = total / (idx + 1);
          rows.push({ withdraw: newWithdraw, depo: newDepo, balance: newBalance, adb: newAdb });
        }
      });
      console.log(rows);
      return rows;
    });
  };

  const handleChangeDepo = (value: string, index: number) => {
    const val = Number(value);
    setRows((prevRows) => {
      const rows = [] as State;
      let total = 0;
      prevRows.forEach((row, idx) => {
        if (idx < index) {
          total += row.balance;
          rows.push(row);
        } else {
          const prevBalance = rows[idx - 1]?.balance ?? initialBalance;
          const isCurrentRow = idx === index;
          const newDepo = isCurrentRow ? val : row.depo;
          const newWithdraw = row.withdraw;
          const newBalance = prevBalance - newWithdraw + newDepo;
          total += newBalance;
          const newAdb = total / (idx + 1);
          rows.push({ withdraw: newWithdraw, depo: newDepo, balance: newBalance, adb: newAdb });
        }
      });
      console.log(rows);
      return rows;
    });
  };

  const handleChangeInitialBalance = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setInitialBalance(val);

    setRows((prevRows) => {
      const rows = [] as State;
      let total = 0;
      prevRows.forEach((row, idx) => {
        const prevBalance = rows[idx - 1]?.balance ?? val;
        const newBalance = prevBalance - row.withdraw + row.depo;
        total += newBalance;
        const newAdb = total / (idx + 1);
        rows.push({ withdraw: row.withdraw, depo: row.depo, balance: newBalance, adb: newAdb });
      });
      console.log(rows);
      return rows;
    });
  };

  return (
    <div className={ROOT}>
      <div className={`${ROOT}-title`}>Average Daily Balance (ADB) Calculator</div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Value Date</StyledTableCell>
              <StyledTableCell align="right">Withdrawal</StyledTableCell>
              <StyledTableCell align="right">Deposit</StyledTableCell>
              <StyledTableCell align="right">Balance as of the day</StyledTableCell>
              <StyledTableCell align="right">ADB as of the day</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <StyledTableCell component="th" scope="row">
                  <div className={`${ROOT}-day-col`}>
                    <div className={`${ROOT}-day`}>
                      <div>Day</div> <div className={`${ROOT}-day-num`}>{index + 1}</div>
                    </div>
                    {index === 0 && <TextField {...commonInputProps} id="standard-basic" label="Initial Balance" onBlur={handleChangeInitialBalance} />}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    {...commonInputProps}
                    id="withdr"
                    variant="outlined"
                    type="number"
                    onChange={(e) => {
                      handleChangeWithDr(e.target.value, index);
                    }}
                    InputProps={{
                      inputProps: { style: { textAlign: "right" } }, // Aligns the input text to the right
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  <TextField
                    {...commonInputProps}
                    id="depo"
                    variant="outlined"
                    type="number"
                    onChange={(e) => {
                      handleChangeDepo(e.target.value, index);
                    }}
                    InputProps={{
                      inputProps: { style: { textAlign: "right" } }, // Aligns the input text to the right
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">{formatNumber(row.balance)}</StyledTableCell>
                <StyledTableCell align="right">{formatNumber(row.adb)}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MainTable;
