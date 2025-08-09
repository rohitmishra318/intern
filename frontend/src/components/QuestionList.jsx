import React from 'react';
import QuestionEditor from './QuestionEditor';

const QuestionList = ({ questions, setQuestions, handleImageUpload }) => { // Add handleImageUpload prop

  // Function to update a specific question in the array
  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  // Function to remove a question from the array
  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <div className="space-y-6 mt-8">
      {questions.map((question, index) => (
        <QuestionEditor
          key={index}
          question={question}
          index={index}
          updateQuestion={updateQuestion}
          removeQuestion={removeQuestion}
          handleImageUpload={handleImageUpload} // Pass the function down
        />
      ))}
    </div>
  );
};

export default QuestionList;