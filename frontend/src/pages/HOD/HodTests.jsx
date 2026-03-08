import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../api/axios';
import { 
  BookOpen, Clock, Calendar, FileQuestion, 
  Search, User, ChevronRight, Zap, 
  Filter, Award, BarChart3
} from 'lucide-react';

export const HodTests = () => {
  const { user } = useSelector((state) => state.auth);
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeYear, setActiveYear] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranchTests = async () => {
      try {
        const response = await api.get('/tests/teacher');
        setTests(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch branch tests');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranchTests();
  }, []);

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = activeYear === 'All' || test.year.toString() === activeYear;
    return matchesSearch && matchesYear;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F9FD]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-8 font-sans">
      
      {/* 1. ELITE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {user?.branch} <span className="text-indigo-600">Assessments</span>
            </h1>
          </div>
          <p className="text-slate-500 font-medium">Departmental oversight for all active and archived examinations.</p>
        </div>

        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search exams or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none shadow-sm font-medium"
          />
        </div>
      </div>

      {/* 2. YEAR FILTERS */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100/50 p-1.5 rounded-2xl w-fit">
        {['All', '1st', '2nd', '3rd', '4th'].map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeYear === year 
              ? "bg-white text-indigo-600 shadow-sm" 
              : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {year === 'All' ? 'All Batches' : `Year ${year}`}
          </button>
        ))}
      </div>

      {/* 3. ASSESSMENT GRID */}
      <AnimatePresence mode="wait">
        {filteredTests.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white py-20 rounded-[3rem] border border-dashed border-slate-200 text-center"
          >
            <Filter className="mx-auto h-16 w-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No Assessments Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or search terms for the {user?.branch} department.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTests.map((test, i) => (
              <TestCard key={test._id} test={test} index={i} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// HELPER COMPONENT: Test Card
const TestCard = ({ test, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group overflow-hidden flex flex-col"
    >
      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100">
              Batch Year {test.year}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Zap size={12} className="text-amber-500 fill-amber-500" /> Pass Mark: {test.passingMarks}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
            <BookOpen size={22} />
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
          {test.title}
        </h3>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-tight mb-6">{test.subject}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
            <Clock size={16} className="text-indigo-500" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Duration</p>
              <p className="text-xs font-bold text-slate-700 mt-1">{test.duration}m</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
            <FileQuestion size={16} className="text-indigo-500" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Questions</p>
              <p className="text-xs font-bold text-slate-700 mt-1">{test.questions?.length || 0}</p>
            </div>
          </div>
        </div>

        {test.teacherId && (
          <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-[10px]">
              {test.teacherId.name?.charAt(0)}
            </div>
            <div className="text-[10px] font-bold text-slate-500">
              <p className="uppercase tracking-widest leading-none">Curated By</p>
              <p className="text-slate-900 mt-1">{test.teacherId.name}</p>
            </div>
          </div>
        )}
      </div>

      <Link 
        to={`/hod/test/${test._id}/analytics`}
        className="mx-8 mb-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200"
      >
        View Branch Analytics <BarChart3 size={14} />
      </Link>
    </motion.div>
  );
};