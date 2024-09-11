import React, { useState } from "react";
import "./App.scss";
import Table from "./components/MainTable";
import Tab from "./components/Tab";
import Feedback from "./components/Feedback";
import Header from "./components/Header";
const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderPage = () => {
    switch (selectedTab) {
      case 0:
        return <Table />;
      case 1:
        return null;
      case 2:
        return <Feedback />;
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
};

export default App;
