import React, { useState, useEffect, useRef } from 'react';

interface TypingTextProps {
  words: string[];
}

const TypingText: React.FC<TypingTextProps> = ({ words }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState(words[0]?.substring(0, 1) || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const intervalIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    // Start by showing first letter immediately
    if (currentText === '') {
      setCurrentText(words[0]?.substring(0, 1) || '');
    }
    
    const currentWord = words[currentWordIndex];
    
    const animateText = () => {
      if (!isDeleting && currentText !== currentWord) {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        intervalIdRef.current = setTimeout(animateText, 80);
      } else if (!isDeleting && currentText === currentWord) {
        intervalIdRef.current = setTimeout(() => {
          setIsDeleting(true);
          animateText();
        }, 2000);
      } else if (isDeleting && currentText !== '') {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        intervalIdRef.current = setTimeout(animateText, 40);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((currentWordIndex + 1) % words.length);
        intervalIdRef.current = setTimeout(animateText, 200);
      }
    };
    
    intervalIdRef.current = setTimeout(animateText, 10);
    
    return () => {
      if (intervalIdRef.current) {
        clearTimeout(intervalIdRef.current);
      }
    };
  }, [currentText, currentWordIndex, isDeleting, words]);
  
  // For performance, pre-calculate the gradient style
  const gradientStyle = "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400";
  
  return (
    <div className="inline-flex items-baseline">
      <span className={`text-4xl sm:text-6xl md:text-7xl font-bold ${gradientStyle}`}>
        {currentText}
        <span className="animate-blink">|</span>
      </span>
    </div>
  );
};

export default TypingText; 