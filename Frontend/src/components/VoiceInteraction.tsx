  const API_URL = import.meta.env.VITE_API_URL;

  import React, { useState, useRef } from "react";
  import {
    Mic,
    Loader2,
    MessageCircle,
    Volume2,
    Send,
    Pause,
  } from "lucide-react";

  interface ChatMessage {
    type: "user" | "bot";
    message: string;
    timestamp: Date;
    audioUrl?: string; // Bot audio response
  }

  interface VoiceInteractionProps {
    selectedLanguage: string;
  }

  const VoiceInteraction: React.FC<VoiceInteractionProps> = ({ selectedLanguage }) => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [textInput, setTextInput] = useState("");
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Handle user text submit
    const handleTextSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!textInput.trim()) return;
      await handleQuery(textInput);
      setTextInput("");
    };

    // Unified handler for voice/text input
    const handleQuery = async (input: string | Blob) => {
      setIsProcessing(true);

      const userMessage: ChatMessage = {
        type: "user",
        message: typeof input === "string" ? input : "🎤 Voice input",
        timestamp: new Date(),
      };

      // ✅ Immediately add user message to chat
      setMessages((prev) => [...prev, userMessage]);

      try {
        let res;
        // text input from user
        if (typeof input === "string") {
          res = await fetch(`${API_URL}/api/ask`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: input,
              language: selectedLanguage,
            }),
          });
        } else {
          const formData = new FormData();
          formData.append("file", input, "voice_input.webm");
          res = await fetch(`${API_URL}/api/voice-query?language=${selectedLanguage}`, 
            {
              method: "POST",
              body: formData,
            }
          );
        }

        const data = await res.json();
        const botMessage: ChatMessage = {
          type: "bot",
          message: data.reply || "Sorry, I didn't understand that.",
          timestamp: new Date(),
          audioUrl: `${API_URL}${data.audio_path}`,
        };

        // ✅ Append bot message after response
        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsProcessing(false);
        setIsListening(false);
      }
    };

    // Voice recording simulation
    const handleVoiceInput = async () => {
      if (!isListening) {
        // Start recording
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunks.current = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.current.push(event.data);
            }
          };

          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, {
              type: "audio/webm",
            });
            const tempAudioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(tempAudioUrl);

            audio.onloadedmetadata = async () => {
              if (audio.duration === Infinity) {
                audio.currentTime = 1e101;
                audio.ontimeupdate = () => {
                  audio.ontimeupdate = null;
                  const fixedDuration = audio.duration;
                  console.log("✅ Audio Recorded:");
                  console.log(
                    "🎧 Duration:",
                    fixedDuration.toFixed(2),
                    "seconds"
                  );
                  console.log(
                    "📦 Size:",
                    (audioBlob.size / 1024).toFixed(2),
                    "KB"
                  );
                  console.log("📁 Type:", audioBlob.type);

                  URL.revokeObjectURL(tempAudioUrl);
                  handleQuery(audioBlob);
                };
              } else {
                console.log("✅ Audio Recorded:");
                console.log("🎧 Duration:", audio.duration.toFixed(2), "seconds");
                console.log("📦 Size:", (audioBlob.size / 1024).toFixed(2), "KB");
                console.log("📁 Type:", audioBlob.type);

                URL.revokeObjectURL(tempAudioUrl);
                await handleQuery(audioBlob);
              }
            };
          };

          mediaRecorder.start();
          setIsListening(true);
        } catch (err) {
          console.error("Microphone error:", err);
          alert("Microphone access denied or not available.");
        }
      } else {
        // Stop recording
        setIsProcessing(true);
        setIsListening(false);
        mediaRecorderRef.current?.stop();
      }
    };

    const handlePlayAudio = (url: string | undefined) => {
      if (!url || !audioRef.current) return;

      // If the same audio is playing, pause it
      if (currentlyPlaying === url && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setCurrentlyPlaying(null);
      } else {
        audioRef.current.src = url;
        audioRef.current.play();
        setCurrentlyPlaying(url);

        // When audio ends, clear the state
        audioRef.current.onended = () => {
          setCurrentlyPlaying(null);
        };
      }
    };
    const tapActions: Record<string, { stop: string; speak: string }> = {
  English: {
    stop: "Tap to stop",
    speak: "Tap to speak",
  },
  Hindi: {
    stop: "रोकने के लिए टैप करें",
    speak: "बोलने के लिए टैप करें",
  },
  Odia: {
    stop: "ବନ୍ଦ କରିବାକୁ ଟ୍ୟାପ୍ କରନ୍ତୁ",
    speak: "କହିବାକୁ ଟ୍ୟାପ୍ କରନ୍ତୁ",
  },
  Bengali: {
    stop: "বন্ধ করতে ট্যাপ করুন",
    speak: "বলতে ট্যাপ করুন",
  },
};

    return (
      <div className="w-full max-w-4xl mx-auto mb-8 px-2">
        {/* Voice Button */}
        <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
          <button
            onClick={handleVoiceInput}
            disabled={isProcessing}
            className={`w-28 h-28 rounded-full shadow-2xl transition-all duration-300 ${
              isListening ? "bg-pink-500 animate-pulse" : "bg-emerald-500"
            } flex items-center justify-center`}
          >
            {isProcessing ? (
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </button>
          <p className="mt-3 text-gray-700 font-semibold">
            {isListening 
  ? tapActions[selectedLanguage].stop 
  : tapActions[selectedLanguage].speak}

          </p>
          
        </div>

        {/* Chat Container */}
        <div className="bg-white/90 rounded-2xl p-6 shadow-xl border">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Health Consultation
            </h3>
          </div>

          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="w-full">
                <div
                  className={`p-4 rounded-xl shadow-md ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">
                      {msg.type === "user" ? "🧍 You" : "🤖 Health Bot"}
                    </span>
                    {msg.type === "bot" && msg.audioUrl && (
                      <button
                        onClick={() => handlePlayAudio(msg.audioUrl)}
                        className="p-2 hover:bg-gray-200 rounded-full"
                      >
                        {currentlyPlaying === msg.audioUrl &&
                        !audioRef.current?.paused ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  <p>"{msg.message}"</p>
                  <div className="text-right text-xs mt-2">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Text Input */}
          <form
            onSubmit={handleTextSubmit}
            className="mt-6 flex items-center gap-2"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-teal-300"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="p-2 bg-teal-500 rounded-full text-white hover:bg-teal-600 transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} hidden />
      </div>
    );
  };

  export default VoiceInteraction;
