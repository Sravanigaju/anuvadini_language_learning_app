import whisper

# Load the Whisper model (choose: tiny, base, small, medium, large)
model = whisper.load_model("small")

# Path to your audio file
audio_file = r"C:\Users\010\Downloads\transcription_ready.wav"

# Transcribe the audio
result = model.transcribe(audio_file, language="en")

# Print transcript
print("Transcription:\n")
print(result["text"])

# Optionally, save to a text file
with open("transcription_output.txt", "w", encoding="utf-8") as f:
    f.write(result["text"])
