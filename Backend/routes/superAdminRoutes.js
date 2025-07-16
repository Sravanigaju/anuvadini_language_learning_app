const express = require("express");
const router = express.Router();
const ctl = require("../controllers/superAdminDashboard");




router.get("/dashboard", ctl.getSuperAdminDashboard);





module.exports = router;
