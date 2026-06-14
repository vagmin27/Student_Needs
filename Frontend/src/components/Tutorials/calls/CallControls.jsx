import React from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

export const CallControls = ({
  isAudioMuted,
  isVideoMuted,
  isSpeakerMuted,
  isFullscreen,
  onToggleAudio,
  onToggleVideo,
  onToggleSpeaker,
  onToggleFullscreen,
  onLeaveCall,
  callType,
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-[var(--radius-lg)] border border-slate-700/50 shadow-[var(--shadow-lg)] z-50">
      <button
        onClick={onToggleAudio}
        className={`p-3 rounded-[var(--radius-md)] transition-all ${
          isAudioMuted ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
        }`}
        title={isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
      >
        {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      {callType === "video" && (
        <button
          onClick={onToggleVideo}
          className={`p-3 rounded-[var(--radius-md)] transition-all ${
            isVideoMuted ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          }`}
          title={isVideoMuted ? "Turn on Camera" : "Turn off Camera"}
        >
          {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>
      )}

      <button
        onClick={onToggleSpeaker}
        className={`p-3 rounded-[var(--radius-md)] transition-all ${
          isSpeakerMuted ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
        }`}
        title={isSpeakerMuted ? "Unmute Speaker" : "Mute Speaker"}
      >
        {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {callType === "video" && (
        <button
          onClick={onToggleFullscreen}
          className="p-3 rounded-[var(--radius-md)] bg-slate-800 text-muted-foreground hover:bg-slate-700 transition-all hidden md:block"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      )}

      <div className="w-px h-8 bg-slate-700/50 mx-2"></div>

      <button
        onClick={onLeaveCall}
        className="p-3 rounded-[var(--radius-md)] bg-red-600 text-white hover:bg-red-700 shadow-[var(--shadow-lg)] shadow-red-600/20 transition-all"
        title="Leave Call"
      >
        <PhoneOff className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CallControls;
