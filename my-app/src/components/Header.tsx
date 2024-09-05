import React from "react";

import "./Header.scss";

const ROOT = "adb-header";

const hintHeader = "How To Use";
const hintMsg = "Input initial balance as of the 1st day, then add any transactions happening. You will be able to get average daily balance (ADB).";
const hintPoints =
  "- Initial balance should be the final balance as in the statement of previous month \n - Do take notes of the number of days in a month to predict the ADB accurately. For example, if you want to calculate the final ADB in April, you should refer to Day 30";
const Header = () => {
  return (
    <div className={ROOT}>
      <div>{hintHeader}</div>
      <div>{hintMsg}</div>
      <div>{hintPoints}</div>
    </div>
  );
};

export default Header;
