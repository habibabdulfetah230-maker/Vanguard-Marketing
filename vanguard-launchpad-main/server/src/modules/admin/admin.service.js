const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all admins
const getAllAdmins = async () => {
  try {
    const admins = await Admin.find({}).select('-password').sort({ createdAt: -1 });
    return admins;
  } catch (error) {
    throw new Error('Failed to fetch admins: ' + error.message);
  }
};

// Get admin by ID
const getAdminById = async (id) => {
  try {
    const admin = await Admin.findById(id).select('-password');
    if (!admin) {
      throw new Error('Admin not found');
    }
    return admin;
  } catch (error) {
    throw new Error('Failed to fetch admin: ' + error.message);
  }
};

// Create new admin
const createAdmin = async (adminData) => {
  try {
    const { email, name, role = 'admin' } = adminData;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }
    
    // Create new admin
    const newAdmin = new Admin({
      email,
      name,
      role,
      password: adminData.password, // Will be hashed by pre-save hook
      isActive: true
    });
    
    await newAdmin.save();
    return newAdmin;
  } catch (error) {
    throw new Error('Failed to create admin: ' + error.message);
  }
};

// Update admin
const updateAdmin = async (id, updateData) => {
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }
    
    // Don't allow password updates through this method
    const { password, ...safeUpdateData } = updateData;
    
    Object.assign(admin, safeUpdateData);
    admin.updatedAt = new Date();
    
    await admin.save();
    return admin;
  } catch (error) {
    throw new Error('Failed to update admin: ' + error.message);
  }
};

// Toggle admin status
const toggleAdminStatus = async (id) => {
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }
    
    admin.isActive = !admin.isActive;
    admin.updatedAt = new Date();
    
    await admin.save();
    return admin;
  } catch (error) {
    throw new Error('Failed to toggle admin status: ' + error.message);
  }
};

// Delete admin
const deleteAdmin = async (id) => {
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }
    
    await Admin.findByIdAndDelete(id);
    return admin;
  } catch (error) {
    throw new Error('Failed to delete admin: ' + error.message);
  }
};

// Change admin password
const changeAdminPassword = async (id, newPassword) => {
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }
    
    admin.password = newPassword; // Will be hashed by pre-save hook
    admin.updatedAt = new Date();
    
    await admin.save();
    return admin;
  } catch (error) {
    throw new Error('Failed to change password: ' + error.message);
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
  changeAdminPassword
};
