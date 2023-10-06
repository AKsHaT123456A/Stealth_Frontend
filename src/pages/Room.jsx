import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";

import "../App.css"; // Import the CSS file for styling

const Room = () => {
  const navigate = useNavigate();
  const { roomId, phone, id } = useParams();
  const username = roomId;
  const token = localStorage.getItem("token");
  const [isRejected, setIsRejected] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    "Loading... We have informed the store, and assistance will be available for you shortly"
  );

  const meetElementRef = useRef(null);

  useEffect(() => {
    // localStorage.setItem("isMissedOnce", false);
    let timeoutId; // Timer ID for the 1-minute delay
    let isMissed = localStorage.getItem("isMissed"); // Flag to track whether the call was missed
    const stopFetchingData = async () => {
      localStorage.setItem("isMissed", true);
      if (isMissed) {
        setMessage(
          "It seems like the shop is experiencing high traffic. Please try again later!!!"
        );
        setLoading(true);
        // const missedCallPayload = {
        //   to: `${token}`,
        //   notification: {
        //     title: "Missed Call",
        //     body: `Missed call from +${phone}`,
        //   },
        //   data: {
        //     type: "missedCall",
        //     phoneNo: `${phone}`,
        //     roomId: `${roomId}`,
        //   },
        // };
        // // Make a POST request to send the "Missed Call" notification
        // await axios
        //   .post("https://fcm.googleapis.com/fcm/send", missedCallPayload, {
        //     headers: {
        //       Authorization:
        //         "key=AAAAjOGkb6k:APA91bEE9QdPorav9k-vgR61kKY21iNXoB4ZC_X-SAuLSG8p61shpYRWClG1AHa6UQfocCpin2uUSM9nA-iQyFwRIKWcqdxeaA8AYzwa4LGEkB-XG6JYkSU7Tlxa3VrqkAxZC4IcVemE",
        //     },
        //   })
        //   .then(() => {
        //     localStorage.setItem("isMissedOnce", true);
        //     console.log(isMissed);
        //   });
      }
    };
    // Set a timer to call stopFetchingData after 30 second if isAccepted and isRejected are still false
    const startStopTimer = () => {
      timeoutId = setTimeout(stopFetchingData, 30000); // 30 second delay
    };

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://stealth-zys3.onrender.com/api/v1/video/call?roomName=${username}&id=${id}&phone=${phone}`
        );
        console.log("Data fetched!", roomId);
        console.log(res.data);
        if (!res.data.isOpen) {
          setMessage(
            "Currently, the shop is closed. Try again between 10:00 am and 6:00 pm"
          );
        } else if (res.data.isAccepted) {
          localStorage.setItem("isMissed", false);
          setIsAccepted(true);
          setLoading(false);
          clearTimeout(timeoutId); // Clear the timer
        } else if (res.data.isRejected) {
          localStorage.setItem("isMissed", false);
          setIsRejected(true);
          console.log("HI");
          setMessage(
            "It seems like the shop is experiencing high traffic. Please try again later!!!"
          );
          setLoading(false);
          clearTimeout(timeoutId); // Clear the timer
        } else {
          // Continue fetching data after 5 seconds
          setTimeout(fetchData, 5000);
          startStopTimer(); // Start the timer after the initial call
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setMessage("Error fetching data");
        clearTimeout(timeoutId); // Clear the timer in case of an error
      }
    };

    fetchData(); // Call the initial data fetching function
  }, [username, id, phone, roomId, token]);

  useEffect(() => {
    if (!loading && meetElementRef.current) {
      const appId = 1237771667;
      const serverSecret = "917f2a73f3158849df22df79057a14b1";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        username,
        Date.now().toString(),
        phone
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      let callStartTime = Date.now();

      zp.joinRoom({
        container: meetElementRef.current,
        onLeaveRoom: () => {
          const callEndTime = Date.now();
          const durationInSeconds = Math.floor(
            (callEndTime - callStartTime) / 1000
          );
          axios
            .get(
              `https://stealth-zys3.onrender.com/api/v1/video/getCallDetails?phone=${phone}&roomName=${username}&duration=${durationInSeconds}&id=${id}`
            )
            .then((res) => {
              console.log(res.data);
            });
          // Display the leaving screen with the user count
          const leavingScreen = document.createElement("div");
          leavingScreen.innerHTML = `
            <div class="leaving-screen">
            <p class="leaving-message">User left the room.</p>
            <p class="duration-message">Call Duration: ${durationInSeconds} seconds</p>
            <p>Hope you enjoyed the experience</p>
        </div>

  `;
          navigate(`/feedback/${username}/${id}`);

          meetElementRef.current.innerHTML = "";
          meetElementRef.current.appendChild(leavingScreen);
        },
        showPreJoinView: false,
        preJoinViewConfig: {
          title: "Live Shop",
        },
        turnOnMicrophoneWhenJoining: false,
        turnOnCameraWhenJoining: false,
        maxUsers: 2,
        showScreenSharingButton: false,
        showRoomTimer: true,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        videoResolutionList: [
          ZegoUIKitPrebuilt.VideoResolution_360P,
          ZegoUIKitPrebuilt.VideoResolution_180P,
          ZegoUIKitPrebuilt.VideoResolution_480P,
          ZegoUIKitPrebuilt.VideoResolution_720P,
        ],
        videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_360P,
      });
    }
  }, [loading, meetElementRef, username, id, phone, navigate]);

  return (
    <div className="room" style={{ height: "30rem" }}>
      {loading ? (
        <p className="loading-message">{message}</p>
      ) : isRejected ? (
        <p className="loading-message">{message}</p>
      ) : (
        <div ref={meetElementRef} style={{ height: "80vh" }} />
      )}
    </div>
  );
};

export default Room;
