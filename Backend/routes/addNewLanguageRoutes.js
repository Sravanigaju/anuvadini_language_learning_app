const express = require("express");
const router = express.Router();
const { addLanguagePreference } = require("../controllers/addNewLanguage");

router.post("/", addLanguagePreference); 

module.exports = router;