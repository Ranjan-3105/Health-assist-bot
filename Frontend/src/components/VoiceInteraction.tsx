import React, { useState, useRef } from "react";
import { Mic, Loader2, MessageCircle, Volume2, Download } from "lucide-react";

interface ChatMessage {
  type: "user" | "bot";
  message: string;
  timestamp: Date;
}

const VoiceInteraction: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasRecordingStarted, setHasRecordingStarted] = useState(false);
  const [isStopDisabled, setIsStopDisabled] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleVoiceInput = async () => {
    if (isProcessing) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl); // Optional: for download button

        // Prepare FormData
        const formData = new FormData();
        const filename = `recording_${Date.now()}.webm`;
        formData.append("file", audioBlob, filename);

        try {
          const response = await fetch("http://localhost:8000/upload-audio", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            console.log("Audio uploaded successfully!");
          } else {
            console.error("Upload failed:", await response.text());
          }
        } catch (error) {
          console.error("Error sending audio to backend:", error);
        }

        // Simulated messages
        const userMessage: ChatMessage = {
          type: "user",
          message: "Mujhe bukhar hai aur sar mein dard ho raha hai",
          timestamp: new Date(),
        };

        const botMessage: ChatMessage = {
          type: "bot",
          message:
            "Pani zyada piyen, aram karein. Agar bukhar 101°F se zyada hai toh doctor se milein. Paracetamol le sakte hain.",
          timestamp: new Date(),
        };

        setMessages([userMessage, botMessage]);
        setIsProcessing(false);
        setIsListening(false);
        setIsPaused(false);
        setHasRecordingStarted(false);
      };

      mediaRecorder.start();
      setIsListening(true);
      setIsProcessing(true);
      setHasRecordingStarted(true);
    } catch (err) {
      console.error("Microphone error:", err);
      setIsListening(false);
      setIsProcessing(false);
      setIsPaused(false);
      setHasRecordingStarted(false);
    }
  };

  const handlePauseResume = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsStopDisabled(true); // Disable the button
    }
  };

  const handlePlayAudio = (message: string) => {
    // Simulate text-to-speech
    console.log("Playing audio:", message);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 px-2">
      {/* Voice Button */}
      <div className="flex flex-col items-center justify-center mb-6 sm:mb-8">
        <button
          onClick={handleVoiceInput}
          disabled={isProcessing}
          aria-label={
            isListening
              ? "Listening to your voice"
              : "Tap to speak your health question"
          }
          className={`w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-300/50 ${
            isListening
              ? "bg-gradient-to-br from-red-400 to-pink-500 animate-pulse"
              : "bg-gradient-to-br from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600"
          } flex items-center justify-center group`}
        >
          {isProcessing ? (
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white animate-spin" />
          ) : (
            <Mic className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white group-hover:scale-110 transition-transform" />
          )}
        </button>
        {hasRecordingStarted && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={handlePauseResume}
              disabled={isStopDisabled}
              className={`px-4 py-2 text-white rounded-full shadow hover:bg-yellow-600 transition ${
                isStopDisabled
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={handleStopRecording}
              disabled={isStopDisabled}
              className={`px-4 py-2 rounded-full shadow transition text-white ${
                isStopDisabled
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Stop
            </button>
          </div>
        )}

        <div className="mt-3 sm:mt-4 text-center px-4">
          <p className="text-base sm:text-lg font-semibold text-gray-700">
            {isListening ? "Listening..." : "Tap to Speak"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {isListening ? "सुन रहा हूँ..." : "बोलने के लिए दबाएं"}
          </p>
          {!isListening && !isProcessing && (
            <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
              Hold and speak clearly about your health concern
            </p>
          )}
        </div>
      </div>

      {/* Chat Container */}
      {messages.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/30 mx-2 sm:mx-0">
          {/* Chat Header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200/50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                Health Consultation
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                स्वास्थ्य परामर्श
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 sm:space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className="w-full">
                <div
                  className={`${
                    msg.type === "user" ? "ml-0 sm:ml-8" : "mr-0 sm:mr-8"
                  }`}
                >
                  <div
                    className={`p-4 sm:px-6 sm:py-5 rounded-xl sm:rounded-2xl shadow-md ${
                      msg.type === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-gradient-to-br from-gray-50 to-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-base sm:text-lg flex-shrink-0">
                          {msg.type === "user" ? "🧍‍♀️" : "🤖"}
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            msg.type === "user"
                              ? "text-blue-100"
                              : "text-gray-600"
                          }`}
                        >
                          {msg.type === "user"
                            ? "You said:"
                            : "Health Assistant:"}
                        </span>
                      </div>
                      {msg.type === "bot" && (
                        <button
                          onClick={() => handlePlayAudio(msg.message)}
                          aria-label="Play audio response"
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors group flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-teal-300"
                        >
                          <Volume2 className="w-4 h-4 text-gray-600 group-hover:text-teal-600" />
                        </button>
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className={`pl-4 sm:pl-8 ${
                        msg.type === "user"
                          ? "border-l-2 border-blue-300"
                          : "border-l-2 border-teal-300"
                      }`}
                    >
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          msg.type === "user" ? "text-white" : "text-gray-800"
                        }`}
                      >
                        "{msg.message}"
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div className="mt-2 sm:mt-3 text-right">
                      <span
                        className={`text-xs ${
                          msg.type === "user"
                            ? "text-blue-200"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions Footer */}
          <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200/50">
            <div className="flex flex-wrap gap-2 justify-center">
              <button className="px-3 py-1.5 text-xs bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300">
                Ask Another Question
              </button>
              <button className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300">
                Save Advice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInteraction;
