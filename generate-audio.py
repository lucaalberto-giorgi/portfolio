#!/usr/bin/env python3
"""
Script to generate audio file for portfolio introduction.
Requires: pip install gtts
"""

try:
    from gtts import gTTS
    import os
except ImportError:
    print("Error: gTTS library not found.")
    print("Please install it by running: pip install gtts")
    exit(1)

# Text to convert to speech
text = "Hello my name is Luca Alberto Giorgi and thats my portfolio"

# Output file path
output_path = "public/audio/luca-intro.mp3"

try:
    # Create gTTS object
    tts = gTTS(text=text, lang='en', slow=False)
    
    # Save the audio file
    tts.save(output_path)
    
    print(f"✅ Audio file generated successfully!")
    print(f"📁 File saved to: {output_path}")
    print(f"🎵 Text: '{text}'")
    
except Exception as e:
    print(f"❌ Error generating audio: {e}")
    print("\nAlternative options:")
    print("1. Use an online TTS service like:")
    print("   - https://ttsmaker.com/")
    print("   - https://www.naturalreaders.com/online/")
    print("2. Use your phone's voice recorder")
    print("3. Use macOS 'say' command:")
    print(f'   say "{text}" -o {output_path} --data-format=MPEG4')

