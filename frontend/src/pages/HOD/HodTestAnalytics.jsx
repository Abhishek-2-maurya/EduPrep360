import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Users, Trophy, TrendingUp, TrendingDown, 
  Target, Download, ShieldCheck, UserCheck, Briefcase 
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { api } from "../../api/axios";

export const HodTestAnalytics = () => {
  const { testId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHodAnalytics = async () => {
      try {
        const res = await api.get(`results/hod/test-analytics/${testId}`);
        console.log(res.data.data);
        setData(res.data.data);
      } catch (err) {
        console.error("HOD Analytics fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHodAnalytics();
  }, [testId]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Dept Stats...</div>;

  const pieData = [
    { name: "Passed", value: Number(data?.passCount || 0), color: "#10b981" },
    { name: "Failed", value: Number(data?.failCount || 0), color: "#f43f5e" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HOD Header with Dept Info */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <Link to="/hod/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-all mb-4">
              <ArrowLeft size={16} /> Department Dashboard
            </Link>
            <div className="flex items-center gap-3">
               <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                  <ShieldCheck className="text-white" size={24} />
               </div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                 {data?.testTitle} <span className="text-slate-300 font-medium">| Audit</span>
               </h1>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500">
                  <UserCheck size={12} /> Instructor: {data?.teacherName}
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black uppercase text-indigo-600">
                  <Briefcase size={12} /> Branch: {data?.branch}
               </div>
            </div>
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95">
            Download Audit Report
          </button>
        </header>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <HodStatCard label="Total Submissions" value={data?.totalAttempts} icon={<Users />} color="blue" />
          <HodStatCard label="Class Average" value={`${data?.averageScore}%`} icon={<Target />} color="indigo" />
          <HodStatCard label="Department High" value={`${data?.highestScore}%`} icon={<Trophy />} color="amber" />
          <HodStatCard label="Passing Velocity" value={`${data?.passPercentage}%`} icon={<TrendingUp />} color="emerald" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Dept Ratio Chart */}
            <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center">
                <h3 className="text-xl font-black text-slate-800 w-full mb-8 text-center uppercase tracking-tighter">Results Distribution</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-8 space-y-3 w-full">
                    <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <span className="text-xs font-black text-emerald-700 uppercase">Passed Students</span>
                        <span className="text-lg font-black text-emerald-700">{data?.passCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-rose-50 rounded-2xl border border-rose-100">
                        <span className="text-xs font-black text-rose-700 uppercase">Failed Students</span>
                        <span className="text-lg font-black text-rose-700">{data?.failCount}</span>
                    </div>
                </div>
            </div>

            {/* Department Comparison Logic (Placeholder for future) */}
            <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                <h2 className="text-3xl font-black mb-4 leading-tight">Academic <br/><span className="text-indigo-400">Integrity Report</span></h2>
                <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8">
                    This test shows a <b>{data?.passPercentage}%</b> success rate. 
                    The highest score recorded was <b>{data?.highestScore}%</b>. 
                    As an HOD, you can use these metrics to audit the difficulty level of the examination created by <b>{data?.teacherName}</b>.
                </p>
                <div className="flex gap-4">
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/5 flex-1">
                        <TrendingDown className="text-rose-400 mb-2" size={24} />
                        <p className="text-[10px] font-black uppercase text-slate-500">Lowest Grade</p>
                        <p className="text-2xl font-black">{data?.lowestScore}%</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/5 flex-1">
                        <TrendingUp className="text-emerald-400 mb-2" size={24} />
                        <p className="text-[10px] font-black uppercase text-slate-500">Avg %</p>
                        <p className="text-2xl font-black">{data?.averageScore}%</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const HodStatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-${color}-50 text-${color}-600`}>
      {icon}
    </div>
    <div>
      <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{label}</h4>
      <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  </div>
);