import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaPhone,
  FaTimes,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import Peer from "simple-peer/simplepeer.min.js";
import socket from "../../socket";
import { getIceServers } from "../../webrtc/ice";

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

  // try now + when metadata is ready
  videoEl.onloadedmetadata = () => tryPlay();
  tryPlay();
};

const Chat = () => {
  const myVideo = useRef(null);
  const userVideo = useRef(null);

  const peerRef = useRef(null);
  const streamRef = useRef(null);

  const [incomingCall, setIncomingCall] = useState(null);
  const [callId, setCallId] = useState(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [callActive, setCallActive] = useState(false);

  const [showIncomingPopup, setShowIncomingPopup] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const registeredRef = useRef(false);

  const callIdRef = useRef(null);
  useEffect(() => {
    callIdRef.current = callId;
  }, [callId]);

  useEffect(() => {
    const onIncomingCall = (data) => {
      setIncomingCall(data);
      setShowIncomingPopup(true);
      setExpanded(false);
    };

    const onWebrtcSignal = ({ callId: incomingCallId, signal }) => {
      if (!peerRef.current) return;
      if (incomingCallId !== callIdRef.current) return;
      try {
        peerRef.current.signal(signal);
      } catch (e) {
        console.warn("Failed to apply signal:", e);
      }
    };

    const onCallEnded = ({ callId: endedCallId }) => {
      if (endedCallId && endedCallId !== callIdRef.current) return;
      endCall(true);
    };

    socket.on("incomingCall", onIncomingCall);
    socket.on("webrtcSignal", onWebrtcSignal);
    socket.on("callEnded", onCallEnded);

    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webrtcSignal", onWebrtcSignal);
      socket.off("callEnded", onCallEnded);
    };
  }, []);

  // ✅ KEY FIX: re-attach local stream after UI is shown (ref is guaranteed)
  useEffect(() => {
    if (!callActive) return;

    const s = streamRef.current;
    const vEl = myVideo.current;
    if (!s || !vEl) return;

    const vTrack = s.getVideoTracks?.()?.[0];
    if (vTrack) {
      // ensure it's enabled and not ended
      vTrack.enabled = true;
    }

    // re-attach stream and force play again
    vEl.srcObject = s;
    vEl.muted = true;
    vEl.volume = 0;

    // force a repaint on some devices
    vEl.style.transform = "translateZ(0)";

    forcePlay(vEl, "local preview (reattach)");

    // also retry after a short delay (helps on some Android devices)
    const t = setTimeout(() => forcePlay(vEl, "local preview (delayed)"), 250);
    return () => clearTimeout(t);
  }, [callActive]);


  useEffect(() => {
    const handleNoAnswer = () => {
        setIncomingCall();
      setShowIncomingPopup(false);
      setExpanded(true);
      };
    socket.on("callEnded", handleNoAnswer);
    return () => socket.off("callEnded", handleNoAnswer);
  }, []);

  const startCall = async () => {
    if (!incomingCall) return;
    if (callActive || peerRef.current) return;

    const cid = incomingCall.callId;
    setCallId(cid);
    callIdRef.current = cid;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = mediaStream;

      const v = mediaStream.getVideoTracks?.()?.[0];
      const a = mediaStream.getAudioTracks?.()?.[0];
      if (v) v.enabled = true;
      if (a) a.enabled = true;
      setCameraOn(true);
      setMicOn(true);

      // attach local stream (may still be early; re-attach effect above will ensure)
      if (myVideo.current) {
        myVideo.current.srcObject = mediaStream;
        myVideo.current.muted = true;
        myVideo.current.volume = 0;
        forcePlay(myVideo.current, "local preview");
      }

      const p = new Peer({
        initiator: false,
        trickle: true,
        stream: mediaStream,
        config: { iceServers: getIceServers() },
      });

      peerRef.current = p;

      p.on("signal", (signal) => {
        socket.emit("webrtcSignal", { callId: cid, signal });
      });

      p.on("stream", (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
          userVideo.current.muted = false;
          userVideo.current.volume = 1;
          forcePlay(userVideo.current, "remote");
        }
      });

      p.on("error", (e) => console.error("Peer error:", e));
      p.on("close", () => console.log("Peer closed"));

      socket.emit("acceptCall", { callId: cid });

      setCallActive(true);
      setIncomingCall(null);
      setShowIncomingPopup(false);
      setExpanded(false);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const rejectCall = () => {
    if (!incomingCall?.callId) {
      setShowIncomingPopup(false);
      setIncomingCall(null);
      return;
    }
    socket.emit("rejectCall", { callId: incomingCall.callId });
    setShowIncomingPopup(false);
    setIncomingCall(null);
  };

  const toggleMic = () => {
    const t = streamRef.current?.getAudioTracks?.()?.[0];
    if (!t) return;
    t.enabled = !t.enabled;
    setMicOn(t.enabled);
  };

  const toggleCamera = () => {
    const t = streamRef.current?.getVideoTracks?.()?.[0];
    if (!t) return;
    t.enabled = !t.enabled;
    setCameraOn(t.enabled);
  };

  const endCall = (fromRemote = false) => {
    if (!fromRemote && callIdRef.current) socket.emit("endCall", { callId: callIdRef.current });

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

    setMicOn(true);
    setCameraOn(true);
    setCallActive(false);
    setCallId(null);
    setExpanded(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">Doctor Portal</h1>
          <p className="text-gray-600 mt-1">Calls appear as a WhatsApp-like popup (mobile friendly).</p>
        </div>
      </div>

      {showIncomingPopup && incomingCall && !callActive && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="w-full sm:w-[420px] rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b">
              <div>
                <p className="font-semibold text-gray-900">Incoming video call</p>
                <p className="text-sm text-gray-500 break-all">
                  Patient: <span className="font-mono">{incomingCall.patientId}</span>
                </p>
              </div>
              <button onClick={rejectCall} className="p-2 rounded-full hover:bg-gray-100 text-gray-700" title="Dismiss">
                <FaTimes />
              </button>
            </div>

            <div className="px-4 sm:px-5 py-4">
              <div className="flex gap-3 justify-end">
                <button onClick={rejectCall} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-900 hover:bg-gray-300">
                  Reject
                </button>
                <button
                  onClick={startCall}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-500 inline-flex items-center gap-2"
                >
                  <FaPhone /> Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {callActive && (
        <div
          className={[
            "fixed z-50 bg-black overflow-hidden",
            "inset-0 rounded-none",
            expanded
              ? "sm:inset-10 sm:rounded-2xl"
              : "sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[360px] sm:h-[240px] sm:rounded-2xl sm:shadow-2xl",
          ].join(" ")}
        >
          <video ref={userVideo} autoPlay playsInline className="w-full h-full object-cover z-0" />

          {/* local preview: add transform-gpu + z-40 */}
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

          <div className="absolute bottom-0 left-0 right-0 z-50 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 px-3 flex items-center justify-center gap-4 bg-gradient-to-t from-black/75 to-transparent">
            <button
              onClick={toggleMic}
              className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              title="Toggle mic"
            >
              {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>

            <button
              onClick={toggleCamera}
              className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              title="Toggle camera"
            >
              {cameraOn ? <FaVideo /> : <FaVideoSlash />}
            </button>

            <button
              onClick={() => endCall(false)}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center"
              title="End call"
            >
              <FaPhoneSlash />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;