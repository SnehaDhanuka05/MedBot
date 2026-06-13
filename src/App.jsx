import { useAppContext } from './context/AppContext';
import BodyCanvas from './components/BodyCanvas';
import FloatingBot from './components/FloatingBot';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Info, HeartPulse, Mic, MicOff } from 'lucide-react';

function ConsentModal() {
  const { setIsAgreed } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-30 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        id="consent-modal"
        style={{
          maxWidth: 460,
          width: '90%',
          borderRadius: 24,
          background: 'rgba(15, 10, 30, 0.8)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow:
            '0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          padding: '36px 32px 28px',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 30px rgba(139, 92, 246, 0.35)',
          }}
        >
          <Shield size={28} color="white" />
        </motion.div>

        <h2
          style={{
            color: 'white',
            fontSize: 22,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            margin: '0 0 8px',
          }}
        >
          Before We Begin
        </h2>

        <p
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 12,
            fontFamily: 'Inter, sans-serif',
            margin: '0 0 20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: 500,
          }}
        >
          Important Disclaimer
        </p>

        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '20px',
            marginBottom: 24,
            textAlign: 'left',
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: 14,
              lineHeight: 1.7,
              fontFamily: 'Inter, sans-serif',
              margin: 0,
            }}
          >
            I am an{' '}
            <span style={{ color: '#a78bfa', fontWeight: 600 }}>
              AI educational companion
            </span>
            , not a doctor. I make mistakes. Your data is processed anonymously.
          </p>
          <div
            style={{
              height: 1,
              background: 'rgba(255,255,255,0.06)',
              margin: '14px 0',
            }}
          />
          <p
            style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 13,
              lineHeight: 1.6,
              fontFamily: 'Inter, sans-serif',
              margin: 0,
            }}
          >
            Please{' '}
            <span style={{ color: '#34d399', fontWeight: 600 }}>
              consult a doctor
            </span>{' '}
            for medical advice. This tool is for educational purposes only.
          </p>
        </div>

        <motion.button
          id="agree-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAgreed(true)}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: 14,
            border: 'none',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #10b981)',
            color: 'white',
            fontSize: 15,
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.35)',
            transition: 'box-shadow 0.3s',
          }}
        >
          I Understand & Agree
        </motion.button>

        <p
          style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: 11,
            fontFamily: 'Inter, sans-serif',
            marginTop: 14,
          }}
        >
          By clicking, you acknowledge this is not medical advice
        </p>
      </motion.div>
    </motion.div>
  );
}

