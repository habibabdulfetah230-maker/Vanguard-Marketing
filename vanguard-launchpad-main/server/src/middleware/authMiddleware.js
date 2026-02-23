import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { createError } from "../utils/errorResponse.js";

const authMiddleware = (req, _res, next) => {
  const header = req.headers.authorization;
  
  if (!header?.startsWith("Bearer ")) {
    return next(createError(401, "Authentication required"));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch (error) {
    return next(createError(401, "Invalid or expired token", error.message));
  }
};

export default authMiddleware;
