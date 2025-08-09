import React, { useState, useEffect } from 'react';

const CategorizeView = ({ question, onAnswerChange }) => {
  // State to track which item is currently selected by the user
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  // State to track where each item is assigned.
  // The key is the item's ID, and the value is the category name.
  const [assignments, setAssignments] = useState({});

  // This effect runs whenever the assignments change to update the parent's answer state
  useEffect(() => {
    onAnswerChange(question._id, assignments);
  }, [assignments, question._id, onAnswerChange]);

  // Function to handle when a user clicks on an item
  const handleItemSelect = (itemId) => {
    // If the same item is clicked again, deselect it. Otherwise, select the new item.
    setSelectedItemId(prev => (prev === itemId ? null : itemId));
  };

  // Function to handle when a user clicks on a category box
  const handleCategorySelect = (categoryName) => {
    // We can only assign if an item is currently selected
    if (selectedItemId) {
      setAssignments(prev => ({
        ...prev,
        [selectedItemId]: categoryName,
      }));
      // After assigning, deselect the item so the user can pick another one
      setSelectedItemId(null);
    }
  };

  // Helper to get all items that haven't been assigned to a category yet
  const unassignedItems = question.items.filter(item => !assignments[item._id]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-1">Categorize the following items:</h3>
      <p className="text-sm text-gray-600 mb-4">
        {selectedItemId ? 'Now, click on a category below to assign it.' : 'Click on an item to select it.'}
      </p>

      {/* --- Unassigned Items Pool --- */}
      <div className="p-4 rounded-lg bg-gray-100 mb-6">
        <h4 className="font-bold mb-3 text-center">Items to Categorize</h4>
        <div className="flex flex-wrap justify-center gap-3">
          {unassignedItems.length > 0 ? unassignedItems.map(item => (
            <button
              key={item._id}
              onClick={() => handleItemSelect(item._id)}
              className={`p-3 rounded-md shadow transition-transform duration-200 ${
                selectedItemId === item._id 
                ? 'bg-blue-500 text-white scale-110' 
                : 'bg-white hover:bg-gray-50'
              }`}
            >
              {item.text}
            </button>
          )) : <p className="text-gray-500">All items have been categorized!</p>}
        </div>
      </div>

      {/* --- Category Boxes --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {question.categories.map(category => (
          <div
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedItemId ? 'cursor-pointer border-dashed border-blue-400 hover:bg-blue-50' : 'border-solid border-gray-200'
            }`}
            style={{ minHeight: '150px' }}
          >
            <h4 className="font-bold mb-4 text-center">{category}</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {/* Find and display all items assigned to this category */}
              {question.items.filter(item => assignments[item._id] === category).map(assignedItem => (
                <div key={assignedItem._id} className="p-2 rounded-md bg-green-100 text-green-800 text-sm">
                  {assignedItem.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorizeView;