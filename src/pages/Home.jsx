import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomCode, setRoomCode] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .get(`http://localhost:3000/api/v1/video/create-room?roomName=${roomCode}`,)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
      navigate(`/room/${roomCode}`);
  };
  return (
    <div className="home">
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label>Enter Room Code</label>
          <input
            type="text"
            value={roomCode}
            required
            placeholder={`${roomCode}`}
            onChange={(e) => setRoomCode(e.target.value)}
          />
        </div>
        <button type="submit">Enter Room</button>
      </form>
    </div>
  );
};

export default Home;
