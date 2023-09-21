
import "./App.css";
import { Route, Routes } from "react-router-dom";
// import Room from "./pages/Room";
import Home from "./pages/Enter";
import AppRoom from "./pages/AgoraPage";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/room" element={<AppRoom/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
