import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses, TableCellProps } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Input from "@mui/material/Input";
import "./MainTable.scss";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import Tooltip from "@mui/material/Tooltip";

interface Row {
  withdraw: number;
  depo: number;
  balance: number;
  adb: number;
}

interface FixedWidthTableCellProps extends TableCellProps {
  fixedWidth?: number; // Optional custom prop for fixed width
}

type State = Array<Row>;

const StyledTableCell = styled(TableCell)<FixedWidthTableCellProps>(({ theme, fixedWidth }) => ({
  width: fixedWidth ? `${fixedWidth}px` : "atuo",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const VALUE_DATE_WIDTH = 160;

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
const MAX_NUM = 1000000000;

const formatNumber = (num: number) => {
  return num.toFixed(2);
};

const commonInputProps: Partial<TextFieldProps> = { size: "small", variant: "outlined" };

const ROOT = "adb-table";

const MainTable = () => {
  const initialRows = [...Array(MAX_DATE)].map((_, idx) => {
    return { withdraw: 0, depo: 0, balance: 0, adb: 0 };
  });

  const [rows, setRows] = useState<State>(initialRows);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [initialDate, setInitialDate] = useState<Dayjs | null>(null);

  const handleChangeWithDr = (value: string, index: number) => {
    const val = Number(value);
    if (val > MAX_NUM) return;
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
      return rows;
    });
  };

  const handleChangeDepo = (value: string, index: number) => {
    const val = Number(value);
    if (val > MAX_NUM) return;
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
      return rows;
    });
  };

  const handleChangeInitDate = (value: Dayjs | null) => {
    setInitialDate(value);
  };

  return (
    <div className={ROOT}>
      <div className={`${ROOT}-title`}>Average Daily Balance (ADB) Calculator</div>

      <div className={`${ROOT}-init`}>
        <div className={`${ROOT}-init-balance`}>
          <div className={`${ROOT}-init-balance-label`}>
            <div className={`${ROOT}-init-label`}>Initial Balance</div>
            <Tooltip
              className={`${ROOT}-tooltip`}
              title="The closing balance in the statement of previous month"
              slotProps={{
                tooltip: {
                  sx: {
                    fontSize: "16px", // Customize the font size
                    padding: "8px",
                  },
                },
              }}
            >
              <HelpIcon />
            </Tooltip>
          </div>
          <TextField
            {...commonInputProps}
            id="standard-basic"
            onBlur={handleChangeInitialBalance}
            InputProps={{
              inputProps: { style: { textAlign: "right" } },
            }}
            type="number"
          />
        </div>

        <div className={`${ROOT}-init-day`}>
          <div className={`${ROOT}-init-label`}>First Day to start with (Optional)</div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker onChange={handleChangeInitDate} value={initialDate} />
          </LocalizationProvider>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell fixedWidth={VALUE_DATE_WIDTH}>Value Date</StyledTableCell>
              <StyledTableCell align="right">
                <div className={`${ROOT}-th`}>
                  <RemoveIcon />
                  <span>Withdrawal</span>
                </div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <div className={`${ROOT}-th`}>
                  <AddIcon />
                  <span>Deposit</span>
                </div>
              </StyledTableCell>
              <StyledTableCell align="right">Balance as of the day</StyledTableCell>
              <StyledTableCell align="right">
                <div className={`${ROOT}-th`}>
                  <div>ADB as of the day</div>
                  <Tooltip
                    className={`${ROOT}-tooltip`}
                    title="Do take notes of the number of days in a month to predict the ADB accurately. For example, if you want to calculate the final ADB in April, you should refer to Day 30 or April 30th"
                    slotProps={{
                      tooltip: {
                        sx: {
                          fontSize: "16px", // Customize the font size
                          padding: "8px",
                        },
                      },
                    }}
                  >
                    <HelpIcon />
                  </Tooltip>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <StyledTableCell component="th" scope="row" fixedWidth={VALUE_DATE_WIDTH}>
                  <div className={`${ROOT}-value-date`}>
                    <div className={`${ROOT}-value-date-day`}>
                      <div>Day</div> <div className={`${ROOT}-value-date-day-num`}>{index + 1}</div>
                    </div>
                    {initialDate?.isValid() && <span className={`${ROOT}-value-date-date`}>{initialDate.add(index, "day").toDate().toLocaleDateString()}</span>}
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
                      inputProps: { style: { textAlign: "right" } },
                    }}
                    value={row.withdraw || ""}
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
                    value={row.depo || ""}
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
