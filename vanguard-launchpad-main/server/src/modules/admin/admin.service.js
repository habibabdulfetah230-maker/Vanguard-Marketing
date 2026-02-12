// Mock admin data for development without database
const mockAdmins = [
  {
    _id: '1',
    email: 'admin@vanguard.com',
    name: 'Super Admin',
    role: 'superadmin',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all admins
const getAllAdmins = async () => {
  try {
    return mockAdmins;
  } catch (error) {
    throw new Error('Failed to fetch admins: ' + error.message);
  }
};

// Get admin by ID
const getAdminById = async (id) => {
  try {
    const admin = mockAdmins.find(a => a._id === id);
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
    const existingAdmin = mockAdmins.find(a => a.email === email);
    if (existingAdmin) {
      throw new Error('Admin with this email already exists');
    }
    
    // Create new admin
    const newAdmin = {
      _id: Date.now().toString(),
      email,
      name,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockAdmins.push(newAdmin);
    return newAdmin;
  } catch (error) {
    throw new Error('Failed to create admin: ' + error.message);
  }
};

// Update admin
const updateAdmin = async (id, updateData) => {
  try {
    const adminIndex = mockAdmins.findIndex(a => a._id === id);
    if (adminIndex === -1) {
      throw new Error('Admin not found');
    }
    
    // Don't allow password updates through this method
    const { password, ...safeUpdateData } = updateData;
    
    Object.assign(mockAdmins[adminIndex], safeUpdateData);
    mockAdmins[adminIndex].updatedAt = new Date().toISOString();
    
    return mockAdmins[adminIndex];
  } catch (error) {
    throw new Error('Failed to update admin: ' + error.message);
  }
};

// Toggle admin status
const toggleAdminStatus = async (id) => {
  try {
    const adminIndex = mockAdmins.findIndex(a => a._id === id);
    if (adminIndex === -1) {
      throw new Error('Admin not found');
    }
    
    mockAdmins[adminIndex].isActive = !mockAdmins[adminIndex].isActive;
    mockAdmins[adminIndex].updatedAt = new Date().toISOString();
    
    return mockAdmins[adminIndex];
  } catch (error) {
    throw new Error('Failed to toggle admin status: ' + error.message);
  }
};

// Delete admin
const deleteAdmin = async (id) => {
  try {
    const adminIndex = mockAdmins.findIndex(a => a._id === id);
    if (adminIndex === -1) {
      throw new Error('Admin not found');
    }
    
    const deletedAdmin = mockAdmins[adminIndex];
    mockAdmins.splice(adminIndex, 1);
    return deletedAdmin;
  } catch (error) {
    throw new Error('Failed to delete admin: ' + error.message);
  }
};

// Change admin password
const changeAdminPassword = async (id, newPassword) => {
  try {
    const adminIndex = mockAdmins.findIndex(a => a._id === id);
    if (adminIndex === -1) {
      throw new Error('Admin not found');
    }
    
    // In mock, we don't actually store passwords
    mockAdmins[adminIndex].updatedAt = new Date().toISOString();
    
    return mockAdmins[adminIndex];
  } catch (error) {
    throw new Error('Failed to change password: ' + error.message);
  }
};

export {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
  changeAdminPassword
};
