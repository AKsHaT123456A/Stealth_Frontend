import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";

import "../App.css"; // Import the CSS file for styling

const Room = () => {
  const navigate = useNavigate();
  const { roomId, phone } = useParams();
  const username = roomId;

  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Loading...");
  const [callDuration, setCallDuration] = useState(0);
  const [userList, setUserList] = useState([]); // State to store the list of users

  const meetElementRef = useRef(null);

  const fetchData = () => {
    axios
      .get(
        `https://stealth-zys3.onrender.com/api/v1/video/call?roomName=${username}`
      )
      .then((res) => {
        console.log("Data fetched!", roomId);
        console.log(res.data);
        setToken(res.data.token);
        if (res.data.isAccepted) {
          setIsAccepted(true);
          setMessage("Call Accepted");
        } else if (res.data.isRejected) {
          setIsRejected(true);
          setMessage("Call Rejected");
        } else {
          setTimeout(fetchData, 5000);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        setMessage("Error fetching data");
      });
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
          setCallDuration(durationInSeconds);
          axios.get(`http://localhost:3000/api/v1/video/getCallDetails?phone=${phone}&roomName=${username}&duration=${durationInSeconds}`)
          // Update the user list when a user leaves the room
          setUserList(users || []);

          // Display the leaving screen with the user count
          const leavingScreen = document.createElement("div");
          leavingScreen.innerHTML = `
  <div class="leaving-screen">
    <p class="leaving-message">User left the room.</p>
    <p class="duration-message">Call Duration: ${durationInSeconds} seconds</p>
    <button class="return-button" onClick={() => navigate("/")}>Return to Previous Page</button>
    </div>
`;

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
  }, [loading, meetElementRef, username, phone]);

  return (
    <div className="room" style={{ height: "30rem" }}>
      {loading ? (
        <p>{message}</p>
      ) : (
        <div ref={meetElementRef} style={{ height: "80vh" }} />
      )}
      <p className="call-duration">Call Duration: {callDuration} seconds</p>
    </div>
  );
};

export default Room;
