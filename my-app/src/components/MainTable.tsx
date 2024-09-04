import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein };
}

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData("Eclair", 262, 16.0, 24, 6.0),
//   createData("Cupcake", 305, 3.7, 67, 4.3),
//   createData("Gingerbread", 356, 16.0, 49, 3.9),
// ];

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
    <TableContainer component={Paper} className={ROOT}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Value Date</TableCell>
            <TableCell align="right">Withdrawal</TableCell>
            <TableCell align="right">Deposit</TableCell>
            <TableCell align="right">Balance as of the day</TableCell>
            <TableCell align="right">ADB as of the day</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                Day {index + 1}
                {index === 0 && <TextField id="standard-basic" label="Initial Balance" variant="standard" onBlur={handleChangeInitialBalance} />}
              </TableCell>
              <TableCell align="right">
                <TextField
                  id="withdr"
                  label="Outlined"
                  variant="outlined"
                  type="number"
                  onChange={(e) => {
                    handleChangeWithDr(e.target.value, index);
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  id="depo"
                  label="Outlined"
                  variant="outlined"
                  type="number"
                  onChange={(e) => {
                    handleChangeDepo(e.target.value, index);
                  }}
                />
              </TableCell>
              <TableCell align="right">{formatNumber(row.balance)}</TableCell>
              <TableCell align="right">{formatNumber(row.adb)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MainTable;
