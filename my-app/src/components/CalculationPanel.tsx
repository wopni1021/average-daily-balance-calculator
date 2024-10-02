import React, { useState } from 'react';
import Card from '@mui/material/Card';
import './CalculationPanel.scss';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import dayjs, { Dayjs } from 'dayjs';
import { Rows, InitialDate } from '../types';

type Props = {
  rows: Rows;
  initialDate: InitialDate;
};

const ROOT = 'adb-calculation-panel';
const ROOT_FORM = `${ROOT}-form`;

const CalculationPanel = (props: Props) => {
  const today = dayjs();
  const [balance, setBalance] = useState(0);
  const [transferDate, setTransferDate] = useState<Dayjs | null>(today);
  const [result, setResult] = useState<{
    balance: number | null;
    transferDate: Dayjs | null;
    transferAmount: number | null;
  }>({
    balance: null,
    transferDate: null,
    transferAmount: null,
  });

  const handleChangeBalance = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBalance(val);
  };

  const handleChangeTransferDate = (value: Dayjs | null) => {
    setTransferDate(value);
  };

  const onClickCalculate = () => {
    if (!balance || !transferDate) return;
    const { rows } = props;
    const numOfDay = transferDate.daysInMonth();
    const newTotalBalance = balance * numOfDay;
    const prevTotalBalance = rows[rows.length - 1].adb * numOfDay;
    const balanceDiff = newTotalBalance - prevTotalBalance;
    const dayIndex = transferDate.date();
    const expectedTransfer = balanceDiff / (numOfDay - dayIndex + 1);
    const transferAmount = Math.ceil(expectedTransfer * 100) / 100; // round up result
    setResult({ balance, transferDate, transferAmount });
  };

  const startOfMonth = props.initialDate?.startOf('month');
  const endOfMonth = props.initialDate?.endOf('month');

  const shouldDisableDate = (date: Dayjs) => {
    // Disable dates that are outside of the current month of referenceDate
    return date.isBefore(startOfMonth) || date.isAfter(endOfMonth);
  };

  const form = (
    <div className={ROOT_FORM}>
      <div className={`${ROOT_FORM}-balance`}>
        <div className={`${ROOT_FORM}-label`}>
          Min. Average Daily Balance to Maintain
        </div>
        <TextField
          size="small"
          variant="outlined"
          id="standard-basic"
          onBlur={handleChangeBalance}
          //   value={balance || ''}
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

      <div className={`${ROOT_FORM}-day`}>
        <div className={`${ROOT_FORM}-label`}>Date to Transfer In/Out</div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={handleChangeTransferDate}
            value={transferDate}
            shouldDisableDate={shouldDisableDate}
          />
        </LocalizationProvider>
      </div>
      <Button
        variant="outlined"
        className={`${ROOT_FORM}-button`}
        onClick={onClickCalculate}
        disabled={!balance || !transferDate}
      >
        Calculate
      </Button>
    </div>
  );

  const renderSummary = () => {
    const { transferAmount, transferDate, balance } = result;
    const preactionText =
      transferAmount && transferAmount > 0 ? ' need to ' : ' can ';
    const actionText =
      transferAmount && transferAmount > 0 ? 'Deposit' : 'Withdraw';
    const displayDate = transferDate?.format('MMMM DD');
    const displayTransferAmount =
      transferAmount &&
      new Intl.NumberFormat().format(Math.abs(transferAmount));
    const displayBalance = balance && new Intl.NumberFormat().format(balance);

    if (transferAmount === 0) {
      return (
        <Alert severity="info" className={`${ROOT}-summary`}>
          Everything Perfect! You don't need to make any changes and it will
          still satisfy min. average balance as specified.
        </Alert>
      );
    }
    if (!transferAmount) return null;

    return (
      <Alert severity="info" className={`${ROOT}-summary`}>
        <>
          You{preactionText}
          <span className={`${ROOT}-summary-action`}> {actionText} </span>
          another
          <span className={`${ROOT}-summary-amount`}>
            {' '}
            ${displayTransferAmount}{' '}
          </span>
          on
          <span className={`${ROOT}-summary-date`}> {displayDate} </span> to
          maintain Average Daily Balance of
          <span className={`${ROOT}-summary-balance`}>
            {' '}
            ${displayBalance}
          </span>{' '}
          for selected month
        </>
      </Alert>
    );
  };

  return (
    <Card sx={{ minWidth: 275 }} className={ROOT}>
      {form}
      {renderSummary()}
    </Card>
  );
};

export default CalculationPanel;
