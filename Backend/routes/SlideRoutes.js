const express = require('express');
const router = express.Router();
const SlideContentController = require('../controllers/SlideContentController');

router.get('/allchap', SlideContentController.getAllChapters); //http://127.0.0.1:7273/api/slides/allchap
router.get('/search/content', SlideContentController.searchChapterContent);
router.get('/:chapterId/:language', SlideContentController.getChapterByLanguage);   //http://127.0.0.1:7273/api/slides?chapterId="The Mango"&language="english"
router.get('/:chapterId', SlideContentController.getChapterById);
router.get('/:chapterId/language/:language', SlideContentController.getChapterByLanguage);
router.post('/', SlideContentController.createChapter);          //http://127.0.0.1:7273/api/slides?    
router.put('/:chapterId', SlideContentController.updateChapter);
router.put('/:chapterId/language/:language', SlideContentController.updateChapterLanguage);
router.post('/:chapterId/language/:language/slide', SlideContentController.addSlideToLanguage);
router.delete('/:chapterId', SlideContentController.deleteChapter);  //http://127.0.0.1:7273/api/slides/The Mangooooo
router.delete('/:chapterId/language/:language/slide/:slideIndex', SlideContentController.deleteSlideFromLanguage);
router.use((req, res) => {
  res.status(404).json({ success: false, message: 'Invalid API endpoint' });
});

module.exports = router;
