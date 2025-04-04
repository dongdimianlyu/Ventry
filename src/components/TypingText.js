import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypingText = ({
  words,
  baseText = '',
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 1500,
  className = '',
  baseTextClassName = '',
  typingTextClassName = '',
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // Use this to handle different phases of animation
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeouts when the component unmounts
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    // If we're typing and haven't reached the end of the word
    if (!isDeleting && currentText !== currentWord) {
      timeoutRef.current = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
      }, typingSpeed);
      return;
    }
    
    // If we're done typing, wait before starting to delete
    if (!isDeleting && currentText === currentWord) {
      timeoutRef.current = setTimeout(() => {
        setIsDeleting(true);
      }, delayBetweenWords);
      return;
    }
    
    // If we're deleting and haven't deleted everything
    if (isDeleting && currentText !== '') {
      timeoutRef.current = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
      }, deletingSpeed);
      return;
    }
    
    // If we've deleted everything, move to the next word
    if (isDeleting && currentText === '') {
      setIsVisible(false);
      timeoutRef.current = setTimeout(() => {
        setIsDeleting(false);
        setCurrentWordIndex((currentWordIndex + 1) % words.length);
        setIsVisible(true);
      }, 200); // Short delay for fade out/in effect
    }
  }, [currentText, currentWordIndex, delayBetweenWords, deletingSpeed, isDeleting, typingSpeed, words]);

  return (
    <div className={`${className} inline-flex items-baseline`}>
      {baseText && <span className={`${baseTextClassName} mr-2`}>{baseText}</span>}
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.span
            key={currentWordIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`${typingTextClassName} inline-block`}
          >
            {currentText}
            <span className="animate-blink">|</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TypingText; 