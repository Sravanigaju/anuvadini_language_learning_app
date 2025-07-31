const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/instituitionController');

// POST: Register a new Institution
router.post('/register', institutionController.registerInstitution); //http://127.0.0.1:7273/api/institution/register

// POST: Login Institution
router.post('/login', institutionController.loginInstitution);     

// PATCH: Approve Institution (change status from pending to approved)
router.patch('/approve/:id', institutionController.approveInstitution);

// PATCH: Reject Institution (change status to rejected)
router.patch('/reject/:id', institutionController.rejectInstitution);

// GET: Get all institutions (for admin purposes)
router.get('/', institutionController.getAllInstitutions);

// GET: Get institutions by status (for admin purposes)
router.get('/status/:status', institutionController.getInstitutionsByStatus);

// GET: Get institution by ID
router.get('/:id', institutionController.getInstitutionById);

module.exports = router;