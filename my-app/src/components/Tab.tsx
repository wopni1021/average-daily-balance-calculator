import React from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HomeIcon from "@mui/icons-material/Home";
import "./Tab.scss";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import RateReviewIcon from "@mui/icons-material/RateReview";

const ROOT = "adb-tab";

type Props = {
  selectedTab: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
};
// TODO: Display page based on selected tab
const IconTabs = (props: Props) => {
  return (
    <div className={`${ROOT}`}>
      <Tabs value={props.selectedTab} onChange={props.handleChange} aria-label="icon tabs example" orientation="vertical">
        <Tab icon={<HomeIcon />} aria-label="phone" />
        <Tab icon={<HelpCenterIcon />} aria-label="favorite" />
        <Tab icon={<RateReviewIcon />} aria-label="person" />
      </Tabs>
    </div>
  );
};

export default IconTabs;
