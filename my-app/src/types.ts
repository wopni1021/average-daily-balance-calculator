import { Dayjs } from 'dayjs';

export interface Row {
  withdraw: number;
  depo: number;
  balance: number;
  adb: number;
  day: number;
}

export type Rows = Array<Row>;

export type InitialDate = Dayjs | null;
