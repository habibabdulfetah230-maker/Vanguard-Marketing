import { createError } from "../utils/errorResponse.js";

const requireAdmin = (req, _res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "superadmin")) {
    return next(createError(403, "Forbidden"));
  }
  return next();
};

export default requireAdmin;
