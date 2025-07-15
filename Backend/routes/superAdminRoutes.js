
const express = require("express");
const router = express.Router();
const ctl = require("../controllers/superAdminController");

router.get("/total-users", ctl.getTotalUsers);
router.get("/average-xp", ctl.getAverageXP);
router.get("/average-coins", ctl.getAverageCoins);
router.get("/top-source-language", ctl.getTopSourceLanguage);
router.get("/top-target-language", ctl.getTopTargetLanguage);
router.get("/gender-distribution", ctl.getGenderDistribution);
router.get("/certificate-status", ctl.getCertificateStatus);
router.get("/age-distribution", ctl.getAgeDistribution);
router.get("/users-joined-monthly", ctl.getUsersJoinedMonthly);
router.get("/users-by-country", ctl.getUsersByCountry);
router.get("/funnel-chart", ctl.getFunnelChartData);
router.get("/language-leaderboard", ctl.getLanguageLeaderboard);

module.exports = router;
