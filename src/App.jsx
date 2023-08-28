
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/Room";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/room/:roomId" element={<Room/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
