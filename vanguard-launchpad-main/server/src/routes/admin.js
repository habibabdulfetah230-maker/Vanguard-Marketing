import express from 'express';
const router = express.Router();
import { getAllAdmins, getAdminById, createAdmin, updateAdmin, toggleAdminStatus, deleteAdmin, changeAdminPassword } from '../modules/admin/admin.service.js';
import authMiddleware from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/requireAdmin.js';

// Get all admins
router.get('/', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const admins = await getAllAdmins();
    res.json(admins);
  } catch (error) {
    next(error);
  }
});

// Get admin by ID
router.get('/:id', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const admin = await getAdminById(req.params.id);
    res.json(admin);
  } catch (error) {
    next(error);
  }
});

// Create new admin
router.post('/', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const admin = await createAdmin(req.body);
    res.status(201).json(admin);
  } catch (error) {
    next(error);
  }
});

// Update admin
router.put('/:id', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const admin = await updateAdmin(req.params.id, req.body);
    res.json(admin);
  } catch (error) {
    next(error);
  }
});

// Toggle admin status
router.patch('/:id/toggle', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const admin = await toggleAdminStatus(req.params.id);
    res.json(admin);
  } catch (error) {
    next(error);
  }
});

// Delete admin
router.delete('/:id', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const admin = await deleteAdmin(req.params.id);
    res.json(admin);
  } catch (error) {
    next(error);
  }
});

// Change admin password
router.patch('/:id/password', authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }
    
    const admin = await changeAdminPassword(req.params.id, newPassword);
    res.json(admin);
  } catch (error) {
    next(error);
  }
});

export default router;
