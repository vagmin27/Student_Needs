import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import CallControls from "./CallControls.jsx";
import CallOverlay from "./CallOverlay.jsx";
import toast from "react-hot-toast";

export const VideoCallModal = ({
  socket,
  conversationId,
  currentUserId,
  callState, // 'incoming', 'calling', 'active', null
  incomingCallData,
  onAccept,
  onClose,
  onSwitchToBrowser,
  meetingLink
}) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Strict call state machine: idle -> incoming -> accepting -> connecting -> connected -> ended
  const [internalCallState, setInternalCallState] = useState("idle");
  const [duration, setDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const timerRef = useRef(null);
  const callTimeoutRef = useRef(null);
  
  const [countdown, setCountdown] = useState(30);
  
  // Singletons to prevent re-initialization loops
  const peerConnectionRef = useRef(null);
  const streamRef = useRef(null);
  const pendingCandidates = useRef([]);
  const pendingOfferRef = useRef(null);
  const acceptingRef = useRef(false);
  const offerHandledRef = useRef(false);
  const answerSentRef = useRef(false);
  const callInitialized = useRef(false);
  const cleanupInProgress = useRef(false);

  const STUN_SERVERS = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:127.0.0.1:3478" } // allow localhost strictly
    ],
  };

  // Sync internal machine with parent prop safely
  useEffect(() => {
    if (callState === "incoming" && (internalCallState === "idle" || internalCallState === "ended")) {
      setInternalCallState("incoming");
      cleanupInProgress.current = false; // Reset cleanup lock
    } else if (callState === "calling" && (internalCallState === "idle" || internalCallState === "ended")) {
      setInternalCallState("connecting");
      cleanupInProgress.current = false; // Reset cleanup lock
      if (!callInitialized.current) {
        initCall(true); // Initiator
      }
    } else if (callState === "active" && internalCallState === "accepting") {
      setInternalCallState("connecting");
    } else if (callState === null && internalCallState !== "idle") {
      cleanupCall();
    }
  }, [callState, internalCallState]);

  // Handle local video element binding
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, internalCallState]);

  // Handle remote video element binding
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, internalCallState]);

  // Core socket event listeners - bound once
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleOffer = async ({ offer }) => {
      console.log("[SOCKET] Received offer");
      if (offerHandledRef.current) {
        console.log("[CALL] Offer already processed. Ignoring duplicate.");
        return;
      }
      
      if (!acceptingRef.current) {
        console.log("[CALL] Queuing offer until Accept is clicked");
        pendingOfferRef.current = offer;
        return;
      }

      await processOffer(offer);
    };

    const processOffer = async (offer) => {
      offerHandledRef.current = true;
      try {
        if (!peerConnectionRef.current) {
          console.log("[PEER] Initializing peer for incoming offer");
          await initPeerConnection();
        }

        const state = peerConnectionRef.current.signalingState;
        if (state === "closed") {
          console.warn("[PEER] Peer closed. Rejecting offer.");
          return;
        }

        console.log(`[PEER] Setting remote description (offer). State: ${state}`);
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        
        console.log(`[ICE] Flushing ${pendingCandidates.current.length} queued candidates`);
        for (const candidate of pendingCandidates.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidates.current = [];

        if (answerSentRef.current) {
          console.log("[CALL] Answer already sent. Skipping creation.");
          return;
        }

        console.log("[PEER] Creating answer");
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        answerSentRef.current = true;
        console.log("[SOCKET] Emitting answer");
        socket.emit("call:answer", { conversationId, answer });
      } catch (e) {
        console.error("[ERROR] Handling offer failed:", e);
      }
    };

    // Attach processOffer to ref so handleAccept can use it
    pendingOfferRef.processOffer = processOffer;

    const handleAnswer = async ({ answer }) => {
      console.log("[SOCKET] Received answer");
      try {
        if (!peerConnectionRef.current || peerConnectionRef.current.signalingState === "closed") {
          console.warn("[PEER] Ignoring answer: peer closed or undefined");
          return;
        }
        
        console.log("[PEER] Setting remote description (answer)");
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        
        console.log(`[ICE] Flushing ${pendingCandidates.current.length} queued candidates`);
        for (const candidate of pendingCandidates.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
        pendingCandidates.current = [];

      } catch (e) {
        console.error("[ERROR] Handling answer failed:", e);
      }
    };

    const handleIceCandidate = async ({ candidate }) => {
      console.log("[SOCKET] Received ICE candidate");
      try {
        if (!peerConnectionRef.current || !peerConnectionRef.current.remoteDescription) {
          console.log("[ICE] Queueing candidate (remote description missing)");
          pendingCandidates.current.push(candidate);
          return;
        }

        if (peerConnectionRef.current.signalingState !== "closed") {
          console.log("[ICE] Adding ICE candidate");
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (e) {
        console.error("[ERROR] Handling ICE candidate failed:", e);
      }
    };

    const handleCallEnded = () => {
      console.log("[CALL] Call ended by socket event");
      toast("Call ended.");
      cleanupCall();
      onClose();
    };

    const handleMissed = () => {
      console.log("[CALL] Call missed");
      toast("Tutor unavailable. Call ended.");
      cleanupCall();
      onClose();
    };

    const handleTimeout = () => {
      console.log("[CALL] Call timeout");
      toast("Missed call");
      cleanupCall();
      onClose();
    };

    socket.on("call:offer", handleOffer);
    socket.on("call:answer", handleAnswer);
    socket.on("call:ice_candidate", handleIceCandidate);
    socket.on("call:end", handleCallEnded);
    socket.on("call:disconnected", handleCallEnded); 
    socket.on("call:missed", handleMissed);
    socket.on("call:timeout", handleTimeout);

    return () => {
      socket.off("call:offer", handleOffer);
      socket.off("call:answer", handleAnswer);
      socket.off("call:ice_candidate", handleIceCandidate);
      socket.off("call:end", handleCallEnded);
      socket.off("call:disconnected", handleCallEnded);
      socket.off("call:missed", handleMissed);
      socket.off("call:timeout", handleTimeout);
    };
  }, [socket, conversationId, onClose]);

  const startTimer = () => {
    setDuration(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  };

  const initCall = async (isInitiator) => {
    if (callInitialized.current) {
      console.log("[INIT_COUNT] Blocked duplicate initCall");
      return;
    }
    callInitialized.current = true;
    console.log(`[CALL] initCall, initiator: ${isInitiator}`);
    
    await initLocalStream();
    await initPeerConnection();
    
    if (isInitiator) {
      try {
        console.log("[PEER] Creating offer");
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        console.log("[SOCKET] Emitting offer");
        socket.emit("call:offer", { conversationId, offer });

        // Start 30 sec caller timeout
        setCountdown(30);
        if (callTimeoutRef.current) clearInterval(callTimeoutRef.current);
        callTimeoutRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(callTimeoutRef.current);
              toast("No answer");
              socket.emit("call:end", { conversationId });
              cleanupCall();
              onClose();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (e) {
        console.error("[ERROR] Creating offer failed:", e);
      }
    }
  };

  const initLocalStream = async () => {
    if (streamRef.current) {
      console.log("[PEER] Stream already exists. Reusing.");
      return streamRef.current;
    }
    try {
      const type = incomingCallData?.type || "video";
      console.log(`[CALL] Getting user media for type: ${type}`);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === "video",
        audio: true,
      });
      streamRef.current = stream;
      setLocalStream(stream);
      setIsVideoMuted(type !== "video");
      return stream;
    } catch (error) {
      console.error("[ERROR] Media devices access denied:", error);
      toast.error("Could not access camera/microphone.");
      cleanupCall();
      if (meetingLink) {
        onSwitchToBrowser();
      } else {
        onClose();
      }
      return null;
    }
  };

  const initPeerConnection = async () => {
    if (peerConnectionRef.current) {
      console.log("[PEER_EXISTS] RTCPeerConnection already created. Reusing.");
      return;
    }
    
    console.log("[PEER] Initializing RTCPeerConnection");
    peerConnectionRef.current = new RTCPeerConnection(STUN_SERVERS);
    pendingCandidates.current = [];

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("[ICE] Generated local candidate, emitting");
        socket.emit("call:ice_candidate", {
          conversationId,
          candidate: event.candidate,
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      console.log("[PEER] Received remote track");
      setRemoteStream(event.streams[0]);
    };

    peerConnectionRef.current.onconnectionstatechange = () => {
      const state = peerConnectionRef.current?.connectionState;
      console.log(`[CALL_STATE] Connection state changed: ${state}`);
      if (state === "connected") {
        setInternalCallState("connected");
        if (callTimeoutRef.current) {
          clearInterval(callTimeoutRef.current);
          callTimeoutRef.current = null;
        }
        startTimer();
      } else if (state === "failed" || state === "disconnected" || state === "closed") {
        if (timerRef.current) clearInterval(timerRef.current);
        if (callTimeoutRef.current) clearInterval(callTimeoutRef.current);
      }
    };

    // Attach local stream immediately if it exists
    if (streamRef.current) {
      console.log("[PEER] Adding local tracks to peer");
      streamRef.current.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, streamRef.current);
      });
    }
  };

  const cleanupCall = useCallback(() => {
    if (cleanupInProgress.current) return;
    cleanupInProgress.current = true;
    console.log("[CALL] Executing cleanupCall()");
    
    setInternalCallState("ended");
    acceptingRef.current = false;
    offerHandledRef.current = false;
    answerSentRef.current = false;
    callInitialized.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (callTimeoutRef.current) {
      clearInterval(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
    
    if (streamRef.current) {
      console.log("[CALL] Stopping local tracks");
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    
    if (peerConnectionRef.current) {
      console.log("[PEER] Closing RTCPeerConnection");
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    pendingCandidates.current = [];
    setLocalStream(null);
    setRemoteStream(null);
    
    cleanupInProgress.current = false;
  }, []);

  // Guarantee cleanup on unmount
  useEffect(() => {
    return () => cleanupCall();
  }, [cleanupCall]);

  const handleLeaveCall = () => {
    console.log("[CALL] Leaving call manually");
    socket.emit("call:end", { conversationId });
    cleanupCall();
    onClose();
  };

  const handleDecline = () => {
    console.log("[CALL] Declining call");
    socket.emit("call:declined", { conversationId });
    cleanupCall();
    onClose();
  };

  const handleAccept = async () => {
    if (acceptingRef.current) {
      console.log("[CALL] Ignore duplicate accept");
      return;
    }
    acceptingRef.current = true;
    console.log("[CALL] Accepting call");
    
    setInternalCallState("accepting");
    if (onAccept) onAccept(); // Tell parent to hide incoming UI and set callState to active
    
    socket.emit("call:accepted", { conversationId });
    
    // Proactively initialize call constraints so peer exists before offer arrives
    if (!callInitialized.current) {
      await initCall(false);
    }
    
    // If an offer arrived before we clicked accept, process it now
    if (pendingOfferRef.current && pendingOfferRef.processOffer) {
      console.log("[CALL] Processing queued offer");
      await pendingOfferRef.processOffer(pendingOfferRef.current);
      pendingOfferRef.current = null;
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoMuted(!videoTrack.enabled);
      }
    }
  };

  const toggleSpeaker = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
      setIsSpeakerMuted(remoteVideoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (internalCallState === "idle" || internalCallState === "ended") return null;

  // Render Incoming Call Popup
  if (internalCallState === "incoming") {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-background/60 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4 text-2xl font-bold text-primary animate-pulse">
            {incomingCallData?.callerInfo?.name?.[0] || "U"}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Incoming {incomingCallData?.type || "Video"} Call</h2>
          <p className="text-muted-foreground mb-8">{incomingCallData?.callerInfo?.name || "Someone"} is calling you...</p>
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleDecline}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-[var(--radius-md)] font-medium transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={acceptingRef.current}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-[var(--radius-md)] font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Accept
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Render Active Call (connecting, connected, accepting)
  return createPortal(
    <div className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center ${isFullscreen ? "p-0" : "p-4 md:p-8"}`}>
      <div className={`relative w-full h-full max-w-6xl mx-auto rounded-[var(--radius-xl)] overflow-hidden bg-slate-950 shadow-[var(--shadow-lg)] border border-slate-800 flex items-center justify-center`}>
        
        {/* Remote Video (Main) */}
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center mb-4 animate-pulse">
              <span className="text-3xl text-slate-700">👤</span>
            </div>
            <p>
              {internalCallState === "connecting" || internalCallState === "accepting" 
                ? (internalCallState === "connecting" ? `Calling... 00:${countdown.toString().padStart(2, '0')}` : "Connecting...") 
                : "Waiting for other user..."}
            </p>
          </div>
        )}

        {/* Local Video (PIP) */}
        <div className={`absolute top-6 right-6 w-32 md:w-48 aspect-[3/4] md:aspect-video bg-slate-900 rounded-[var(--radius-lg)] overflow-hidden border-2 border-slate-700/50 shadow-[var(--shadow-lg)] transition-all z-10 ${isVideoMuted ? "flex items-center justify-center" : ""}`}>
          {isVideoMuted ? (
            <span className="text-muted-foreground text-sm">Camera Off</span>
          ) : (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          )}
        </div>

        <CallOverlay 
          connectionState={internalCallState}
          duration={duration}
          onSwitchToBrowser={() => {
            cleanupCall();
            onSwitchToBrowser();
          }}
        />

        <CallControls
          isAudioMuted={isAudioMuted}
          isVideoMuted={isVideoMuted}
          isSpeakerMuted={isSpeakerMuted}
          isFullscreen={isFullscreen}
          callType={incomingCallData?.type || "video"}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onToggleSpeaker={toggleSpeaker}
          onToggleFullscreen={toggleFullscreen}
          onLeaveCall={handleLeaveCall}
        />
      </div>
    </div>,
    document.body
  );
};

export default VideoCallModal;
