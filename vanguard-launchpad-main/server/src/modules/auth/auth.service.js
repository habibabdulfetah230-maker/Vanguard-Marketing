import Admin from "./admin.model.js";
import { createError } from "../../utils/errorResponse.js";
import { signAccessToken } from "../../utils/token.js";

const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw createError(401, "Invalid credentials");
  }

  const isValidPassword = await admin.comparePassword(password);
  if (!isValidPassword) {
    throw createError(401, "Invalid credentials");
  }

  const token = signAccessToken({
    sub: admin.id,
    email: admin.email,
    role: admin.role,
  });

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  };
};

const ensureDefaultAdmin = async ({ email, password, name }) => {
  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`[auth] Admin user already exists: ${email}`);
    return existing;
  }

  const admin = new Admin({ 
    email, 
    password, 
    name,
    role: 'admin'
  });
  await admin.save();
  console.log(`[auth] Created default admin user: ${email}`);
  return admin;
};

// Reset admin with known credentials
const resetAdmin = async () => {
  // Delete existing admin
  await Admin.deleteMany({ email: "vanguardmarketing123@gmail.com" });
  
  // Create new admin with known credentials
  const admin = new Admin({
    email: "vanguardmarketing123@gmail.com",
    password: "admin123456",
    name: "Admin",
    role: "admin"
  });
  await admin.save();
  
  return {
    email: "vanguardmarketing123@gmail.com",
    password: "admin123456"
  };
};

export { loginAdmin, ensureDefaultAdmin, resetAdmin };
