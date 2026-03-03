import { io } from "socket.io-client";
export const socket = io("https://elpb.vercel.app", {
  transports: ["websocket"],
});