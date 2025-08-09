import React, { useState, useEffect } from 'react';

const ClozeView = ({ question, onAnswerChange }) => {
  // State to track which blank index is currently selected
  const [selectedBlankIndex, setSelectedBlankIndex] = useState(null);
  
  // State to track which word is placed in which blank
  const [placedAnswers, setPlacedAnswers] = useState({});

  // This effect updates the parent's answer state whenever the user's answers change
  useEffect(() => {
    const finalAnswers = question.sentence.split('__BLANK__').slice(0, -1).map((_, index) => {
      return placedAnswers[index] || '';
    });
    onAnswerChange(question._id, finalAnswers);
  }, [placedAnswers, question, onAnswerChange]);

  // Function to handle when a user clicks on a blank space
  const handleBlankSelect = (blankIndex) => {
    // If the blank already has an answer, move the answer back to the word bank
    if (placedAnswers[blankIndex]) {
      const wordToUnassign = placedAnswers[blankIndex];
      const newPlacedAnswers = { ...placedAnswers };
      delete newPlacedAnswers[blankIndex];
      setPlacedAnswers(newPlacedAnswers);
      // Deselect any active blank
      setSelectedBlankIndex(null);
    } else {
      // Otherwise, select the blank
      setSelectedBlankIndex(prev => (prev === blankIndex ? null : blankIndex));
    }
  };

  // Function to handle when a user clicks on a word from the word bank
  const handleWordSelect = (word) => {
    // We can only place a word if a blank is currently selected
    if (selectedBlankIndex !== null) {
      setPlacedAnswers(prev => ({
        ...prev,
        [selectedBlankIndex]: word,
      }));
      // After placing the word, deselect the blank
      setSelectedBlankIndex(null);
    }
  };

  const sentenceParts = question.sentence.split('__BLANK__');
  // Filter out words from the bank that have already been placed in a blank
  const availableWords = question.options.filter(word => !Object.values(placedAnswers).includes(word));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-1">Complete the sentence:</h3>
      <p className="text-sm text-gray-600 mb-6">
        {selectedBlankIndex !== null ? 'Now, select a word from the Word Bank below.' : 'Click a blank space to select it.'}
      </p>

      {/* --- The Sentence with Clickable Blanks --- */}
      <div className="flex flex-wrap items-center gap-x-2 text-xl mb-8 p-4 bg-gray-50 rounded-lg">
        {sentenceParts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < sentenceParts.length - 1 && (
              <button
                onClick={() => handleBlankSelect(index)}
                className={`inline-block align-middle rounded-md transition-all duration-200 border-2 text-center font-semibold ${
                  selectedBlankIndex === index 
                  ? 'border-blue-500 scale-105' 
                  : 'border-gray-300 border-dashed'
                }`}
                style={{ minWidth: '120px', minHeight: '44px' }}
              >
                {placedAnswers[index] ? (
                  <span className="text-blue-700">{placedAnswers[index]}</span>
                ) : (
                  <span className="text-gray-400">...</span>
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* --- The Clickable Word Bank --- */}
      <div className="p-4 rounded-lg border-2 border-dashed border-gray-300">
        <h4 className="font-bold text-center mb-3">Word Bank</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {availableWords.length > 0 ? availableWords.map((word) => (
            <button
              key={word}
              onClick={() => handleWordSelect(word)}
              disabled={selectedBlankIndex === null}
              className={`p-3 rounded-md shadow transition-colors ${
                selectedBlankIndex !== null 
                ? 'bg-white hover:bg-blue-100 cursor-pointer' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {word}
            </button>
          )) : (
            <p className="text-gray-400">All words have been used.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClozeView;