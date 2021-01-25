import React from 'react';
// import logo from './logo.svg';
// import './App.css';

import Top from './components/material-ui/Top'

// bs4 版はメンテナンスしていません。
//import Top from './components/bs4/Top'
//import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Top uri={(window as any).uri || (window as any).location.href } />
    </div>
  );
}

export default App;
