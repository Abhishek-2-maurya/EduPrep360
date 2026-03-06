import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTestAnalytics, getTestResultsList } from "../../services/resultService"; 
import { 
  ArrowLeft, Users, Trophy, TrendingUp, TrendingDown, 
  Target, Download, CheckCircle2, XCircle, Loader2
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from "recharts";

export const TeacherTestAnalytics = () => {
  const { testId } = useParams();
  
  // Two separate buckets for our two different API responses
  const [analytics, setAnalytics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [testTitle, setTestTitle] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch both endpoints at the same time using your services
        const [analyticsPayload, resultsPayload] = await Promise.all([
          getTestAnalytics(testId),
          getTestResultsList(testId)
        ]);

        console.log("Analytics KPIs:", analyticsPayload); 
        console.log("Leaderboard Data:", resultsPayload); // <-- This is the JSON you pasted!

        // 1. Set the Analytics (Top Cards & Pie Chart)
        // If there are no attempts, your backend returns { message: "No attempts yet", data: null }
        if (analyticsPayload.data === null) {
          setAnalytics({ totalAttempts: 0, passCount: 0, failCount: 0 });
        } else {
          setAnalytics(analyticsPayload); 
        }

        // 2. Set the Leaderboard (The Table)
        // We dive into resultsPayload.results based on the JSON you provided
        if (resultsPayload && resultsPayload.results) {
          setLeaderboard(resultsPayload.results);
          setTestTitle(resultsPayload.testTitle);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (testId) fetchDashboardData();
  }, [testId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-blue-600">
        <Loader2 className="animate-spin h-12 w-12 mb-4" />
        <p className="font-semibold text-slate-600">Loading Student Data...</p>
      </div>
    );
  }

  // Dynamic Pie Chart Data
  const pieData = [
    { name: "Passed", value: analytics?.passCount || 0, color: "#10b981" },
    { name: "Failed", value: analytics?.failCount || 0, color: "#f43f5e" },
  ];

  const hasAttempts = analytics?.totalAttempts > 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <Link to="/teacher/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-2 transition-colors">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 capitalize">
              {testTitle} <span className="text-slate-400 font-medium">| Analytics</span>
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl font-medium transition-colors">
            <Download size={18} /> Export CSV
          </button>
        </div>

        {/* Top KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard icon={<Users />} label="Total Attempts" value={analytics?.totalAttempts || 0} color="blue" />
          <StatCard icon={<Target />} label="Avg. Score" value={analytics?.averageScore || 0} color="indigo" />
          <StatCard icon={<Trophy />} label="Highest Score" value={analytics?.highestScore || 0} color="amber" />
          <StatCard icon={<TrendingDown />} label="Lowest Score" value={analytics?.lowestScore || 0} color="slate" />
          <StatCard icon={<TrendingUp />} label="Pass Rate" value={`${analytics?.passPercentage || 0}%`} color="emerald" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Pie Chart Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold text-slate-800 w-full mb-4">Pass vs Fail Ratio</h3>
            
            {hasAttempts ? (
              <>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-6 mt-4 w-full justify-center text-sm font-medium">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 size={18}/> {analytics.passCount || 0} Passed
                  </div>
                  <div className="flex items-center gap-2 text-rose-600">
                    <XCircle size={18}/> {analytics.failCount || 0} Failed
                  </div>
                </div>
              </>
            ) : (
              <div className="h-48 w-full flex items-center justify-center text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No exam attempts yet
              </div>
            )}
          </div>

          {/* Leaderboard Table Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
              <h3 className="text-lg font-bold text-slate-800">Student Leaderboard</h3>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {leaderboard.length} Students
              </span>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                    <th className="p-4 font-semibold pl-6">Rank</th>
                    <th className="p-4 font-semibold">Student Name</th>
                    <th className="p-4 font-semibold">Score</th>
                    <th className="p-4 font-semibold">Percentage</th>
                    <th className="p-4 font-semibold pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {leaderboard.length > 0 ? (
                    leaderboard.map((student) => (
                      <tr key={student.email} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                            student.rank === 1 ? 'bg-amber-100 text-amber-700' :
                            student.rank === 2 ? 'bg-slate-200 text-slate-700' :
                            student.rank === 3 ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            #{student.rank}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{student.studentName}</div>
                          <div className="text-slate-500 text-xs">{student.email}</div>
                        </td>
                        <td className="p-4 font-bold text-slate-700">{student.score}</td>
                        <td className="p-4 font-medium text-slate-600">{student.percentage}%</td>
                        <td className="p-4 pr-6">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                            student.status === "pass" 
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                              : "bg-rose-100 text-rose-700 border border-rose-200"
                          }`}>
                            {student.status === "pass" ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500">
                        No results available for this test yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    slate: "text-slate-600 bg-slate-50 border-slate-200",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium mb-1">{label}</h4>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};



