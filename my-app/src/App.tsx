import React, { useState } from 'react';
import './App.scss';
import Table from './components/MainTable';
import Tab from './components/Tab';
import Feedback from './components/Feedback';
import Header from './components/Header';

const App = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderPage = () => {
    const mainPage = <Table />;

    switch (selectedTab) {
      case 0:
        return mainPage;
      case 1:
        return <div>How to calculate adb.......</div>;
      case 2:
        return <Feedback />;
      default:
        return mainPage;
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">{renderPage()}</main>
      <Tab handleChange={handleChangeTab} />
    </div>
  );
};

export default App;
