import React, { useState } from 'react';
import axios from 'axios';
import QuestionList from '../components/QuestionList';

// --- CLOUDINARY CONFIGURATION ---
const CLOUD_NAME = "YOUR_CLOUD_NAME"; // <-- Replace with your Cloudinary Cloud Name
const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // <-- Replace with your Upload Preset Name

const FormBuilder = () => {
    const [title, setTitle] = useState('');
    const [headerImage, setHeaderImage] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [savedFormLink, setSavedFormLink] = useState(null);

    // Reusable function to upload an image to Cloudinary
    const handleImageUpload = async (file) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData
            );
            setIsUploading(false);
            return response.data.secure_url;
        } catch (error) {
            console.error('Image upload failed:', error);
            setIsUploading(false);
            return null;
        }
    };

    // Function to handle header image selection and upload
    const onHeaderImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = await handleImageUpload(file);
            if (imageUrl) {
                setHeaderImage(imageUrl);
            }
        }
    };

    // Function to add a new, blank question to the state
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                type: 'Categorize',
                questionText: '',
                // Initialize other fields based on default type if needed
            },
        ]);
    };

    // Function to save the form to the backend
    const handleSaveForm = async () => {
        if (!title) {
            alert('Please enter a form title.');
            return;
        }
        try {
            const formStructure = { title, headerImage, questions };
            const response = await axios.post('http://localhost:5000/api/forms', formStructure);
            setSavedFormLink(`/forms/${response.data._id}`);
            alert(`Form saved successfully! Form ID: ${response.data._id}`);
        } catch (error) {
            console.error('Error saving form:', error);
            alert('Failed to save the form. Check the console for details.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            {/* --- App Header --- */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900">Form Builder</h1>
                    <button
                        onClick={handleSaveForm}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg transition-all transform hover:scale-105"
                    >
                        Save Form
                    </button>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="max-w-4xl mx-auto p-4 sm:p-8">
                {savedFormLink ? (
                    <div className="p-6 bg-green-50 border-l-4 border-green-500 text-green-800 mb-8 rounded-r-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-2">Form Saved!</h2>
                        <p className="mb-2">Your form has been saved successfully.</p>
                        <a
                            href={savedFormLink}
                            className="text-blue-600 underline font-semibold"
                        >
                            View Form
                        </a>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* --- Form Title & Header Card --- */}
                        <div className="bg-white p-8 rounded-2xl shadow-md">
                            <input
                                type="text"
                                placeholder="Form Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-4xl font-bold border-none focus:ring-0 p-0 mb-6"
                            />
                            <div className="h-px bg-slate-200 my-4"></div>
                            <label className="block text-lg font-medium text-slate-700 mb-2">Header Image</label>
                            {headerImage && <img src={headerImage} alt="Form Header" className="w-full h-48 object-cover rounded-lg mb-4"/>}
                            <input type="file" onChange={onHeaderImageChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                            {isUploading && <p className="text-blue-500 text-sm mt-2">Uploading...</p>}
                        </div>
                        
                        <QuestionList questions={questions} setQuestions={setQuestions} handleImageUpload={handleImageUpload} />

                        <div className="flex justify-center mt-8">
                            <button
                                onClick={addQuestion}
                                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                            >
                                + Add Question
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FormBuilder;