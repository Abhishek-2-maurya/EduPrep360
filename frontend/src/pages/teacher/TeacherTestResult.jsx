import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTestResultsList } from "../../services/resultService";
import { ArrowLeft, Trophy, CheckCircle, XCircle } from "lucide-react";

export const TeacherTestResults = () => {
  const { testId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getTestResultsList(testId);
        setData(res);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  if (!data?.results?.length) {
    return (
      <div className="text-center mt-20 text-gray-600">
        No students have attempted this test yet.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-16 px-4">
      
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/teacher/tests/manage"
          className="flex items-center gap-2 text-blue-600 mb-4"
        >
          <ArrowLeft size={18} /> Back
        </Link>

        <h1 className="text-3xl font-bold text-gray-800">
          {data.testTitle} - Results
        </h1>
        <p className="text-gray-500 mt-1">
          Total Students: {data.totalStudents}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4">Student</th>
              <th className="p-4">Email</th>
              <th className="p-4">Score</th>
              <th className="p-4">Percentage</th>
              <th className="p-4">Status</th>
              <th className="p-4">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((student) => (
              <tr
                key={student.rank}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-semibold flex items-center gap-2">
                  {student.rank === 1 && (
                    <Trophy className="text-yellow-500" size={18} />
                  )}
                  {student.rank}
                </td>

                <td className="p-4 font-medium">
                  {student.studentName}
                </td>

                <td className="p-4 text-gray-600">
                  {student.email}
                </td>

                <td className="p-4 font-semibold">
                  {student.score}
                </td>

                <td className="p-4">
                  {student.percentage}%
                </td>

                <td className="p-4">
                  {student.status === "pass" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                      <CheckCircle size={14} />
                      Pass
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                      <XCircle size={14} />
                      Fail
                    </span>
                  )}
                </td>

                <td className="p-4 text-sm text-gray-500">
                  {new Date(student.submittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};