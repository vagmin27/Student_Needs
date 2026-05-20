import jwt from "jsonwebtoken";

// Middleware to authenticate socket connections
export const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    // Extract Bearer if present
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    
    // Validate JWT (assumes JWT_SECRET is set)
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || "fallback_secret");
    
    // Attach decoded user to socket object
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
};
