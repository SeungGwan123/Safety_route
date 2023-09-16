import Main from "./components/Router/Main";
import Kakao from "./components/Router/Kakao";
import Naver from "./components/Router/Naver";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
      <Routes>
        <Route path="/kakao" element={<Kakao />} />
      </Routes>
      <Routes>
        <Route path="/naver" element={<Naver />} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;
