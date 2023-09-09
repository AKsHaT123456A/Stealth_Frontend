import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";

const Room = () => {
  const { roomId } = useParams();
  const username = roomId;

  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [loading, setLoading] = useState(true); // Set to true initially
  const [message, setMessage] = useState("Loading.....");

  const meetElementRef = useRef(null);

  const fetchData = () => {
     axios
      .get(`https://stealth-zys3.onrender.com/api/v1/video/call?roomName=Aks`)
      .then((res) => {
        console.log("Data fetched!", roomId);
        console.log(res.data);
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
      });
  };

  useEffect(() => {
    fetchData(); // Initial API call
  }, []); // Only run once on component mount

  useEffect(() => {
    if (!loading && meetElementRef.current) {
      const appId = 1237771667;
      const serverSecret = "917f2a73f3158849df22df79057a14b1";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        "Aks",
        Date.now().toString(),
        "username" // Use the 'username' variable
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: meetElementRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
      });
    }
  }, [loading, meetElementRef, username]); // Depend on 'meetElementRef' and 'username'

  return (
    <div className="room">
      {loading ? <p>{message}</p> : <div ref={meetElementRef} />}
    </div>
  );
};

export default Room;
