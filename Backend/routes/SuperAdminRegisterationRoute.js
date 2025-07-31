const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/SuperAdminRegistrationController');

// POST: Create a new SuperAdmin
router.post('/create', superAdminController.createSuperAdmin);    //http://127.0.0.1:7273/api//super_admin_registration/create

// GET: Get all SuperAdmins
router.get('/', superAdminController.getAllSuperAdmins);

// GET: Get SuperAdmin by ID
router.get('/:id', superAdminController.getSuperAdminById);

module.exports = router;