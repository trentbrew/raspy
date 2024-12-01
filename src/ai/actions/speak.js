let currentSpeech = null;

/**
 * Speak the given text using the Web Speech Synthesis API.
 * @param {string} text - The text to be spoken.
 * @param {Object} options - Options for speech synthesis.
 * @param {function} sendTtsEvent - Function to send TTS events.
 */
const speak = (text, options = {}, sendTtsEvent) => {
  if (!text || typeof text !== "string") {
    sendTtsEvent({
      type: "error",
      errorMessage: "Invalid text input",
    });
    return;
  }

  // Send initial start event
  sendTtsEvent({ type: "start", charIndex: 0 });

  // Create speech synthesis utterance
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = options.lang || "en-US";
  speech.pitch = Math.max(0, Math.min(2, options.pitch || 1)); // Ensure pitch is within valid range
  speech.rate = Math.max(0.5, Math.min(2, options.rate || 1)); // Ensure rate is within valid range
  speech.volume = Math.max(0, Math.min(1, options.volume || 1)); // Ensure volume is within valid range

  // Optional: Set specific voice if provided
  if (options.voice) {
    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) => v.name === options.voice);
    if (selectedVoice) {
      speech.voice = selectedVoice;
    } else {
      console.warn(`Voice "${options.voice}" not found. Using default voice.`);
    }
  }

  // Handle speech events
  speech.onend = () => {
    sendTtsEvent({ type: "end", charIndex: text.length });
    currentSpeech = null;
  };

  speech.onerror = (event) => {
    sendTtsEvent({
      type: "error",
      errorMessage: event.error || "Unknown error",
    });
    currentSpeech = null;
  };

  // Save the current speech and start synthesis
  currentSpeech = speech;
  speechSynthesis.speak(speech);
};

// Initialize TTS engine
chrome.ttsEngine.onSpeak.addListener((utterance, options, sendTtsEvent) => {
  speak(utterance, options, sendTtsEvent);
});

// Stop speech when requested
chrome.ttsEngine.onStop.addListener(() => {
  if (currentSpeech) {
    speechSynthesis.cancel();
    sendTtsEvent({ type: "stop" }); // Send stop event
    currentSpeech = null;
  }
});

export default speak;
