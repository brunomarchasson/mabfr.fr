import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText(''); // Reset when the target text changes
  }, [text]);

  useEffect(() => {
    if (displayText.length < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, speed);
      return () => clearTimeout(timeoutId);
    }
  }, [displayText, text, speed]);

  return displayText;
};
