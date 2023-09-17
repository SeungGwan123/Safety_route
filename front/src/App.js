import Main from "./components/Router/Main";
import Naver from "./components/Router/Naver"
import Kakao from "./components/Router/Kakao"
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="naver" element={<Naver />} />
        <Route path="/kakao" element={<Kakao />} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;
