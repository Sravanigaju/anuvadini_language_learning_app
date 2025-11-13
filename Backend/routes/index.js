const express = require("express");
const router = express.Router();

// Existing routes
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const userProfileRoutes = require("./userProfileRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const uploadRoutes = require("./uploadRoutes");
const feedbackRoutes = require("./feedback");
const leaderboardRoutes = require("./leaderboardRoutes");
const deleteRoutes = require("./deleteRoutes"); 
const crosswordRoutes = require('./crosswordRoutes');
const validatorRoutes = require("./validatorRoutes");
const institutionRoutes = require("./instituitionRoutes");
const creatorRoutes = require("./creatorAuthRoutes.js"); 
const SlideRoutes = require("./SlideRoutes");
const SuperAdminFuncRoutes = require("./SuperAdminFunctionsRoutes");
const courseFormRoutes = require("./course_form_route");
const quizRoutes = require("./Quiz_WEB_Routes");
const LevelRoutes = require("./LevelRoutes");
const versionRoutes = require("./versionRoutes");

const superAdminRoutes = require("./superAdminRoutes");

const UserCoutryRoutes = require("./userCountryRoutes")                                         
const UserperMonthRoutes = require("./UserperMonthRoutes")
const UserEnrollRoutes = require("./EnrollRouter")
const otpRoutes = require("./otpRoutes");
const samvadiniRoutes = require("./samvadini"); 

const communityRoutes = require("./communityRoutes");  // 




// Use route modules
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/userprofile", userProfileRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload", uploadRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/deleteusers", deleteRoutes);
router.use('/crossword', crosswordRoutes);
router.use("/slides", SlideRoutes);




router.use('/creator', creatorRoutes);
router.use("/validator", validatorRoutes);
router.use("/institution", institutionRoutes);


router.use("/slides", SlideRoutes);
router.use("/levels", LevelRoutes);

router.use("/super_admin_registration", SuperAdminFuncRoutes);
router.use('/quizes', quizRoutes);
router.use("/course_form", courseFormRoutes);

router.use("/country_data", UserCoutryRoutes);
router.use("/per_month", UserperMonthRoutes);
router.use("/enroll_stats", UserEnrollRoutes);
router.use("/otp",otpRoutes);
router.use("/content/versions", versionRoutes);
router.use("/content/levels", LevelRoutes);  // Add content/levels route

// ✅ Mount Samvadini first-access route

router.use("/samvadini", samvadiniRoutes);
router.use("/community", communityRoutes);


module.exports = router;
