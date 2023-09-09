import React from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
const Home = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const queryParams = queryString.parse(location.search);
    const roomCodeFromURL = queryParams.roomCode;
    console.log(roomCodeFromURL);
    e.preventDefault();
    navigate(`/room`);
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
