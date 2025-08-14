const express = require('express');
const router = express.Router();
const SlideContentController = require('../controllers/SlideContentController');

// --- READ (GET) ROUTES ---

// General, non-parameterized routes first
router.get('/allchap', SlideContentController.getAllChapters);
router.get('/search/content', SlideContentController.searchChapterContent);


// --- THIS IS THE NEW, CORRECT ROUTE YOU NEED TO ADD ---
// It specifically handles GET /slides?chapterId=...&language=...
router.get('/', SlideContentController.getChapterByLanguage);
// NOTE: We use '/' here because the '/slides' prefix is already handled in your main app.js (app.use('/api/slides', ...))


// Specific routes with parameters come after general routes
router.get('/:chapterId', SlideContentController.getChapterById);
router.get('/:chapterId/language/:language', SlideContentController.getChapterByLanguage); // This can be an alternative route if needed
router.get('/:chapterId/:language', SlideContentController.getChapterByLanguage); // This can be an alternative route if needed


// --- WRITE (POST, PUT, DELETE) ROUTES ---

router.post('/', SlideContentController.createChapter);
router.post('/:chapterId/language/:language/slide', SlideContentController.addSlideToLanguage);

router.put('/:chapterId', SlideContentController.updateChapter);
router.put('/:chapterId/language/:language', SlideContentController.updateChapterLanguage);

router.delete('/:chapterId', SlideContentController.deleteChapter);
router.delete('/:chapterId/language/:language/slide/:slideIndex', SlideContentController.deleteSlideFromLanguage);


// --- CATCH-ALL 404 HANDLER ---
// This should always be the very last thing before module.exports
router.use((req, res) => {
  res.status(404).json({ success: false, message: 'Invalid API endpoint' });
});

module.exports = router;