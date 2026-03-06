import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import { Clock, AlertTriangle } from 'lucide-react';

export const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timerInterval;

    const initializeTest = async () => {
      try {

        const testsRes = await api.get('/tests/available');

        const currentTest = testsRes.data.data.find(t => t._id === testId);
        console.log(currentTest);
        if (!currentTest) {
          toast.error("Test not found or unavailable.");
          navigate('/student/tests');
          return;
        }
        setTest(currentTest);


        const startRes = await api.post('/results/start', { testId });
        console.log(startRes);
        const { expiresAt } = startRes.data.data;


        const expirationTime = new Date(expiresAt).getTime();

        timerInterval = setInterval(() => {
          const now = new Date().getTime();
          const distance = expirationTime - now;

          if (distance <= 0) {
            clearInterval(timerInterval);
            setTimeLeft(0);
            handleAutoSubmit();
          } else {
            setTimeLeft(Math.floor(distance / 1000));
          }
        }, 1000);

      } catch (error) {
        const message = error.response?.data?.message;

        if (message === "You have already completed this test") {
          toast("You already completed this test.");
          navigate("/student/history");
          return;
        }

        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTest();

    return () => clearInterval(timerInterval);
  }, [testId]);


  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Submit Test
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;


    if (timeLeft > 0 && !window.confirm("Are you sure you want to submit your test? You cannot change your answers after this.")) {
      return;
    }

    submitTestToBackend();
  };

  const handleAutoSubmit = () => {
    toast.error("Time is up! Auto-submitting your test...", { duration: 4000 });
    submitTestToBackend();
  };

  const submitTestToBackend = async () => {
    setIsSubmitting(true);

    // Format answers for the backend: [{ questionId, selectedOption }]
    const formattedAnswers = Object.entries(answers).map(([qId, selectedOpt]) => ({
      questionId: qId,
      selectedOption: selectedOpt
    }));

    try {
      await api.post('/results/submit', {
        testId,
        answers: formattedAnswers
      });

      toast.success("Test submitted successfully!");
      navigate('/student/history'); // Redirect to history to see their score
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit test");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Preparing your test environment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Sticky Header with Timer */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-4 mb-6 sticky top-4 z-10 border border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{test?.title}</h1>
          <p className="text-sm text-gray-500">{test?.subject}</p>
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${timeLeft < 60 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
          <Clock size={20} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Questions Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {test?.questions?.map((q, index) => (
            <div key={q._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                <span className="text-gray-500 mr-2">{index + 1}.</span>
                {q.question}
              </h3>

              <div className="space-y-3 pl-6">
                {q.options.map((opt, optIndex) => (
                  <label
                    key={optIndex}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${answers[q._id] === optIndex
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50 border-gray-200'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      value={optIndex}   // ✅ send index
                      checked={answers[q._id] === optIndex}
                      onChange={() => handleOptionSelect(q._id, optIndex)} // ✅ send index
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3 mt-8">
            <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Ready to submit?</p>
              <p>Make sure you have answered all questions. You cannot edit your answers once submitted. The test will auto-submit when the timer reaches zero.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting Test...' : 'Submit Test'}
          </button>
        </form>
      </div>
    </div>
  );
};