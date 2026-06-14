import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getApiUrl, AUTH_STORAGE_KEYS } from "@/config/api.js";

// Singleton instance to prevent multiple connections across the app
let socketInstance = null;

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // If instance already exists and is connected, just use it
    if (socketInstance && socketInstance.connected) {
      socketRef.current = socketInstance;
      setIsConnected(true);
      return;
    }

    // Get token for handshake
    const expenseUser = JSON.parse(localStorage.getItem("User") || "null");
    const token =
      localStorage.getItem(AUTH_STORAGE_KEYS.token) ||
      localStorage.getItem("token") ||
      expenseUser?.token;

    if (!token) {
      console.warn("WebSocket connection deferred: No authentication token found.");
      return;
    }

    // Initialize the socket singleton
    const SOCKET_URL = getApiUrl().replace(/\/api$/, ""); // Derive base URL
    
    socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socketInstance;

    const onConnect = () => {
      setIsConnected(true);
      setError(null);
      console.log("🟢 WebSocket Connected");
      
      // Request online users list on connection/reconnection
      if (socketInstance.connected) {
        socketInstance.emit("get_online_users", (users) => {
          // You can dispatch an event or handle it, but ChatPage already does this.
        });
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log("🔴 WebSocket Disconnected");
    };

    const onConnectError = (err) => {
      setIsConnected(false);
      setError(err.message);
      console.error("WebSocket Connection Error:", err.message);
    };

    // Socket.io reconnect event
    const onReconnect = (attemptNumber) => {
      console.log(`🔄 WebSocket Reconnected after ${attemptNumber} attempts`);
      // No explicit logic needed here; 'connect' will fire again and we re-fetch state if needed.
    };

    socketInstance.on("connect", onConnect);
    socketInstance.on("disconnect", onDisconnect);
    socketInstance.on("connect_error", onConnectError);
    socketInstance.io.on("reconnect", onReconnect);

    // Cleanup listeners on unmount (but don't destroy singleton unless explicitly logging out)
    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("disconnect", onDisconnect);
      socketInstance.off("connect_error", onConnectError);
      socketInstance.io.off("reconnect", onReconnect);
    };
  }, []);

  // Helper method to emit events
  const emit = (event, data, ack) => {
    if (socketRef.current && isConnected) {
      if (ack) {
        socketRef.current.timeout(5000).emit(event, data, (err, ...args) => {
          if (err) {
            console.error(`[SOCKET] Emit '${event}' ACK timeout or error:`, err);
            // In case of timeout or err, we call ack with failure or null to avoid hanging
            ack({ error: err.message || "Timeout" });
          } else {
            ack(...args);
          }
        });
      } else {
        socketRef.current.emit(event, data);
      }
    } else {
      console.warn(`Cannot emit '${event}': WebSocket not connected`);
    }
  };

  // Helper method to listen to events
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  // Helper method to remove event listeners
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  const waitForSocket = () => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && socketRef.current.connected) {
        return resolve(true);
      }
      
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (socketRef.current && socketRef.current.connected) {
          clearInterval(interval);
          resolve(true);
        } else if (attempts >= 50) { // 5s timeout (50 * 100ms)
          clearInterval(interval);
          console.warn("[SOCKET] waitForSocket timed out after 5s");
          resolve(false); // resolve false instead of reject to avoid unhandled rejections
        }
      }, 100);
    });
  };

  return { isConnected, error, emit, on, off, socket: socketRef.current, waitForSocket };
};

// Call this function explicitly on user logout to destroy the session
export const disconnectWebSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