function Header() {
  const { gender, setGender } = useAppContext();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-20"
      style={{
        height: 64,
        background: 'rgba(15, 10, 30, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #8b5cf6, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          }}
        >
          <HeartPulse size={18} color="white" />
        </div>
        <h1
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          Somatic
        </h1>
        <span
          style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: 10,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginLeft: 4,
            marginTop: 2,
          }}
        >
          AI Companion
        </span>
      </div>

      {/* Gender Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 12,
          padding: 4,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <button
          id="male-toggle"
          onClick={() => setGender('male')}
          style={{
            padding: '8px 16px',
            borderRadius: 9,
            border: 'none',
            background:
              gender === 'male'
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : 'transparent',
            color: gender === 'male' ? 'white' : 'rgba(255,255,255,0.45)',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.25s',
            boxShadow:
              gender === 'male'
                ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                : 'none',
          }}
        >
          ♂ Male
        </button>
        <button
          id="female-toggle"
          onClick={() => setGender('female')}
          style={{
            padding: '8px 16px',
            borderRadius: 9,
            border: 'none',
            background:
              gender === 'female'
                ? 'linear-gradient(135deg, #ec4899, #f472b6)'
                : 'transparent',
            color: gender === 'female' ? 'white' : 'rgba(255,255,255,0.45)',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.25s',
            boxShadow:
              gender === 'female'
                ? '0 4px 12px rgba(236, 72, 153, 0.3)'
                : 'none',
          }}
        >
          ♀ Female
        </button>
      </div>
    </motion.header>
  );
}

function Footer() {
  return (
    <motion.footer
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-20"
      style={{
        height: 48,
        background: 'rgba(15, 10, 30, 0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        padding: '0 24px',
      }}
    >
      <button
        id="meet-team-link"
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.45)',
          fontSize: 12,
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'color 0.2s',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')
        }
      >
        <Users size={14} />
        Meet the Team
      </button>
      <div
        style={{
          width: 1,
          height: 16,
          background: 'rgba(255,255,255,0.1)',
        }}
      />
      <button
        id="about-us-link"
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.45)',
          fontSize: 12,
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'color 0.2s',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')
        }
      >
        <Info size={14} />
        About Us
      </button>
    </motion.footer>
  );
}

function MainInterface() {
  const {
    selectedBodyPart,
    painLevel,
    setPainLevel,
    issueDescription,
    savedSymptoms,
    saveCurrentSymptom,
    startNewSymptom,
    requestAnalysis,
    isListening,
    startListening,
    stopListening,
  } = useAppContext();

  const painLevels = Array.from({ length: 10 }, (_, index) => index + 1);

  return (
    <div className="w-full h-full">
      <BodyCanvas />

      {/* Selected body part indicator */}
      <AnimatePresence>
        {(selectedBodyPart || savedSymptoms.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed z-10"
            style={{
              top: 76,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(92vw, 640px)',
              background: 'rgba(15, 10, 30, 0.72)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 18,
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: 'rgba(255,255,255,0.82)',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#34d399',
                    boxShadow: '0 0 8px rgba(52, 211, 153, 0.5)',
                    flexShrink: 0,
                  }}
                />
                {selectedBodyPart ? 'Selected body part:' : 'Saved symptoms'}
                {selectedBodyPart ? (
                  <span style={{ color: '#a78bfa' }}>
                    {selectedBodyPart.charAt(0).toUpperCase() +
                      selectedBodyPart.slice(1)}
                  </span>
                ) : null}
              </span>

              {selectedBodyPart && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 999,
                    padding: '8px 12px',
                    background: isListening
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(249, 115, 22, 0.9))'
                      : 'rgba(255,255,255,0.06)',
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  {isListening ? 'Stop speaking' : 'Describe by voice'}
                </button>
              )}
            </div>

            {selectedBodyPart && (
              <>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      gap: 8,
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255,255,255,0.72)',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Pain level
                    </span>
                    <span
                      style={{
                        color: '#c4b5fd',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {painLevel ? `${painLevel}/10 selected` : 'Choose 1 to 10'}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                      gap: 6,
                    }}
                  >
                    {painLevels.map((level) => {
                      const isSelected = painLevel === level;

                      return (
                        <button
                          key={level}
                          onClick={() => setPainLevel(level)}
                          style={{
                            minHeight: 38,
                            borderRadius: 12,
                            border: isSelected
                              ? '1px solid rgba(255,255,255,0.25)'
                              : '1px solid rgba(255,255,255,0.08)',
                            background: isSelected
                              ? 'linear-gradient(135deg, #8b5cf6, #10b981)'
                              : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: 13,
                            fontFamily: 'Inter, sans-serif',
                            cursor: 'pointer',
                            boxShadow: isSelected
                              ? '0 8px 18px rgba(139, 92, 246, 0.35)'
                              : 'none',
                          }}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    color: 'rgba(255,255,255,0.62)',
                    fontSize: 12,
                    lineHeight: 1.5,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {issueDescription
                    ? 'Your dictated description is ready to save.'
                    : 'Use the mic button above to describe the issue in your own words.'}
                </div>

                <button
                  onClick={saveCurrentSymptom}
                  disabled={!selectedBodyPart || !painLevel}
                  style={{
                    border: 'none',
                    borderRadius: 14,
                    padding: '12px 14px',
                    background:
                      selectedBodyPart && painLevel
                        ? 'linear-gradient(135deg, #10b981, #8b5cf6)'
                        : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    cursor:
                      selectedBodyPart && painLevel ? 'pointer' : 'not-allowed',
                    opacity: selectedBodyPart && painLevel ? 1 : 0.45,
                  }}
                >
                  Save symptom
                </button>
              </>
            )}

            {savedSymptoms.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  {savedSymptoms.map((symptom, index) => (
                    <div
                      key={`${symptom.bodyPart}-${symptom.painLevel}-${index}`}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.82)',
                        fontSize: 12,
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {symptom.bodyPart} • {symptom.painLevel}/10
                      {symptom.description ? ` • ${symptom.description}` : ''}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={startNewSymptom}
                    style={{
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 12,
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer',
                    }}
                  >
                    Add more symptoms
                  </button>
                  <button
                    onClick={requestAnalysis}
                    style={{
                      border: 'none',
                      borderRadius: 12,
                      padding: '10px 14px',
                      background: 'linear-gradient(135deg, #6366f1, #10b981)',
                      color: 'white',
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer',
                    }}
                  >
                    Done and analyze
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const { isAgreed } = useAppContext();

  return (
    <div
      className="relative w-full h-full"
      style={{
        background:
          'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7, #10b981, #6366f1)',
        backgroundSize: '300% 300%',
        animation: 'gradient-x 8s ease infinite',
      }}
    >
      {/* Noise overlay for texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.15), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(16, 185, 129, 0.1), transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <Header />

      <AnimatePresence mode="wait">
        {isAgreed ? (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <MainInterface />
          </motion.div>
        ) : (
          <ConsentModal key="consent" />
        )}
      </AnimatePresence>

      <Footer />
      <FloatingBot />
    </div>
  );
}
