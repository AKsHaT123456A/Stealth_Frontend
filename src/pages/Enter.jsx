import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = React.useState("");
  const [token, setToken] = React.useState("");
  const queryParams = queryString.parse(location.search);
  const roomCodeFromURL = queryParams.roomCode;
  console.log("Room Code from URL:", roomCodeFromURL);
  const fetchData = () => {
    axios
      .get(`https://stealth-zys3.onrender.com/api/v1/video/call?roomName=${roomCodeFromURL}`)
      .then((res) => {
        console.log(res.data);
        setToken(res.data.token);
        console.log("Token:", token);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData(); // Initial API call
  }, []); // Only run once on component mount

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // Define the headers for the HTTP request
      const headers = {
        Authorization:
          "key=AAAAjOGkb6k:APA91bEE9QdPorav9k-vgR61kKY21iNXoB4ZC_X-SAuLSG8p61shpYRWClG1AHa6UQfocCpin2uUSM9nA-iQyFwRIKWcqdxeaA8AYzwa4LGEkB-XG6JYkSU7Tlxa3VrqkAxZC4IcVemE",
      };

      // Construct the data payload
      const dataPayload = {
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


      // Make a POST request to the FCM API with the specified headers and data payload
      const response = await axios.post(
        "https://fcm.googleapis.com/fcm/send",
        dataPayload, // Provide the data payload
        {
          headers,
        }
      );
      console.log(response.data);
      const requestData = {
        phone,
        roomName: roomCodeFromURL,
      };
      
      axios
        .get(`http://localhost:3000/api/v1/video/getCallDetails?phone=${phone}&roomName=${roomCodeFromURL}`, {
          data: requestData, // Send the data in the request body
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.error("Error fetching call details:", error);
        });
      

      // Parse query parameters from the location search
      
      // Log the room code from the URL
      console.log("Room Code from URL:", roomCodeFromURL);

      // Navigate to the "/room" route
      navigate(`/room`);
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error sending FCM message:", error);
    }
  };

  return (
    <div className="home">
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Enter Room</button>
      </form>
    </div>
  );
};

export default Home;
