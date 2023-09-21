import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk";
import axios from "axios";

const AppRoom = () => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Loading...");
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  useEffect(() => {
    // Initialize Agora SDK outside the main component
    AgoraRTC.init({ appId: "71b80a81ce4244f0b1185ac5cdbc0e3f" });

    // Create a local stream and start streaming
    const localStream = AgoraRTC.createStream({
      audio: true,
      video: true,
    });

    const fetchData = () => {
      axios
        .get(`https://stealth-zys3.onrender.com/api/v1/video/call?roomName=Aks`)
        .then((res) => {
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

    fetchData(); // Initial API call

    localStream.init(() => {
      localStream.play("local-video"); // 'local-video' is the ID of the local video container
      setLocalStream(localStream);

      // Join a channel (replace 'CHANNEL_NAME' with your channel name)
      AgoraRTC.client.join(null, "Aks", null, (uid) => {
        // Publish the local stream to the channel
        AgoraRTC.client.publish(localStream);

        // Listen for remote stream added events
        AgoraRTC.client.on("stream-added", (evt) => {
          const remoteStream = evt.stream;
          setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);

          // Subscribe to the remote stream
          AgoraRTC.client.subscribe(remoteStream);
        });

        // Listen for remote stream removed events
        AgoraRTC.client.on("stream-removed", (evt) => {
          const remoteStream = evt.stream;
          setRemoteStreams((prevStreams) =>
            prevStreams.filter(
              (stream) => stream.getId() !== remoteStream.getId()
            )
          );
        });
      });
    });

    // Cleanup when the component unmounts
    return () => {
      if (localStream) {
        localStream.close();
      }
      AgoraRTC.client.leave();
    };
  }, []);

  return (
    <div>
      {loading ? (
        <p>{message}</p>
      ) : isAccepted ? (
        <div id="local-video">
          {remoteStreams.map((stream) => (
            <div key={stream.getId()} id={`remote-video-${stream.getId()}`} />
          ))}
        </div>
      ) : (
        <p>Waiting for call acceptance...</p>
      )}
    </div>
  );
};

export default AppRoom;
