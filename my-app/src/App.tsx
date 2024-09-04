import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Table from "./components/MainTable";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <Header />
      <Table />
    </div>
  );
}

export default App;
