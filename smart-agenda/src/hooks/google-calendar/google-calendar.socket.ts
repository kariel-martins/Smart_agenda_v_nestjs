import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { UseAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

const backendUrl = import.meta.env.VITE_API_URL;

export function useCalendarNotifications() {
  const { user } = UseAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
  if (!user?.userId || socketRef.current) return;

  const socket = io(backendUrl, {
    query: { userId: user.userId },
    transports: ["websocket"],
  });

  socketRef.current = socket;

  socket.on("calendar:notification", (data) => {
    toast.success(data.message);
  });

  return () => {
    socket.disconnect();
    socketRef.current = null;
  };
}, [user?.userId]);
}
