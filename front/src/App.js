import Main from "./components/Router/Main";
import Direction from "./components/Router/Direction"
import { Routes, Route, BrowserRouter } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/direction" element={<Direction />} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;
