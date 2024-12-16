import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useAnonymousSession = () => {
  const [sessionId, setSessionId] = useState('');
  const [hasOptimized, setHasOptimized] = useState(false);

  useEffect(() => {
    const storedSessionId = localStorage.getItem('anonymousSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      const hasOptimizedBefore = localStorage.getItem('hasOptimized') === 'true';
      setHasOptimized(hasOptimizedBefore);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('anonymousSessionId', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const markAsOptimized = () => {
    localStorage.setItem('hasOptimized', 'true');
    setHasOptimized(true);
  };

  return {
    sessionId,
    hasOptimized,
    markAsOptimized
  };
};