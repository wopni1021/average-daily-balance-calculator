import React from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeIcon from "@mui/icons-material/Home";
import "./Tab.scss";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import RateReviewIcon from "@mui/icons-material/RateReview";

const ROOT = "adb-tab";

export default function IconTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={`${ROOT}`}>
      <Tabs value={value} onChange={handleChange} aria-label="icon tabs example" orientation="vertical">
        <Tab icon={<HomeIcon />} aria-label="phone" />
        <Tab icon={<HelpCenterIcon />} aria-label="favorite" />
        <Tab icon={<RateReviewIcon />} aria-label="person" />
      </Tabs>
    </div>
  );
}
