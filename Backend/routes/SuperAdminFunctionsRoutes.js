const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/SuperAdminFuncController');

// POST: Create a new SuperAdmin
router.post('/create', superAdminController.createSuperAdmin);    //http://127.0.0.1:7273/api//super_admin_registration/create

// GET: Get all SuperAdmins
router.get('/all', superAdminController.getAllSuperAdmins);

// GET: Get SuperAdmin by ID
router.get('/byid/:id', superAdminController.getSuperAdminById);


// GET: Get all fields from all models (creators, institutions, validators)
router.get('/ICV-all', superAdminController.getAllFieldsFromAllModels);  //http://127.0.0.1:7273/api/super_admin_registration/ICV-all?page=1&limit=10      this is without filter
                                                                         //
// GET: Get statistics from all models
router.get('/ICV-statistics', superAdminController.getAllModelsStatistics);

module.exports = router;