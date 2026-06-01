import jwt from "jsonwebtoken";
import { getJwtSecret } from "../jwtSecret.js";

/**
 * Resolve student id for tutorial bookings from passport session or Bearer JWT.
 * Used only by the booking routes (unified + tutorials login).
 */
export function resolveBookingStudentId(req) {
  if (req.session?.passport?.user) {
    return req.session.passport.user.toString();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], getJwtSecret());
    return decoded?.id?.toString() || null;
  } catch {
    return null;
  }
}
