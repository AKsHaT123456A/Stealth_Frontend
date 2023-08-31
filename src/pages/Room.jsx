import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const Room = () => {
  const { roomId } = useParams();
const username = roomId;
  const a=0;
  const meet = async (element) => {
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
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };

  return (
    <div className="room">
      <div ref={meet} />
    </div>
  );
};

export default Room;
