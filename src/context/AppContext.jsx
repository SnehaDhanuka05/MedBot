import { createContext, useCallback, useContext, useRef, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [gender, setGender] = useState('male');
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [painLevel, setPainLevel] = useState(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [savedSymptoms, setSavedSymptoms] = useState([]);
  const [analysisRequest, setAnalysisRequest] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return false;
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
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setIssueDescription(finalTranscript || interimTranscript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    return true;
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const saveCurrentSymptom = useCallback(() => {
    if (!selectedBodyPart || !painLevel) {
      return false;
    }

    setSavedSymptoms((prev) => [
      ...prev,
      {
        bodyPart: selectedBodyPart,
        painLevel,
        description: issueDescription.trim(),
      },
    ]);
    setSelectedBodyPart(null);
    setPainLevel(null);
    setIssueDescription('');
    return true;
  }, [issueDescription, painLevel, selectedBodyPart]);

  const startNewSymptom = useCallback(() => {
    setSelectedBodyPart(null);
    setPainLevel(null);
    setIssueDescription('');
  }, []);

  const requestAnalysis = useCallback(() => {
    if (savedSymptoms.length === 0) {
      return false;
    }

    setAnalysisRequest({
      id: `${Date.now()}`,
      symptoms: savedSymptoms,
    });
    return true;
  }, [savedSymptoms]);

  return (
    <AppContext.Provider
      value={{
        gender,
        setGender,
        selectedBodyPart,
        setSelectedBodyPart,
        painLevel,
        setPainLevel,
        issueDescription,
        setIssueDescription,
        savedSymptoms,
        setSavedSymptoms,
        analysisRequest,
        setAnalysisRequest,
        saveCurrentSymptom,
        startNewSymptom,
        requestAnalysis,
        isListening,
        startListening,
        stopListening,
        isAgreed,
        setIsAgreed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
