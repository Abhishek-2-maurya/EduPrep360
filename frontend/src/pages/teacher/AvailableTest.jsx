import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import { BookOpen, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export const AvailableTests = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableTests = async () => {
      try {
        const response = await api.get('/tests/available');
       console.log(response.data.data);
        setTests(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch available tests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableTests();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 flex items-center gap-3">
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Available Tests</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tests available for your branch and year. Click "Start Test" when you are ready.
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">You're all caught up!</h3>
          <p className="text-gray-500 mb-4 text-sm">There are no pending tests for you at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              
              <div className="p-6 border-b border-gray-100 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {test.subject}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Pass: {test.passingMarks}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2" title={test.title}>
                  {test.title}
                </h3>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-blue-500" />
                    <span className="font-medium">{test.duration} Minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-blue-500" />
                    <span className="font-medium">{test.questions?.length || 0} Questions</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <button
                  onClick={() => navigate(`/student/test/${test._id}`)}
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  <BookOpen size={18} />
                  Start Test
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};