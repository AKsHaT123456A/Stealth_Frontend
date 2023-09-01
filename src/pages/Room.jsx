import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";

const Room = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Loading.....");
  const { roomId } = useParams();
  const username = roomId;

  const meetElementRef = useRef(null);

  const fetchData = () => {
    axios
      .get(
        "https://stealth-zys3.onrender.com/api/v1/video/call?roomName=Abcdef"
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.isAccepted) {
          setIsAccepted(true);
          setLoading(false);
          setMessage("Call Accepted");
        } else if (res.data.isRejected) {
          setIsRejected(true);
          setMessage("Call Rejected");
        } else {
          // If neither isAccepted nor isRejected is true, call the API again
          setTimeout(fetchData, 1000); // Wait for 1 second before making the next request (optional)
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle the error here, and you may want to retry the request as well
        // setTimeout(fetchData, 1000); // Retry after 1 second (optional)
      });
  };

  useEffect(() => {
    fetchData(); // Initial API call
  }, []);

  useEffect(() => {
    if (!loading && meetElementRef.current) {
      const appId = 1903949555;
      const serverSecret = "24bced055e2cc9835f8d16411299bc18";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomId,
        Date.now().toString(),
        username
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: meetElementRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
      });
    }
  }, [loading, roomId, username]);

  return (
    <div className="room">
      {loading ? <p>{message}</p> : <div ref={meetElementRef} />}
    </div>
  );
};

export default Room;
