import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";

import "../App.css"; // Import the CSS file for styling

const Room = () => {
  const navigate = useNavigate();
  const { roomId, phone, id } = useParams();
  const username = roomId;

  const [isRejected, setIsRejected] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(
    "Loading... We have informed the store and assistance will be available for you shortly"
  );

  const meetElementRef = useRef(null);
  const fetchData = () => {
    let hasStopped = false; // Flag to track whether the API call has stopped
    const stopFetchingData = () => {
      if (!hasStopped && !isAccepted && !isRejected) {
        setMessage(
          " Currently shop is closed. Try again between 10:00 am and 6:00pm"
        );
        setLoading(true);
        hasStopped = true; // Set the flag to true to prevent further API calls
      }
    };

    // Set a timeout to stop fetching data after 5 seconds
    const timeoutId = setTimeout(stopFetchingData, 30000);
    if (!hasStopped) {
      axios
        .get(
          `https://stealth-zys3.onrender.com/api/v1/video/call?roomName=${username}&id=${id}&phone=${phone}`
        )
        .then((res) => {
          console.log("Data fetched!", roomId);
          console.log(res.data);
          if (!res.data.isOpen) {
            setMessage("Store is closed. Please try again later");
          } else if (res.data.isAccepted) {
            setIsAccepted(true);
            setLoading(false);
            hasStopped = true;
            clearTimeout(timeoutId); // Clear the timeout to stop further API calls
          } else if (res.data.isRejected) {
            setIsRejected(true);
            setMessage(
              " It seems like shop is experiencing high traffic. Please try again later!!!"
            );
            setLoading(false);
            hasStopped = true;
            clearTimeout(timeoutId); // Clear the timeout to stop further API calls
          } else {
            // Continue fetching data after 5 seconds
            setTimeout(fetchData, 5000);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
          setMessage("Error fetching data");
          clearTimeout(timeoutId); // Clear the timeout in case of an error
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        onLeaveRoom: (reason, users) => {
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
  }, [loading, meetElementRef, username, id]);

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
