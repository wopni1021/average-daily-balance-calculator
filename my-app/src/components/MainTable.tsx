import React, { useState, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {
  tableCellClasses,
  TableCellProps,
} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { useMediaQuery } from '@mui/material';
import TableRow, { TableRowProps } from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import './MainTable.scss';
import { styled } from '@mui/material/styles';
import HelpIcon from '@mui/icons-material/Help';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Tooltip from '@mui/material/Tooltip';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CalculationPanel from './CalculationPanel';
import { Rows, InitialDate, Row } from '../types';

// types
interface FixedWidthTableCellProps extends TableCellProps {
  fixedWidth?: number; // Optional custom prop for fixed width
}

interface StyledRow extends TableRowProps {
  day?: number;
}

// styling
const StyledTableCell = styled(TableCell)<FixedWidthTableCellProps>(
  ({ theme, fixedWidth }) => ({
    width: fixedWidth ? `${fixedWidth}px` : 'auto',
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.action.hover,
      color: '#333',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
    '&:first-child': {
      '&:first-of-type': {
        paddingLeft: theme.spacing(4), // Left padding for the first cell of each row
        paddingRight: 0,
      },
    },
    '&:last-child': {
      '&:last-of-type': {
        paddingRight: theme.spacing(4), // Right padding for the last cell of each row
        paddingLeft: 0,
      },
    },
  })
);

const StyledTableRow = styled(TableRow)<StyledRow>(({ theme, day }) => ({
  backgroundColor: day && day % 2 === 0 ? theme.palette.action.hover : 'white',
  'td, th': {
    border: 0,
  },
}));

// consts
const MAX_NUM = 1000000000;
const VALUE_DATE_WIDTH = 160;

const ROOT = 'adb-table';

const commonInputProps: Partial<TextFieldProps> = {
  size: 'small',
  variant: 'outlined',
};

/*
 * Round down to 2 decimals
 */
const formatNumber = (num: number) => {
  return Math.floor(num * 100) / 100;
};

/*
 * Check if the number string is less than 2 decimal places
 */
const isValidDecimal = (value: string) => {
  return /^\d*\.?\d{0,2}$/.test(value);
};

const MainTable = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const firstDateOfCurrMonth = dayjs().date(1);
  const numOfDay = dayjs().daysInMonth();
  const initialRows = [...Array(numOfDay)].map((_, idx) => {
    return {
      withdraw: 0,
      depo: 0,
      balance: 0,
      adb: 0,
      day: idx + 1,
      subDay: 1,
    };
  });

  const [rows, setRows] = useState<Rows>(initialRows);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [initialDate, setInitialDate] =
    useState<InitialDate>(firstDateOfCurrMonth);

  const handleChangeWithDr = useCallback(
    (value: string, index: number) => {
      const val = Number(value);
      if (val > MAX_NUM || !isValidDecimal(value)) return;
      setRows((prevRows) => {
        const rows = [] as Rows;
        let total = 0;
        prevRows.forEach((row, idx) => {
          const isLastSubRow = row.day !== prevRows[idx + 1]?.day; // only the final balance of the day should be calculated towards adb

          if (idx < index) {
            if (isLastSubRow) total += row.balance;
            rows.push(row);
          } else {
            const prevBalance = rows[idx - 1]?.balance ?? initialBalance;
            const isCurrentRow = idx === index;
            const newWithdraw = isCurrentRow ? val : row.withdraw;
            const newDepo = row.depo;
            const newBalance = prevBalance - newWithdraw + newDepo;
            if (isLastSubRow) total += newBalance;
            const newAdb = total / row.day;
            rows.push({
              withdraw: newWithdraw,
              depo: newDepo,
              balance: newBalance,
              adb: newAdb,
              day: row.day,
            });
          }
        });
        return rows;
      });
    },
    [initialBalance]
  );

  const handleChangeDepo = useCallback(
    (value: string, index: number) => {
      const val = Number(value);
      if (val > MAX_NUM || !isValidDecimal(value)) return;
      setRows((prevRows) => {
        const rows = [] as Rows;
        let total = 0;
        prevRows.forEach((row, idx) => {
          const isLastSubRow = row.day !== prevRows[idx + 1]?.day; // only the final balance of the day should be calculated towards adb

          if (idx < index) {
            if (isLastSubRow) total += row.balance;
            rows.push(row);
          } else {
            const prevBalance = rows[idx - 1]?.balance ?? initialBalance;
            const isCurrentRow = idx === index;
            const newDepo = isCurrentRow ? val : row.depo;
            const newWithdraw = row.withdraw;
            const newBalance = prevBalance - newWithdraw + newDepo;
            if (isLastSubRow) total += newBalance;
            const newAdb = total / row.day;
            rows.push({
              withdraw: newWithdraw,
              depo: newDepo,
              balance: newBalance,
              adb: newAdb,
              day: row.day,
            });
          }
        });
        return rows;
      });
    },
    [initialBalance]
  );

  const handleChangeInitialBalance = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setInitialBalance(val);

      setRows((prevRows) => {
        const rows = [] as Rows;
        let total = 0;
        prevRows.forEach((row, idx) => {
          const prevBalance = rows[idx - 1]?.balance ?? val;
          const newBalance = prevBalance - row.withdraw + row.depo;
          const isLastSubRow = row.day !== prevRows[idx + 1]?.day; // only the final balance of the day should be calculated towards adb
          if (isLastSubRow) total += newBalance;
          const newAdb = total / row.day;
          rows.push({
            withdraw: row.withdraw,
            depo: row.depo,
            balance: newBalance,
            adb: newAdb,
            day: row.day,
          });
        });
        return rows;
      });
    },
    []
  );

  const handleChangeInitDate = useCallback(
    (value: InitialDate) => {
      const numOfDay = dayjs(value).daysInMonth();
      const originalNumOfDay = rows.filter(
        (row, idx) => row.day !== rows[idx - 1]?.day
      ).length;
      setInitialDate(value);

      if (numOfDay > originalNumOfDay) {
        const prevLastRow = rows[rows.length - 1];
        const prevLastBalance = prevLastRow.balance;
        setRows((prevRows) => {
          const dayDiff = numOfDay - originalNumOfDay;
          const addedRows = [...Array(dayDiff)].map((_, idx) => {
            const newDay = originalNumOfDay + idx + 1;
            const newAdb =
              (prevLastRow.adb * originalNumOfDay +
                prevLastBalance * (idx + 1)) /
              newDay;
            return {
              withdraw: 0,
              depo: 0,
              balance: prevLastBalance,
              adb: newAdb,
              day: newDay,
              subDay: 1,
            };
          });
          const newRows = [...prevRows, ...addedRows];
          return newRows;
        });
      } else if (numOfDay < originalNumOfDay) {
        setRows((prevRows) => {
          const newRows = prevRows.filter((row) => row.day <= numOfDay);
          return newRows;
        });
      }
    },
    [rows]
  );

  const onClickAddTransaction = (index: number) => {
    setRows((prevRows) => {
      const parentRow = prevRows[index];
      const childRow = { ...parentRow, withdraw: 0, depo: 0 };
      const newState = [
        ...prevRows.slice(0, index + 1),
        childRow,
        ...prevRows.slice(index + 1),
      ];
      return newState;
    });
  };

  const renderRows = () => {
    const renderDay = (row: Row, index: number) => {
      const isMainDay = row.day !== rows[index - 1]?.day;
      if (isMobile) {
        return (
          isMainDay && (
            <div className={`${ROOT}-value-date-mobile`}>
              {initialDate?.isValid() && (
                <span className={`${ROOT}-value-date-mobile-date`}>
                  {initialDate
                    .add(row.day - 1, 'day')
                    .toDate()
                    .toLocaleDateString()}
                </span>
              )}
              {renderAddIcon(row, index)}
            </div>
          )
        );
      }
      return (
        isMainDay && (
          <div className={`${ROOT}-value-date`}>
            <div className={`${ROOT}-value-date-day`}>
              <div>Day</div>{' '}
              <div className={`${ROOT}-value-date-day-num`}>{row.day}</div>
            </div>
            {initialDate?.isValid() && (
              <span className={`${ROOT}-value-date-date`}>
                {initialDate
                  .add(row.day - 1, 'day')
                  .toDate()
                  .toLocaleDateString()}
              </span>
            )}
          </div>
        )
      );
    };

    const renderWidthdrawInput = (row: Row, index: number) => {
      return (
        <TextField
          {...commonInputProps}
          id="withdr"
          variant="outlined"
          type="number"
          label={isMobile ? 'Withdrawal' : ''}
          onChange={(e) => {
            handleChangeWithDr(e.target.value, index);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">- $</InputAdornment>
              ),
              inputProps: { style: { textAlign: 'right' } },
            },
          }}
          value={row.withdraw || ''}
        />
      );
    };

    const renderDepositInput = (row: Row, index: number) => {
      return (
        <TextField
          {...commonInputProps}
          id="depo"
          variant="outlined"
          type="number"
          label={isMobile ? 'Deposit' : ''}
          onChange={(e) => {
            handleChangeDepo(e.target.value, index);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">+ $</InputAdornment>
              ),
              inputProps: { style: { textAlign: 'right' } },
            },
          }}
          value={row.depo || ''}
          className={`${ROOT}-deposit`}
        />
      );
    };

    const renderAddIcon = (_row: Row, index: number) => {
      return (
        <Tooltip
          className={`${ROOT}-tooltip`}
          title="Add more transaction to the day"
          slotProps={{
            tooltip: {
              sx: {
                fontSize: '16px',
                padding: '8px',
              },
            },
          }}
        >
          <IconButton
            onClick={() => {
              onClickAddTransaction(index);
            }}
            size="small"
            sx={{ ml: 2 }}
            aria-haspopup="false"
            className={`${ROOT}-add-item`}
          >
            <AddCircleOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
      );
    };

    if (isMobile) {
      const allRows = rows.map((row, index) => (
        <div className={`${ROOT}-card`}>
          <div className={`${ROOT}-row-header`}>{renderDay(row, index)}</div>
          <div>
            {renderWidthdrawInput(row, index)}
            {renderDepositInput(row, index)}
          </div>
          {row.day !== rows[index + 1]?.day && (
            <>
              <div className={`${ROOT}-value`}>
                <div className={`${ROOT}-value-field`}>
                  <div className={`${ROOT}-value-label`}>Balance </div>
                  {row.day !== rows[index + 1]?.day &&
                    formatNumber(row.balance)}
                </div>

                <div className={`${ROOT}-value-field`}>
                  <div className={`${ROOT}-value-label`}>
                    Average Daily Balance{' '}
                  </div>
                  {formatNumber(row.adb)}
                </div>
              </div>
              {index !== rows.length - 1 && (
                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                    width: '85%',
                  }}
                />
              )}
            </>
          )}
        </div>
      ));

      return allRows;
    }

    // if PC
    const allRows = rows.map((row, index) => (
      <StyledTableRow
        key={`${row.day}-${index}`}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        day={row.day}
      >
        <StyledTableCell
          component="th"
          scope="row"
          fixedWidth={VALUE_DATE_WIDTH}
        >
          {renderDay(row, index)}
        </StyledTableCell>
        <StyledTableCell align="right">
          {renderWidthdrawInput(row, index)}
        </StyledTableCell>
        <StyledTableCell align="right">
          {renderDepositInput(row, index)}
        </StyledTableCell>
        <StyledTableCell align="right">
          {row.day !== rows[index + 1]?.day && formatNumber(row.balance)}
        </StyledTableCell>
        <StyledTableCell align="right">
          {row.day !== rows[index + 1]?.day && formatNumber(row.adb)}
        </StyledTableCell>
        <StyledTableCell align="right">
          {row.day !== rows[index + 1]?.day && renderAddIcon(row, index)}
        </StyledTableCell>
      </StyledTableRow>
    ));
    return allRows;
  };

  // const dateSelector = (
  //   <DatePicker onChange={handleChangeInitDate} value={initialDate} />
  // );
  // TODO: add date selector and allow user specify the number of days to calculate

  const monthSelector = (
    <DatePicker
      views={['year', 'month']}
      value={initialDate}
      onChange={handleChangeInitDate}
      minDate={dayjs('2020-01-01')} // You can set min/max dates if needed
      maxDate={dayjs().add(5, 'year')}
      format="MMMM YYYY" // Display format for the selected month
    />
  );

  const table = (
    <div className={ROOT}>
      <div className={`${ROOT}-init`}>
        <div className={`${ROOT}-init-balance`}>
          <div className={`${ROOT}-init-balance-label`}>
            <div className={`${ROOT}-init-label`}>Initial Balance</div>
            {!isMobile && (
              <Tooltip
                className={`${ROOT}-tooltip`}
                title="The closing balance in the statement of previous month"
                slotProps={{
                  tooltip: {
                    sx: {
                      fontSize: '16px',
                      padding: '8px',
                    },
                  },
                }}
              >
                <HelpIcon />
              </Tooltip>
            )}
          </div>
          <TextField
            {...commonInputProps}
            id="standard-basic"
            onBlur={handleChangeInitialBalance}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                inputProps: { style: { textAlign: 'right' } },
              },
            }}
            type="number"
          />
        </div>

        <div className={`${ROOT}-init-day`}>
          <div className={`${ROOT}-init-label`}>Month</div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {monthSelector}
          </LocalizationProvider>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="simple table" stickyHeader>
          {!isMobile && (
            <TableHead>
              <StyledTableRow>
                <StyledTableCell fixedWidth={VALUE_DATE_WIDTH}>
                  Value Date
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div className={`${ROOT}-th`}>
                    <span>Withdrawal</span>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div className={`${ROOT}-th`}>
                    <span>Deposit</span>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">Balance</StyledTableCell>
                <StyledTableCell align="right">
                  <div className={`${ROOT}-th`}>
                    <div>Average Daily Balance</div>
                    <Tooltip
                      className={`${ROOT}-tooltip`}
                      title="Do take notes of the number of days in a month to predict the ADB accurately. For example, if you want to calculate the final ADB in April, you should refer to Day 30 or April 30th"
                      slotProps={{
                        tooltip: {
                          sx: {
                            fontSize: '16px',
                            padding: '8px',
                          },
                        },
                      }}
                    >
                      <HelpIcon />
                    </Tooltip>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right" />
              </StyledTableRow>
            </TableHead>
          )}

          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  const infoPanel = <CalculationPanel rows={rows} initialDate={initialDate} />;

  return (
    <>
      {table}
      {infoPanel}
    </>
  );
};

export default MainTable;
