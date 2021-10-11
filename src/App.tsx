import React from "react";
import Top from "./components/Top";

function App() {
  return (
    <div className="App">
      <Top uri={(window as any).uri || (window as any).location.href} />
    </div>
  );
}

export default App;
