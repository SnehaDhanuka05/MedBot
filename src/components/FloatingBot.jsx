import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Bot,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function FloatingBot() {
  const { isAgreed, selectedBodyPart } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message when agreed
  useEffect(() => {
    if (isAgreed && messages.length === 0) {
      setMessages([
        {
          role: 'bot',
          content:
            "Hello! I'm **Somatic**, your educational health companion. 🩺\n\nClick on a body part (head, chest, or stomach) on the 3D model, then tell me your symptoms using the microphone or type them below.\n\n*Remember: I'm an AI, not a doctor!*",
          type: 'text',
        },
      ]);
    }
  }, [isAgreed]);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content:
            'Speech recognition is not supported in your browser. Please type your symptoms instead.',
          type: 'error',
        },
      ]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interimTranscript += t;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const speakText = useCallback(
    (text) => {
      if (isMuted) return;
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(
        (v) => v.name.includes('Samantha') || v.name.includes('Google')
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    },
    [isMuted]
  );

  const toggleMute = () => {
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  const sendMessage = useCallback(
    async (userText) => {
      if (!userText.trim()) return;

      const bodyPart = selectedBodyPart || 'unspecified area';

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: userText, type: 'text' },
      ]);
      setTranscript('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bodyPart, userText }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const parsed = await response.json();

        const botMessage = {
          role: 'bot',
          content: parsed,
          type: 'health_response',
        };

        setMessages((prev) => [...prev, botMessage]);

        // Read aloud
        const speechText = `${parsed.educational_summary}. Here are some wellness tips: ${parsed.wellness_tips?.join('. ') || ''}. ${parsed.disclaimer}`;
        speakText(speechText);
      } catch (error) {
        console.error('Gemini API error:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            content:
              'I encountered an issue connecting to my AI backend. Please try again shortly.',
            type: 'error',
          },
        ]);
      }

      setIsLoading(false);
    },
    [selectedBodyPart, speakText]
  );

  const handleSend = () => {
    if (transcript.trim()) {
      sendMessage(transcript);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Bot position: center when consent modal showing, bottom-right after agreement
  const botVariants = {
    center: {
      bottom: '50%',
      right: '50%',
      x: '50%',
      y: '50%',
      scale: 1,
    },
    corner: {
      bottom: 80,
      right: 24,
      x: 0,
      y: 0,
      scale: 1,
    },
  };

  return (
    <>
      {/* Floating Bot Icon */}
      <motion.div
        className="fixed z-50"
        initial="center"
        animate={isAgreed ? 'corner' : 'center'}
        variants={botVariants}
        transition={{ type: 'spring', stiffness: 80, damping: 20, duration: 0.8 }}
      >
        <motion.button
          id="floating-bot-toggle"
          onClick={() => isAgreed && setIsOpen(!isOpen)}
          className="relative group"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #10b981)',
            border: '2px solid rgba(255,255,255,0.25)',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isAgreed ? 'pointer' : 'default',
            color: 'white',
            outline: 'none',
          }}
        >
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {isOpen ? <X size={24} /> : <Bot size={26} />}
          </motion.div>

          {/* Pulse ring */}
          {!isOpen && isAgreed && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid rgba(139, 92, 246, 0.5)',
              }}
              animate={{
                scale: [1, 1.5],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          )}
        </motion.button>

        {/* Selected body part badge */}
        {selectedBodyPart && isAgreed && !isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-2 -left-2 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: 'linear-gradient(135deg, #10b981, #34d399)',
              color: 'white',
              fontSize: '10px',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
            }}
          >
            {selectedBodyPart}
          </motion.div>
        )}
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && isAgreed && (
          <motion.div
            id="chat-panel"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-40"
            style={{
              bottom: 152,
              right: 24,
              width: 400,
              maxHeight: '65vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 20,
              background: 'rgba(15, 10, 30, 0.75)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow:
                '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Chat Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #10b981)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={18} color="white" />
                </div>
                <div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 600,
                      margin: 0,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Somatic AI
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: 11,
                      margin: 0,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {selectedBodyPart
                      ? `Analyzing: ${selectedBodyPart}`
                      : 'Click a body part to start'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleMute}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: 8,
                  padding: 6,
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                minHeight: 200,
                maxHeight: 'calc(65vh - 140px)',
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  {msg.type === 'health_response' && msg.role === 'bot' ? (
                    <HealthResponseCard data={msg.content} />
                  ) : (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius:
                          msg.role === 'user'
                            ? '16px 16px 4px 16px'
                            : '16px 16px 16px 4px',
                        background:
                          msg.role === 'user'
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                            : msg.type === 'error'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(255,255,255,0.08)',
                        color: 'white',
                        fontSize: 13,
                        lineHeight: 1.5,
                        fontFamily: 'Inter, sans-serif',
                        border:
                          msg.type === 'error'
                            ? '1px solid rgba(239, 68, 68, 0.3)'
                            : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {msg.content.split('\n').map((line, j) => (
                        <span key={j}>
                          {line.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, k) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong key={k}>{part.slice(2, -2)}</strong>
                              );
                            }
                            if (part.startsWith('*') && part.endsWith('*')) {
                              return <em key={k}>{part.slice(1, -1)}</em>;
                            }
                            return part;
                          })}
                          {j < msg.content.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '12px 18px',
                    borderRadius: '16px 16px 16px 4px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    gap: 6,
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#8b5cf6',
                      }}
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <button
                id="mic-button"
                onClick={isListening ? stopListening : startListening}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: 'none',
                  background: isListening
                    ? 'linear-gradient(135deg, #ef4444, #f97316)'
                    : 'rgba(255,255,255,0.08)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {isListening ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <MicOff size={16} />
                  </motion.div>
                ) : (
                  <Mic size={16} />
                )}
              </button>

              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedBodyPart
                    ? `Describe your ${selectedBodyPart} symptoms...`
                    : 'Select a body part first...'
                }
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />

              <button
                id="send-button"
                onClick={handleSend}
                disabled={!transcript.trim() || isLoading}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: 'none',
                  background:
                    transcript.trim() && !isLoading
                      ? 'linear-gradient(135deg, #8b5cf6, #10b981)'
                      : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor:
                    transcript.trim() && !isLoading ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  opacity: transcript.trim() && !isLoading ? 1 : 0.3,
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HealthResponseCard({ data }) {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)',
      }}
    >
      {/* Summary */}
      <div style={{ padding: '14px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 8,
          }}
        >
          <Sparkles size={13} color="#a78bfa" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#a78bfa',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Educational Summary
          </span>
        </div>
        <p
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 13,
            lineHeight: 1.6,
            margin: 0,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {data.educational_summary}
        </p>
      </div>

      {/* Tips */}
      {data.wellness_tips && data.wellness_tips.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(16, 185, 129, 0.06)',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#34d399',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Wellness Tips
          </span>
          <ul
            style={{
              margin: '8px 0 0',
              padding: '0 0 0 16px',
              listStyle: 'none',
            }}
          >
            {data.wellness_tips.map((tip, i) => (
              <li
                key={i}
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: 12,
                  lineHeight: 1.6,
                  fontFamily: 'Inter, sans-serif',
                  position: 'relative',
                  paddingLeft: 4,
                  marginBottom: 4,
                }}
              >
                <span style={{ color: '#34d399', marginRight: 6 }}>✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(245, 158, 11, 0.06)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <AlertTriangle
          size={13}
          color="#f59e0b"
          style={{ flexShrink: 0, marginTop: 2 }}
        />
        <p
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: 11,
            lineHeight: 1.5,
            margin: 0,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {data.disclaimer}
        </p>
      </div>
    </div>
  );
}
