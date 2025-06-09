const upload = require('../middleware/upload'); // Assuming you have a middleware for handling file uploads
const router = require('express').Router();
const { textToSpeechController, speechToTextController } = require('../controllers/translateController');


router.post('/tts', textToSpeechController);

router.post('/stt', upload.single('audio'), speechToTextController);


module.exports = router;