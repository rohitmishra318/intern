import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import useWindowSize from '../hooks/useWindowSize';

// Import the view components
import ComprehensionView from '../components/views/ComprehensionView';
import CategorizeView from '../components/views/CategorizeView';
import ClozeView from '../components/views/ClozeView';

const FormFiller = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/forms/${formId}`);
                setForm(response.data);
            } catch (err) {
                setError('Failed to load the form. Please check the URL.');
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [formId]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = async () => {
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
                questionId,
                answer,
            }));
            await axios.post(`http://localhost:5000/api/forms/${formId}/responses`, {
                answers: formattedAnswers,
            });
            setIsSubmitted(true);
        } catch (err) {
            alert('Failed to submit your response.');
            console.error('Submission error:', err);
        }
    };

    // The 'isSubmitted' success page remains the same, as it already has a great design.
    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <Confetti width={width} height={height} />
                <div className="bg-white p-10 md:p-12 rounded-2xl shadow-2xl text-center max-w-lg mx-auto">
                    {/* Animated Checkmark SVG */}
                    <svg className="w-24 h-24 text-green-500 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    
                    <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-2">Submission Received!</h1>
                    <p className="text-lg text-gray-600 mb-8">Thank you for your time. Your response has been recorded.</p>
                    
                    <Link 
                        to="/" 
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                    >
                        Create Your Own Form
                    </Link>
                </div>
            </div>
        );
    }

    // Redesigned form filling UI
    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            {/* --- App Header --- */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    {/* Link back to the builder home page */}
                    <Link to="/" className="text-2xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        Form Builder
                    </Link>
                </div>
            </header>

            {/* --- Main Content --- */}
            <main className="max-w-3xl mx-auto p-4 sm:p-8">
                {loading ? (
                    <p className="text-center mt-10 text-lg">Loading Form...</p>
                ) : error ? (
                    <p className="text-center text-red-500 mt-10 text-lg">{error}</p>
                ) : (
                    <div className="space-y-8">
                        {/* --- Form Header Card --- */}
                        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
                            {form.headerImage && (
                                <img
                                    src={form.headerImage}
                                    alt={form.title}
                                    className="w-full h-56 object-cover rounded-lg mb-6"
                                />
                            )}
                            <h1 className="text-4xl font-bold text-slate-800">{form.title}</h1>
                            <p className="text-lg text-slate-600 mt-2">Fill out the form below.</p>
                        </div>
                        
                        {/* --- Questions --- */}
                        {form.questions.map((question) => {
                            switch (question.type) {
                                case 'Comprehension':
                                    return <ComprehensionView key={question._id} question={question} onAnswerChange={handleAnswerChange} />;
                                case 'Categorize':
                                    return <CategorizeView key={question._id} question={question} onAnswerChange={handleAnswerChange} />;
                                case 'Cloze':
                                    return <ClozeView key={question._id} question={question} onAnswerChange={handleAnswerChange} />;
                                default:
                                    return <p key={question._id}>Unsupported question type.</p>;
                            }
                        })}

                        {/* --- Submit Button --- */}
                        <div className="text-center pt-4">
                            <button
                                onClick={handleSubmit}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                Submit Response
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FormFiller;