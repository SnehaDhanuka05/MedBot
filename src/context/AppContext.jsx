import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [gender, setGender] = useState('male');
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);

  return (
    <AppContext.Provider
      value={{
        gender,
        setGender,
        selectedBodyPart,
        setSelectedBodyPart,
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
