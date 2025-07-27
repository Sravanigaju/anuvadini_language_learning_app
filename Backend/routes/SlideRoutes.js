const express = require('express');
const router = express.Router();
const SlideContentController = require('../controllers/SlideContentController');

router.get('/', SlideContentController.getAllChapters);
router.get('/search/content', SlideContentController.searchChapterContent);
router.get('/:chapterId/:language', SlideContentController.getChapterByLanguage);
router.get('/:chapterId', SlideContentController.getChapterById);
router.get('/:chapterId/language/:language', SlideContentController.getChapterByLanguage);
router.post('/', SlideContentController.createChapter);
router.put('/:chapterId', SlideContentController.updateChapter);
router.put('/:chapterId/language/:language', SlideContentController.updateChapterLanguage);
router.post('/:chapterId/language/:language/slide', SlideContentController.addSlideToLanguage);
router.delete('/:chapterId', SlideContentController.deleteChapter);
router.delete('/:chapterId/language/:language/slide/:slideIndex', SlideContentController.deleteSlideFromLanguage);
router.use((req, res) => {
  res.status(404).json({ success: false, message: 'Invalid API endpoint' });
});

module.exports = router;
