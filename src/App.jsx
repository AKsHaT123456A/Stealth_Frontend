
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import Home from "./pages/Enter";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/room" element={<Room/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
