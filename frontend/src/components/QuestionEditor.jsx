import React, { useState } from 'react';

const QuestionEditor = ({ question, index, updateQuestion, removeQuestion, handleImageUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  // --- HELPER FUNCTIONS for updating nested state ---

  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    updateQuestion(index, { ...question, [name]: value });
  };
  
  // --- COMPREHENSION HELPERS ---
  const handleMcqChange = (mcqIndex, field, value) => {
    const mcqs = [...(question.mcqs || [])];
    mcqs[mcqIndex] = { ...mcqs[mcqIndex], [field]: value };
    updateQuestion(index, { ...question, mcqs });
  };
  const addMcq = () => {
    const mcqs = [...(question.mcqs || []), { question: '', options: ['', ''], correctAnswer: '' }];
    updateQuestion(index, { ...question, mcqs });
  };

  // --- CATEGORIZE HELPERS ---
  const handleCategoryChange = (catIndex, value) => {
    const categories = [...(question.categories || [])];
    categories[catIndex] = value;
    updateQuestion(index, { ...question, categories });
  };
  const addCategory = () => {
    const categories = [...(question.categories || []), ''];
    updateQuestion(index, { ...question, categories });
  };
  const handleItemChange = (itemIndex, field, value) => {
    const items = [...(question.items || [])];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    updateQuestion(index, { ...question, items });
  };
  const addItem = () => {
    const items = [...(question.items || []), { text: '', category: '' }];
    updateQuestion(index, { ...question, items });
  };

  // --- NEW: CLOZE (FILL-IN-THE-BLANK) HELPERS ---
  const handleClozeOptionChange = (optionIndex, value) => {
    const options = [...(question.options || [])];
    options[optionIndex] = value;
    updateQuestion(index, { ...question, options });
  };
  const addClozeOption = () => {
    const options = [...(question.options || []), ''];
    updateQuestion(index, { ...question, options });
  };
  const removeClozeOption = (optionIndex) => {
    const options = [...(question.options || [])].filter((_, i) => i !== optionIndex);
    updateQuestion(index, { ...question, options });
  };

  const onQuestionImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        updateQuestion(index, { ...question, image: imageUrl });
      }
      setIsUploading(false);
    }
  };

  // --- RENDER FUNCTION for specific fields ---
  const renderQuestionTypeFields = () => {
    switch (question.type) {
      case 'Categorize':
        return (
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Categories</h4>
              {(question.categories || []).map((cat, catIndex) => (
                <input
                  key={catIndex}
                  type="text"
                  placeholder={`Category ${catIndex + 1}`}
                  value={cat}
                  onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
              ))}
              <button onClick={addCategory} className="text-blue-600 text-sm mt-1">+ Add Category</button>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Items</h4>
              {(question.items || []).map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Item ${itemIndex + 1}`}
                    value={item.text}
                    onChange={(e) => handleItemChange(itemIndex, 'text', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              ))}
              <button onClick={addItem} className="text-blue-600 text-sm mt-1">+ Add Item</button>
            </div>
          </div>
        );

      // --- UPDATED: UI for Cloze Questions ---
      case 'Cloze':
        return (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sentence with Blanks</label>
              <textarea
                name="sentence"
                placeholder="Enter the sentence. Use __BLANK__ for blanks."
                value={question.sentence || ''}
                onChange={handleSimpleChange}
                className="w-full p-2 border rounded-md mt-1"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Word Bank Options</label>
              <p className="text-xs text-gray-500">Add the words that the user can drag into the blanks.</p>
              <div className="mt-2 space-y-2">
                {(question.options || []).map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => handleClozeOptionChange(optionIndex, e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                    <button onClick={() => removeClozeOption(optionIndex)} className="text-red-500 hover:text-red-700 font-semibold">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addClozeOption} className="text-blue-600 text-sm mt-2">+ Add Option</button>
            </div>
          </div>
        );

      case 'Comprehension':
        return (
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">Passage</label>
            <textarea
              name="passage"
              placeholder="Enter the comprehension passage here..."
              value={question.passage || ''}
              onChange={handleSimpleChange}
              className="w-full p-2 border rounded-md"
              rows="6"
            />
            <div>
              <h4 className="font-semibold mt-4 mb-2">Multiple Choice Questions</h4>
              {(question.mcqs || []).map((mcq, mcqIndex) => (
                <div key={mcqIndex} className="p-3 border rounded-md mb-3 bg-gray-50">
                   <input
                    type="text"
                    placeholder={`MCQ ${mcqIndex + 1} Question`}
                    value={mcq.question}
                    onChange={(e) => handleMcqChange(mcqIndex, 'question', e.target.value)}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                  {/* For simplicity, we'll handle options as a comma-separated string */}
                   <input
                    type="text"
                    placeholder="Options, separated by commas"
                    value={(mcq.options || []).join(',')}
                    onChange={(e) => handleMcqChange(mcqIndex, 'options', e.target.value.split(','))}
                    className="w-full p-2 border rounded-md mb-2"
                  />
                </div>
              ))}
              <button onClick={addMcq} className="text-blue-600 text-sm mt-1">+ Add MCQ</button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Question {index + 1}</h3>
        <button
          onClick={() => removeQuestion(index)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm"
        >
          Delete
        </button>
      </div>

      {/* --- QUESTION IMAGE UI --- */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Image (Optional)</label>
        {question.image && <img src={question.image} alt="Question" className="w-full h-40 object-cover rounded-md mb-2"/>}
        <input type="file" onChange={onQuestionImageChange} className="text-sm" />
        {isUploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
        <select
          name="type"
          value={question.type}
          onChange={handleSimpleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="Categorize">Categorize</option>
          <option value="Cloze">Cloze (Fill in the blanks)</option>
          <option value="Comprehension">Comprehension</option>
        </select>
      </div>
      
      {/* We've removed the common 'questionText' field to be more specific inside each type if needed */}
      
      {renderQuestionTypeFields()}
    </div>
  );
};

export default QuestionEditor;