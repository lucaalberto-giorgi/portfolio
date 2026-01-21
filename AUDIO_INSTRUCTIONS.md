# Audio File Instructions

## Quick Solution

The audio file has been generated as `luca-intro.aiff`. To convert it to MP3:

### Option 1: Online Converter (Easiest)
1. Go to https://cloudconvert.com/aiff-to-mp3 or https://convertio.co/aiff-mp3/
2. Upload `public/audio/luca-intro.aiff`
3. Download the converted MP3 file
4. Save it as `luca-intro.mp3` in the `public/audio/` folder

### Option 2: Using macOS
1. Open the file `public/audio/luca-intro.aiff` in any audio player
2. Use an app like Audacity, VLC, or online converters to export as MP3

### Option 3: Regenerate using Online TTS
1. Go to https://ttsmaker.com/ or https://www.naturalreaders.com/online/
2. Enter text: "Hello my name is Luca Alberto Giorgi and thats my portfolio"
3. Generate and download as MP3
4. Save as `luca-intro.mp3` in `public/audio/` folder

### Option 4: Use Python (if you have gTTS installed)
```bash
pip install gtts
python generate-audio.py
```

The configuration has already been updated to use `/audio/luca-intro.mp3`.

