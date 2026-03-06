import { useEffect, useState } from "react";
import { getStudentResults, deleteResult } from "../../services/resultService";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  Award,
  Trash2,
  TrendingUp,
  Target,
  ChevronRight,
  Clock,
  Search,
  Filter
} from "lucide-react";

export const StudentResultHistory = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getStudentResults();
        setResults(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const handleDelete = async (resultId) => {
    if (!window.confirm("Permanent deletion cannot be undone. Proceed?")) return;

    setDeletingId(resultId);
    try {
      await deleteResult(resultId);
      setResults((prev) => prev.filter((r) => r._id !== resultId));
      toast.success("Result entry purged");
    } catch (err) {
      toast.error(err.response?.data?.message || "Purge failed");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredResults = results.filter(r => 
    r.testId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.testId?.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const stats = {
    avgScore: results.length ? (results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length).toFixed(1) : 0,
    testsTaken: results.length,
    passRate: results.length ? ((results.filter(r => r.status === 'pass').length / results.length) * 100).toFixed(0) : 0
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F9FD]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <div className="p-4 bg-red-50 rounded-full text-red-500 mb-4"><XCircle size={48} /></div>
        <h2 className="text-2xl font-black text-slate-800">{error}</h2>
        <button onClick={() => window.location.reload()} className="mt-4 text-indigo-600 font-bold hover:underline">Try Refreshing</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-8 font-sans">
      
      {/* 1. HEADER & SUMMARY */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Performance <span className="text-indigo-600">Archive</span></h1>
          </div>
          <p className="text-slate-500 font-medium">Detailed breakdown of your academic journey and assessment history.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
          <QuickStat label="Avg. Score" value={`${stats.avgScore}%`} icon={TrendingUp} color="blue" />
          <QuickStat label="Tests" value={stats.testsTaken} icon={Target} color="purple" />
          <QuickStat label="Pass Rate" value={`${stats.passRate}%`} icon={Award} color="emerald" />
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="relative mb-10 group max-w-2xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by test title or subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-4 md:py-5 bg-white border-none rounded-[2rem] shadow-xl shadow-slate-200/40 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
        />
      </div>

      {/* 3. RESULTS LISTING */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredResults.length > 0 ? (
            filteredResults.map((result, i) => (
              <ResultCard 
                key={result._id} 
                result={result} 
                index={i} 
                onDelete={handleDelete} 
                isDeleting={deletingId === result._id} 
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200"
            >
              <Award className="mx-auto text-slate-200 mb-4" size={64} />
              <h3 className="text-xl font-bold text-slate-800">No matching results</h3>
              <p className="text-slate-500 mt-1">Try adjusting your filters or complete a new assessment.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const QuickStat = ({ label, value, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600"
  };
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-2`}>
        <Icon size={20} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h4 className="text-lg font-black text-slate-900 leading-none mt-1">{value}</h4>
    </div>
  );
};

const ResultCard = ({ result, index, onDelete, isDeleting }) => {
  const isPass = result.status === "pass";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-slate-50/50 to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${isPass ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' : 'bg-rose-50 text-rose-600 shadow-rose-100'}`}>
              {result.percentage}%
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                {result.testId?.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <BookOpen size={14} className="text-indigo-400" />
                  {result.testId?.subject}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={14} className="text-slate-300" />
                  {new Date(result.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Score Gauge */}
        <div className="flex flex-col items-start lg:items-center min-w-[140px]">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Score Accuracy</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900">{result.score}</span>
            <span className="text-slate-300 font-bold">/ {result.totalMarks}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${result.percentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full rounded-full ${isPass ? 'bg-emerald-500' : 'bg-rose-500'}`}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-50">
          <div className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border ${isPass ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
            {isPass ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {isPass ? 'Pass' : 'Fail'}
          </div>
          
          <button
            onClick={() => onDelete(result._id)}
            disabled={isDeleting}
            className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all disabled:opacity-50"
          >
            {isDeleting ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-rose-500 border-t-transparent" /> : <Trash2 size={20} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};