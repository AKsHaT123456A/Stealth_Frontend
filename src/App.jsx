
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import Home from "./pages/home";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/room/:roomId" element={<Room/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
