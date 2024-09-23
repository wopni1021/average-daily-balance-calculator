import React, { useState } from 'react';
import Card from '@mui/material/Card';
import './CalculationPanel.scss';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import dayjs, { Dayjs } from 'dayjs';
import { Rows, InitialDate } from '../types';

type Props = {
  data: Rows;
  initialDate: InitialDate;
};

const ROOT = 'adb-calculation-panel';
const ROOT_FORM = `${ROOT}-form`;

const CalculationPanel = (props: Props) => {
  const today = dayjs();
  const [balance, setBalance] = useState(0);
  const [transferDate, setTransferDate] = useState<Dayjs | null>(today);
  const [conditions, setConditions] = useState({
    balance: null,
    transferDate: null,
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
      >
        Calculate
      </Button>
    </div>
  );

  const renderSummary = () => {
    return (
      <Alert severity="info" className={`${ROOT}-summary`}>
        You need to Deposit $10000 on xxx to maintain Average Daily Balance of
        $3000 for selected month
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
