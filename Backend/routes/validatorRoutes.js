const express = require('express');
const router = express.Router();
const validatorController = require('../controllers/validatorController'); // Adjust path as needed


// POST: Register a new Validator
router.post('/register', validatorController.registerValidator); //http://127.0.0.1:7273/api/validator/register

// POST: Login Validator
router.post('/login', validatorController.loginValidator);     

// PATCH: Approve Validator (change status from pending to approved)
router.patch('/approve/:id', validatorController.approveValidator);

// PATCH: Reject Validator (change status to rejected)
router.patch('/reject/:id', validatorController.rejectValidator);

// GET: Get all validators (for admin purposes)
router.get('/', validatorController.getAllValidators);

// GET: Get validators by status (for admin purposes)
router.get('/status/:status', validatorController.getValidatorsByStatus);

// GET: Get validator by ID
router.get('/:id', validatorController.getValidatorById);

// Additional validator-specific routes
// PATCH: Add validated content to a validator
router.patch('/:id/validated-content', validatorController.addValidatedContent);

// GET: Get validators by language
router.get('/language/:language', validatorController.getValidatorsByLanguage);

module.exports = router;