import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate(`/room/11112`);
  };
  return (
    <div className="home">
      <form className="form" onSubmit={handleSubmit}>
        <button type="submit">Enter Room</button>
      </form>
    </div>
  );
};

export default Home;