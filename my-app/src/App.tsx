import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import Table from "./components/MainTable";
import Header from "./components/Header";
import Tab from "./components/Tab";

function App() {
  return (
    <div className="App">
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      {/* <Header /> */}
      <Tab />
      <Table />
    </div>
  );
}

export default App;
