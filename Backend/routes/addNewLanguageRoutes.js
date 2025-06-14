const express = require("express");
const router = express.Router();
const { addLanguagePreference } = require("../controllers/addNewLanguage");

router.post("/", addLanguagePreference); // POST /api/language-preference/

module.exports = router;