import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import socket from "../socket";
import { getIceServers } from "../webrtc/ice";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaExpand,
  FaCompress,
} from "react-icons/fa";

const forcePlay = (videoEl, label = "video") => {
  if (!videoEl) return;

  videoEl.playsInline = true;
  videoEl.autoplay = true;

  const tryPlay = () => {
    const p = videoEl.play?.();
    if (p && typeof p.catch === "function") {
      p.catch((e) => console.warn(`Autoplay blocked (${label})`, e));
    }
  };

  videoEl.onloadedmetadata = () => tryPlay();
  tryPlay();
};

const VideoCall = ({ doctorId, patientId, callId, onEndCall, initiator = true }) => {
  const myVideo = useRef(null);
  const userVideo = useRef(null);

  const peerRef = useRef(null);
  const streamRef = useRef(null);

  const callIdRef = useRef(callId);

  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  // WhatsApp-like UI
  const [expanded, setExpanded] = useState(false); // desktop expand/minimize
  const [callActive, setCallActive] = useState(true);

  useEffect(() => {
    callIdRef.current = callId;
  }, [callId]);

  // ✅ Listen for doctor ending the call (backend emits "callEnded")
  useEffect(() => {
    const onCallEnded = ({ callId: endedCallId }) => {
      if (endedCallId && endedCallId !== callIdRef.current) return;
      // Remote ended => close without re-emitting endCall
      cleanupAndClose({ emitEnd: false });
    };

    socket.on("callEnded", onCallEnded);
    return () => socket.off("callEnded", onCallEnded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Main WebRTC setup
  useEffect(() => {
    let cancelled = false;

    const onWebrtcSignal = ({ callId: incomingCallId, signal }) => {
      if (!peerRef.current) return;
      if (incomingCallId !== callIdRef.current) return;

      try {
        peerRef.current.signal(signal);
      } catch (e) {
        console.warn("Failed to apply signal:", e);
      }
    };

    socket.on("webrtcSignal", onWebrtcSignal);

    const start = async () => {
      if (!callIdRef.current) {
        console.error("VideoCall: missing callId (signals will never match).");
      }

      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) return;

        streamRef.current = currentStream;

        // Ensure tracks enabled per initial UI state
        const a = currentStream.getAudioTracks?.()?.[0];
        const v = currentStream.getVideoTracks?.()?.[0];
        if (a) a.enabled = !muted;
        if (v) v.enabled = !videoOff;

        // Local preview
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
          myVideo.current.muted = true;
          myVideo.current.volume = 0;
          forcePlay(myVideo.current, "local preview");
        }

        const p = new Peer({
          initiator,
          trickle: true,
          stream: currentStream,
          config: { iceServers: getIceServers() },
        });

        peerRef.current = p;

        p.on("signal", (signal) => {
          socket.emit("webrtcSignal", { callId: callIdRef.current, signal });
        });

        p.on("stream", (remoteStream) => {
          if (userVideo.current) {
            userVideo.current.srcObject = remoteStream;
            userVideo.current.muted = false;
            userVideo.current.volume = 1;
            forcePlay(userVideo.current, "remote");
          }
        });

        p.on("close", () => console.log("Peer closed"));
        p.on("error", (e) => console.error("Peer error:", e));
      } catch (err) {
        console.error("Media error:", err);
      }
    };

    start();

    return () => {
      cancelled = true;
      socket.off("webrtcSignal", onWebrtcSignal);

      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
    // IMPORTANT: do not include muted/videoOff in deps, or you will recreate Peer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initiator]);

  // ✅ Fix: if local preview sometimes black, re-attach after mount
  useEffect(() => {
    if (!callActive) return;
    const s = streamRef.current;
    const vEl = myVideo.current;
    if (!s || !vEl) return;

    vEl.srcObject = s;
    vEl.muted = true;
    vEl.volume = 0;
    vEl.style.transform = "translateZ(0)";
    forcePlay(vEl, "local preview (reattach)");

    const t = setTimeout(() => forcePlay(vEl, "local preview (delayed)"), 250);
    return () => clearTimeout(t);
  }, [callActive]);

  const cleanupAndClose = ({ emitEnd }) => {
    const cid = callIdRef.current;

    if (emitEnd && cid) {
      socket.emit("endCall", { callId: cid });
    }

    // Cleanup
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (myVideo.current) myVideo.current.srcObject = null;
    if (userVideo.current) userVideo.current.srcObject = null;

    setCallActive(false);
    onEndCall?.();
  };

  const endCall = () => cleanupAndClose({ emitEnd: true });

  const toggleMute = () => {
    const track = streamRef.current?.getAudioTracks?.()?.[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setMuted(!track.enabled);
  };

  const toggleVideo = () => {
    const track = streamRef.current?.getVideoTracks?.()?.[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setVideoOff(!track.enabled);
  };

  if (!callActive) return null;

  return (
    <div
      className={[
        "fixed z-50 bg-black overflow-hidden",
        // Mobile-first full screen
        "inset-0 rounded-none",
        // Desktop: floating unless expanded
        expanded
          ? "sm:inset-10 sm:rounded-2xl sm:shadow-2xl"
          : "sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[360px] sm:h-[240px] sm:rounded-2xl sm:shadow-2xl",
      ].join(" ")}
    >
      {/* Remote video full */}
      <video ref={userVideo} autoPlay playsInline className="w-full h-full object-cover" />

      {/* Local preview overlay */}
      <video
        ref={myVideo}
        autoPlay
        muted
        playsInline
        className={[
          "absolute z-40 object-cover rounded-lg border border-white/30 bg-gray-800 transform-gpu",
          "bottom-20 right-4 w-28 h-20",
          "sm:bottom-3 sm:right-3 sm:w-32 sm:h-24",
        ].join(" ")}
      />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-50 p-3 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <span className="text-white text-sm">Video call</span>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="hidden sm:inline-flex text-white/90 hover:text-white p-2 rounded-lg hover:bg-white/10"
          title={expanded ? "Minimize" : "Expand"}
        >
          {expanded ? <FaCompress /> : <FaExpand />}
        </button>
      </div>

      {/* Controls (mobile safe area) */}
      <div className="absolute bottom-0 left-0 right-0 z-50 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 px-3 flex items-center justify-center gap-4 bg-gradient-to-t from-black/75 to-transparent">
        <button
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
          title="Toggle mic"
        >
          {muted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>

        <button
          onClick={toggleVideo}
          className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
          title="Toggle camera"
        >
          {videoOff ? <FaVideoSlash /> : <FaVideo />}
        </button>

        <button
          onClick={endCall}
          className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center"
          title="End call"
        >
          <FaPhoneSlash />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;