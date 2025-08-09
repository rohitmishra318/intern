import React from 'react';

const ComprehensionView = ({ question, onAnswerChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Display Question Image if it exists */}
      {question.image && <img src={question.image} alt="Question context" className="w-full rounded-md mb-4" />}
      
      <h3 className="text-lg font-semibold mb-4">Read the passage and answer the questions below:</h3>
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <p className="whitespace-pre-wrap">{question.passage}</p>
      </div>

      {question.mcqs.map((mcq) => (
        <div key={mcq._id} className="mb-4">
          <p className="font-semibold mb-2">{mcq.question}</p>
          <div className="space-y-2">
            {mcq.options.map((option, optIndex) => (
              <label key={optIndex} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <input
                  type="radio"
                  name={mcq._id}
                  value={option}
                  onChange={(e) => onAnswerChange(mcq._id, e.target.value)}
                  className="form-radio"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComprehensionView;