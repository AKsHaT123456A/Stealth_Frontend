
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import Home from "./pages/Enter";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <>
    <Navbar/>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/room/:roomId/:phone" element={<Room/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
