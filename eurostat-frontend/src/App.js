import React from 'react';
import './App.css';
import ExpenditureChart from './components/ExpenditureChart';
import ExpenditureBarChart from './components/ExpenditureBarChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Research and Development Expenditure</h1>
      </header>
      <ExpenditureChart />
      <ExpenditureBarChart />
    </div>
  );
}

export default App;
