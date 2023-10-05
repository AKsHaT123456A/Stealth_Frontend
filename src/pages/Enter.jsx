import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [open, setOpen] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(true); // State for phone number validation
  const queryParams = queryString.parse(location.search);
  const roomCodeFromURL = queryParams.roomCode;
  const phoneFromURL = queryParams.phone;
  const id = queryParams.id;
  const phoneRegex = /^[6-9]{10}$/; // Regex pattern for a 10-digit phone number

  const setData = () => {
    axios
      .get(
        `https://stealth-zys3.onrender.com/api/v1/video/getCallDetails?phone=${phoneFromURL}&id=${id}&roomName=${roomCodeFromURL}`
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching call details:", error.message);
      });

    axios
      .get(
        `https://stealth-zys3.onrender.com/api/v1/video/call?roomName=${roomCodeFromURL}&id=${id}&phone=${phoneFromURL}`
      )
      .then((res) => {
        console.log(open);
        console.log(res.data);
        setToken(res.data.token);
        setOpen(res.data.isOpen);
      })
      .catch((error) => {
        console.log("Error fetching data:", error.message);
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    setData();
  }, [roomCodeFromURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if the phone number is valid before making the API call
      if (phone.match(phoneRegex)) {
        setIsValidPhone(true);

        axios
          .get(
            `https://stealth-zys3.onrender.com/api/v1/video/call?roomName=${roomCodeFromURL}&id=${id}&phone=${phone}`
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((error) => {
            console.log("Error fetching data:", error.message);
            console.error("Error fetching data:", error);
          });

        // Rest of your code for notifications and navigation
      } else {
        // Invalid phone number, set isValidPhone to false
        setIsValidPhone(false);
      }
    } catch (error) {
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
          className={`input-field ${isValidPhone ? "" : "invalid-phone"}`} 
          onChange={(e) => setPhone(e.target.value)}
        />
        {!isValidPhone && (
          <p className="error-message">Please enter a valid 10-digit phone number.</p>
        )}
        <button type="submit" className="submit-button">
          Enter Shop
        </button>
      </form>
      <p className="additional-text">
        Your video and mic will be by default off while entering the shop. Enjoy
        Shopping!!.
      </p>
    </div>
  );
};

export default Home;
