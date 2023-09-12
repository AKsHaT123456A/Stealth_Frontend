import React from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = React.useState("");

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
        to: "dEmxmFYvSv6x_MdOYa8mlb:APA91bHOZZl8NQoTpAY4Rlo_LgFvQxochosCyvGgVmlj4BpKUG_uNkKh11lrBFb9FAuQ6PuMw4ct4omzPdMh-l1spwjSpHRIyfYeBkJOtyh-8QCZuAXljIEDAUwRCT-NwI0T9SDSc0l9",
        notification: {
          title: "Incoming Call",
          body: `Incoming call from +${phone}`, 
        },
        data: {
          type: "incomingCall",
          phoneNo: `+${phone}`, 
          roomId: "Aks", 
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

      // Handle the response as needed
      console.log("FCM API response:", response.data);

      // Parse query parameters from the location search
      const queryParams = queryString.parse(location.search);
      const roomCodeFromURL = queryParams.roomCode;

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
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button type="submit">Enter Room</button>
      </form>
    </div>
  );
};

export default Home;
