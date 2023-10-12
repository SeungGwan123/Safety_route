import Main from "./components/Router/Main";
import Direction from "./components/Router/Direction"
import CCTV from "./components/Router/CCTV";
import Register from "./components/Router/Register"
import Login from "./components/Router/Login"
import { Routes, Route, BrowserRouter } from "react-router-dom";


function App() {
  return (
    
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/direction" element={<Direction />} />
        <Route path="/cctv" element={<CCTV />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      
    </BrowserRouter> 
    
  );
}

export default App;
