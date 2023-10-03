import "./App.css";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import Home from "./pages/Enter";
import Navbar from "./components/Navbar/Navbar";
import FeedbackForm from "./pages/feedBack";

function App() {
  return (
    <>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId/:phone/:id" element={<Room />} />
          <Route path="/feedback/:roomName/:phone/" element={<FeedbackForm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
