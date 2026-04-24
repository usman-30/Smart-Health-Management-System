// export function getIceServers() {
//   const turnUrl = import.meta.env.VITE_TURN_URL;
//   const turnUser = import.meta.env.VITE_TURN_USERNAME;
//   const turnPass = import.meta.env.VITE_TURN_CREDENTIAL;

//   const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

//   if (turnUrl && turnUser && turnPass) {
//     iceServers.push({
//       urls: turnUrl,
//       username: turnUser,
//       credential: turnPass,
//     });
//   }

//   return iceServers;
// }

export function getIceServers() {
  // STUN only for localhost / same network testing
  return [{ urls: "stun:stun.l.google.com:19302" }];
}
