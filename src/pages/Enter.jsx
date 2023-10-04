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
  console.log("Room Code from URL:", roomCodeFromURL);
  console.log("id", id);
  console.log("phone", phoneFromURL);
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
    // fetchData(); // Initial API call
  }, [roomCodeFromURL]); // Only run once on component
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
            phoneNo: `+${phone}`,
            roomId: `${roomCodeFromURL}`,
          },
        };

        // Make a POST request to send the "Incoming Call" notification
        const incomingCallResponse = await axios.post(
          "https://fcm.googleapis.com/fcm/send",
          incomingCallPayload,
          {
            headers: {
              Authorization:
                "key=AAAAjOGkb6k:APA91bEE9QdPorav9k-vgR61kKY21iNXoB4ZC_X-SAuLSG8p61shpYRWClG1AHa6UQfocCpin2uUSM9nA-iQyFwRIKWcqdxeaA8AYzwa4LGEkB-XG6JYkSU7Tlxa3VrqkAxZC4IcVemE",
            },
          }
        );

        console.log(incomingCallResponse.data);

        // Schedule a "Missed Call" notification after 15 seconds
        setTimeout(async () => {
          // Construct the data payload for the "Missed Call" notification
          const missedCallPayload = {
            to: `${token}`,
            notification: {
              title: "Missed Call",
              body: `Missed call from +${phone}`,
            },
            data: {
              type: "missedCall",
              phoneNo: `+${phone}`,
              roomId: `${roomCodeFromURL}`,
            },
          };
          // Make a POST request to send the "Missed Call" notification
          const missedCallResponse = await axios.post(
            "https://fcm.googleapis.com/fcm/send",
            missedCallPayload,
            {
              headers: {
                Authorization:
                  "key=AAAAjOGkb6k:APA91bEE9QdPorav9k-vgR61kKY21iNXoB4ZC_X-SAuLSG8p61shpYRWClG1AHa6UQfocCpin2uUSM9nA-iQyFwRIKWcqdxeaA8AYzwa4LGEkB-XG6JYkSU7Tlxa3VrqkAxZC4IcVemE",
              },
            }
          );

          console.log(missedCallResponse.data);
        }, 60000);
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
