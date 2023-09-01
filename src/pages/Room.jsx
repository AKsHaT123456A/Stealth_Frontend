import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";

const Room = () => {
  const [isAccepted, setisAccepted] = useState(false);
  const [isRejected, setisRejected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Loading...");
  const { roomId } = useParams();
  const username = roomId;

  const meetElementRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/video/call?roomName=Abcdef").then((res) => {
      console.log(res.data);
      if (res.data.isAccepted) {
        setisAccepted(true);
        setLoading(false);
        setMessage("Call Accepted");
      } else if (res.data.isRejected) {
        setisRejected(true);
        setMessage("Call Rejected");
      }
    });
  }, [isAccepted, isRejected]);

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
