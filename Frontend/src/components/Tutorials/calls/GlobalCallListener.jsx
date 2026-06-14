import React, { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket.js";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import VideoCallModal from "./VideoCallModal.jsx";
import toast from "react-hot-toast";

export const GlobalCallListener = () => {
  const { isConnected, socket } = useSocket();
  const { user } = useAuth();
  
  const [callState, setCallState] = useState(null); // 'incoming', 'active', null
  const [incomingCallData, setIncomingCallData] = useState(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleIncomingCall = (data) => {
      console.log("[CALL RECEIVED] frontend");
      console.log("[RECEIVER GOT CALL]");
      if (!callState) {
        setIncomingCallData(data);
        setCallState("incoming");
      }
    };
    
    const handleCallAccepted = () => {
      setCallState("active");
    };

    const handleCallDeclined = () => {
      setCallState(null);
      setIncomingCallData(null);
    };

    const handleCallEnd = () => {
      setCallState(null);
      setIncomingCallData(null);
    };

    socket.on("call:incoming", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("call:declined", handleCallDeclined);
    socket.on("call:end", handleCallEnd);

    return () => {
      socket.off("call:incoming", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("call:declined", handleCallDeclined);
      socket.off("call:end", handleCallEnd);
    };
  }, [socket, isConnected, callState]);

  if (!callState && !incomingCallData) return null;

  return (
    <VideoCallModal 
      socket={socket}
      conversationId={incomingCallData?.conversationId}
      currentUserId={user?.id || user?._id}
      callState={callState}
      incomingCallData={incomingCallData}
      onAccept={() => setCallState("active")}
      onClose={() => {
        setCallState(null);
        setIncomingCallData(null);
      }}
      onSwitchToBrowser={() => {
        window.open(`/tutorials/live/${incomingCallData?.conversationId}`, '_blank');
      }}
    />
  );
};

export default GlobalCallListener;
