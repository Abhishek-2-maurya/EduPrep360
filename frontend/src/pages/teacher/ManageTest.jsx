import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/axios";
import {
  BookOpen, Clock, Calendar, FileQuestion, PlusCircle,
  Trash2, BarChart3, Users, ChevronRight, Search,
  Filter, Zap, Target, MoreVertical, AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

export const ManageTests = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [prompt, setPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const fetchTests = async () => {
    try {
      const response = await api.get("/tests/teacher");
      setTests(response.data.data);
    } catch (err) {
      toast.error("Cloud synchronization failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await api.delete(`/tests/${id}`);
      setTests((prev) => prev.filter((t) => t._id !== id));
      toast.success("Assessment expunged");
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleToggleActivate = async (id, currentStatus) => {
    try {
      // Toggles the current status to its opposite
      await api.put(`/tests/activate/${id}`, { isActive: !currentStatus });

      // Optimistic UI update for immediate feedback
      setTests((prev) =>
        prev.map((t) => (t._id === id ? { ...t, isActive: !currentStatus } : t))
      );

      toast.success(!currentStatus ? "Test is now Live" : "Test Deactivated");
    } catch (err) {
      toast.error("Status update failed");
      fetchTests(); // Revert to server state on error
    }
  };

  const handleAIGenerate = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      setAiLoading(true);
      await api.post("/tests/ai-create", { prompt });
      toast.success("AI Test Created Successfully!");

      fetchTests();
      setPrompt("");
    } catch (err) {
      toast.error("AI failed to create test");
    } finally {
      setAiLoading(false);
    }
  };


  const getStatus = (test) => {
    const now = new Date();
    if (!test.isActive) return "Inactive";
    if (test.startTime && new Date(test.startTime) > now) return "Upcoming";
    if (test.endTime && new Date(test.endTime) < now) return "Expired";
    return "Live";
  };

  const filteredTests = tests.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: tests.length,
    active: tests.filter((t) => getStatus(t) === "Live").length,
    expired: tests.filter((t) => getStatus(t) === "Expired").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8F9FD] gap-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-3xl border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-3xl border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Syncing Assessments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 pt-8 font-sans">
      {/* 1. ELITE HEADER & SUMMARY */}
      <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
              <BookOpen size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Test <span className="text-indigo-600">Engine</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <SummaryPill label="Total Assets" value={stats.total} color="blue" />
            <SummaryPill label="Live Now" value={stats.active} color="emerald" />
            <SummaryPill label="Archived" value={stats.expired} color="amber" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group w-full sm:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search assessment database..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-2xl shadow-xl shadow-slate-200/40 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            />
          </div>
          <Link
            to="/teacher/tests/create"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl hover:scale-[1.02] active:scale-95 font-black text-xs uppercase tracking-widest"
          >
            <PlusCircle size={18} />
            Initialize Test
          </Link>
        </div>
      </header>

      {/* 2. GRID CONTENT */}
      {/* AI TEST GENERATOR */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-gray-200">
        <h2 className="text-2xl font-black text-slate-900 leading-tight line-clamp-2 min-h-14">AI Test Generator</h2>
        <p className="text-gray-500 text-sm mb-4">
          Example: Create a Python test with 20 MCQs for 2nd year, duration 30 minutes
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="3"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Type your instruction for AI..."
        />

        <button
          onClick={handleAIGenerate}
          disabled={aiLoading}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${aiLoading
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95'
            }`}
        >
          {aiLoading ? (
            <>
              <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Zap size={14} />
              Generate Test with AI
            </>
          )}
        </button>
      </div>
      <AnimatePresence mode="popLayout">
        {filteredTests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 text-center"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-4xl flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Filter size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Registry Empty</h3>
            <p className="text-slate-400 font-medium mb-10 uppercase text-[10px] tracking-[0.2em]">No tests found matching the current criteria</p>
            <Link to="/teacher/tests/create" className="bg-indigo-50 text-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all inline-flex items-center gap-2">
              Create First Test <ChevronRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredTests.map((test, i) => (
              <TestCard
                key={test._id}
                test={test}
                onDelete={handleDelete}
                onToggleActive={handleToggleActivate}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SummaryPill = ({ label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 ${colors[color]}`}>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black">{value}</span>
    </div>
  );
};

const TestCard = ({ test, onDelete, onToggleActive, index }) => {
  const isExpired = new Date() > new Date(test.endTime);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col group overflow-hidden ${test.isActive ? 'border-transparent shadow-sm' : 'border-slate-100 opacity-80 shadow-none grayscale-[0.4]'
        } hover:shadow-2xl hover:shadow-indigo-500/10`}
    >
      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-6">
          {/* Dynamic Status Badge */}
          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${!test.isActive
            ? 'bg-slate-100 text-slate-500 border-slate-200'
            : isExpired
              ? 'bg-rose-50 text-rose-600 border-rose-100'
              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${test.isActive ? 'bg-current animate-pulse' : 'bg-slate-400'}`} />
            {test.isActive ? (isExpired ? 'Archived' : 'Live Assessment') : 'Inactive / Draft'}
          </div>

          <button
            onClick={() => onDelete(test._id, test.title)}
            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">{test.subject}</p>
          <h3 className="text-2xl font-black text-slate-900 leading-tight line-clamp-2 min-h-14">
            {test.title}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <MetaItem icon={Clock} label="Duration" value={`${test.duration}m`} />
          <MetaItem icon={FileQuestion} label="Payload" value={`${test.questions?.length || 0} Qs`} />
          <MetaPill label="Year" value={test.year} />
          <MetaPill label="Target" value={`${test.passingMarks}%`} />
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto flex flex-col gap-3">
        {/* Toggle Active Action */}
        <button
          onClick={() => onToggleActive(test._id, test.isActive)}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${test.isActive
            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
            }`}
        >
          {test.isActive ? (
            <><AlertCircle size={14} /> Deactivate Test</>
          ) : (
            <><Zap size={14} /> Activate & Go Live</>
          )}
        </button>

        <div className="flex gap-2">
          <Link
            to={`/teacher/tests/${test._id}/results`}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            <Users size={14} /> Results
          </Link>
          <Link
            to={`/teacher/tests/${test._id}/analytics`}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            <BarChart3 size={14} /> Intelligence
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const MetaItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
    <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
      <Icon size={14} />
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase leading-none">{label}</p>
      <p className="text-xs font-black text-slate-800 mt-1 tracking-tight">{value}</p>
    </div>
  </div>
);

const MetaPill = ({ label, value }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl">
    <span className="text-[9px] font-black text-slate-400 uppercase">{label}</span>
    <span className="text-xs font-black text-slate-800">{value}</span>
  </div>
);