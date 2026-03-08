import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { PlusCircle, Trash2, Save } from 'lucide-react';

export const CreateTest = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main Test Details State
  const [testDetails, setTestDetails] = useState({
    title: '',
    subject: '',
    duration: '',
    year: '',
    passingMarks: '',
    availabilityHours:''
  });

  // Dynamic Questions Array State
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['A', 'B', 'C', 'D'], // Fixed option keys for mapping
      optionValues: { A: '', B: '', C: '', D: '' },
      correctAnswer: 'A',
    },
  ]);

  // --- Handlers for Test Details ---
  const handleDetailsChange = (e) => {
    setTestDetails({ ...testDetails, [e.target.name]: e.target.value });
  };

  // --- Handlers for Dynamic Questions ---
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['A', 'B', 'C', 'D'],
        optionValues: { A: '', B: '', C: '', D: '' },
        correctAnswer: 'A',
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      toast.error('A test must have at least one question.');
      return;
    }
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestionText = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const updateOptionValue = (qIndex, optKey, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].optionValues[optKey] = value;
    setQuestions(newQuestions);
  };

  const updateCorrectAnswer = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = value;
    setQuestions(newQuestions);
  };

 // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formattedQuestions = questions.map((q) => ({
        question: q.questionText,
        options: [
          q.optionValues.A,
          q.optionValues.B,
          q.optionValues.C,
          q.optionValues.D,
        ],
        correctAnswer: q.options.indexOf(q.correctAnswer), 
      }));

      const payload = {
        title: testDetails.title,
        subject: testDetails.subject,
        duration: Number(testDetails.duration),
        year: testDetails.year,
        passingMarks: Number(testDetails.passingMarks),
        availabilityHours: Number(testDetails.availabilityHours),
        questions: formattedQuestions,
      };

      await api.post('/tests/create', payload);
      toast.success('Test created successfully!');
      navigate('/teacher/tests/manage');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create test');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create New Test</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details and add your questions below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Test Details Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Test Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
              <input
                type="text"
                name="title"
                required
                value={testDetails.title}
                onChange={handleDetailsChange}
                placeholder="e.g., Midterm Exam"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                required
                value={testDetails.subject}
                onChange={handleDetailsChange}
                placeholder="e.g., Data Structures"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                required
                min="1"
                value={testDetails.duration}
                onChange={handleDetailsChange}
                placeholder="60"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Year</label>
              <select
                name="year"
                required
                value={testDetails.year}
                onChange={handleDetailsChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks</label>
              <input
                type="number"
                name="passingMarks"
                required
                min="1"
                value={testDetails.passingMarks}
                onChange={handleDetailsChange}
                placeholder="e.g., 40"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Hours</label>
              <input
                type="number"
                name="availabilityHours"
                required
                min="5"
                value={testDetails.availabilityHours}
                onChange={handleDetailsChange}
                placeholder="e.g., 12"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Questions ({questions.length})</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors font-medium text-sm"
            >
              <PlusCircle size={16} /> Add Question
            </button>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
              <div className="absolute top-4 right-4 text-gray-400">
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="hover:text-red-500 transition-colors p-1"
                  title="Remove Question"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="mb-4 pr-10">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Question {index + 1}
                </label>
                <textarea
                  required
                  rows="2"
                  value={q.questionText}
                  onChange={(e) => updateQuestionText(index, e.target.value)}
                  placeholder="Enter the question text here..."
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {q.options.map((optKey) => (
                  <div key={optKey} className="flex items-center gap-2">
                    <span className="font-medium text-gray-500 w-6 text-center">{optKey}.</span>
                    <input
                      type="text"
                      required
                      value={q.optionValues[optKey]}
                      onChange={(e) => updateOptionValue(index, optKey, e.target.value)}
                      placeholder={`Option ${optKey}`}
                      className="flex-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Correct Answer:</label>
                <div className="flex gap-4">
                  {q.options.map((optKey) => (
                    <label key={optKey} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        value={optKey}
                        checked={q.correctAnswer === optKey}
                        onChange={(e) => updateCorrectAnswer(index, e.target.value)}
                        className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">{optKey}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 sticky bottom-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 border rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Test'}
          </button>
        </div>
      </form>
    </div>
  );
};