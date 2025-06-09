const upload = require('../middleware/upload');
const { SpeechConfig, SpeechSynthesizer, ResultReason, SpeechRecognizer, AudioConfig, CancellationReason } = require('microsoft-cognitiveservices-speech-sdk');
const { Readable } = require('stream');
const SPEECH_KEY = process.env.SPEECH_KEY; // Your Azure Speech Service key
const SPEECH_REGION = process.env.SPEECH_REGION; // Your Azure Speech Service region


const textToSpeechController = (req, res) => {
    const { text, language, voice } = req.body.text ? req.body : req.query;
    console.log(`Received TTS request: Text=${text}, Lang=${language}, Voice=${voice}`);

    if (!text || !language || !voice) {
        return res.status(400).json({ error: 'Missing parameters: text, language, or voice are required.' });
    }

    console.log(`TTS Request received: Lang=${language}, Voice=${voice}`);

    const speechConfig = SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    speechConfig.speechSynthesisLanguage = language;
    speechConfig.speechSynthesisVoiceName = voice;

    // Synthesize to an in-memory stream
    const synthesizer = new SpeechSynthesizer(speechConfig, null);

    synthesizer.speakTextAsync(
        text,
        result => {
            synthesizer.close();
            if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                console.log("TTS synthesis completed successfully.");
                const audioData = result.audioData;
                res.setHeader('Content-Type', 'audio/mpeg');
                res.status(200).send(Buffer.from(audioData));
            } else {
                const cancellationDetails = result.cancellationDetails;
                console.error(`Speech synthesis canceled: ${cancellationDetails.reason}`);
                if (cancellationDetails.reason === CancellationReason.Error) {
                    console.error(`Error details: ${cancellationDetails.errorDetails}`);
                }
                res.status(500).json({ error: "Error synthesizing speech." });
            }
        },
        error => {
            synthesizer.close();
            console.error("An unexpected error occurred during synthesis:", error);
            res.status(500).json({ error: "An unexpected error occurred during synthesis." });
        }
    );
};
// --- Speech-to-Text (STT) Endpoint ---
const speechToTextController = (req, res) => {
    const { language } = req.body;

    if (!req.file || !language) {
        return res.status(400).json({ error: 'Missing audio file or language.' });
    }
    
    console.log(`STT Request received: Lang=${language}`);

    const speechConfig = SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = language;

    // Configure the audio input from the uploaded file buffer
    const audioConfig = AudioConfig.fromStreamInput(Readable.from(req.file.buffer));
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(
        result => {
            recognizer.close();
            if (result.reason === ResultReason.RecognizedSpeech) {
                console.log(`STT recognized text: "${result.text}"`);
                res.status(200).json({ text: result.text });
            } else if (result.reason === ResultReason.NoMatch) {
                console.warn("STT: No speech could be recognized.");
                res.status(404).json({ error: 'No speech could be recognized.' });
            } else if (result.reason === ResultReason.Canceled) {
                 const cancellationDetails = result.cancellationDetails;
                console.error(`Speech recognition canceled: ${cancellationDetails.reason}`);
                res.status(500).json({ error: "Error recognizing speech." });
            }
        },
        error => {
            recognizer.close();
            console.error("An unexpected error occurred during recognition:", error);
            res.status(500).json({ error: "An unexpected error occurred during recognition." });
        }
    );
};

// Export the controller functions
module.exports = {
    textToSpeechController,
    speechToTextController
};