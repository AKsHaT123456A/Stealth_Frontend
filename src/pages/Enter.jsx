import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = React.useState("");
  const [name, setName] = useState("");
  const [token, setToken] = React.useState("");
  const [open, setOpen] = React.useState("");
  const queryParams = queryString.parse(location.search);
  const roomCodeFromURL = queryParams.roomCode;
  const phoneFromURL = queryParams.phone;
  const id = queryParams.id;
  const setData = () => {
    axios
      .get(
        `https://stealth-zys3.onrender.com/api/v1/video/getCallDetails?phone=${phoneFromURL}&id=${id}&roomName=${roomCodeFromURL}`
      )
      axios
      .get(
        `https://stealth-zys3.onrender.com/api/v1/video/call?roomName=${roomCodeFromURL}&id=${id}&phone=${phoneFromURL}`
      )
      .then((res) => {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        setOpen(res.data.isOpen);
      })
      .catch((error) => {
        console.log("Error fetching data:", error.message);
      });
  };

  useEffect(() => {
    setData();
    // fetchData(); // Initial API call
  }, [roomCodeFromURL]); // Only run once on component
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios
        .get(
          `https://stealth-zys3.onrender.com/api/v1/video/call?roomName=${roomCodeFromURL}&id=${id}&phone=${phone}`
        )
      // Construct the data payload for the "Incoming Call" notification
      if (open) {
        const incomingCallPayload = {
          to: `${token}`,
          notification: {
            title: "Incoming Call",
            body: `Incoming call from +${phone}`,
          },
          data: {
            type: "incomingCall",
            phoneNo: `${phone}`,
            roomId: `${roomCodeFromURL}`,
          },
        };

        // Make a POST request to send the "Incoming Call" notification
        await axios.post(
          "https://fcm.googleapis.com/fcm/send",
          incomingCallPayload,
          {
            headers: {
              Authorization:
                "key=AAAAjOGkb6k:APA91bEE9QdPorav9k-vgR61kKY21iNXoB4ZC_X-SAuLSG8p61shpYRWClG1AHa6UQfocCpin2uUSM9nA-iQyFwRIKWcqdxeaA8AYzwa4LGEkB-XG6JYkSU7Tlxa3VrqkAxZC4IcVemE",
            },
          }
        );

      }
      // Navigate to the "/room" route
      navigate(`/room/${roomCodeFromURL}/${phone}/${id}`);
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error sending FCM message:", error);
    }
  };

  return (
    <div className="home-container">
      <p className="additional-text">
        Please fill in your details for LIVE 1-1 call.
      </p>
      <form className="home-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          className="input-field"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          className="input-field"
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit" className="submit-button">
          Enter Shop
        </button>
      </form>
      <p className="additional-text">
        Your video and mic will be by default off while entering the shop.Enjoy
        Shopping!!.
      </p>
    </div>
  );
};

export default Home;
