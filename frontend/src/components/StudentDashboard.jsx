import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, History, FileText, Activity, Target, 
  Award, TrendingUp, ChevronRight, Sparkles, 
  Search, Bell, Zap, Calendar
} from 'lucide-react';
import { api } from '../api/axios';

const colorMap = {
  indigo: {
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-600",
    text: "text-indigo-600",
    border: "border-indigo-100",
    shadow: "shadow-indigo-200"
  },
  emerald: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-600",
    text: "text-emerald-600",
    border: "border-emerald-100",
    shadow: "shadow-emerald-200"
  },
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-600",
    text: "text-purple-600",
    border: "border-purple-100",
    shadow: "shadow-purple-200"
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export const StudentDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/results/student/stats');
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch student stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-20 font-sans">
      {/* 1. TOP UTILITY BAR */}
      <nav className=" top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search exams or notes..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 pl-2">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 leading-none">{user?.name}</p>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight mt-1">{user?.branch} • {user?.year}</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">
                  {user?.name?.charAt(0)}
               </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* 2. COMMAND CENTER HEADER (HERO) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-14 mb-12 shadow-2xl shadow-indigo-900/20"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-indigo-500/10 to-transparent pointer-events-none" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[100px]"
          />

          <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 backdrop-blur-md flex items-center gap-2">
                  <Zap size={12} fill="currentColor" /> System Active
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md flex items-center gap-2">
                  <Calendar size={12} /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Master your <br/> 
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-blue-400 to-purple-400">future today.</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-md">
                Welcome back, {user?.name?.split(' ')[0]}. You have pending assessments in <span className="text-indigo-400 font-bold">{user?.branch}</span>.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/student/tests" className="group bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95">
                  Start New Test <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </Link>
                <Link to="/student/history" className="bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-md">
                  Performance Hub
                </Link>
              </div>
            </div>

            {/* Circular Progress Gauge */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-56 h-56 md:w-64 md:h-64 group">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-colors" />
                <svg className="w-full h-full transform -rotate-90 relative z-10">
                  <circle cx="50%" cy="50%" r="42%" className="stroke-white/5 fill-none" strokeWidth="12" />
                  <motion.circle 
                    cx="50%" cy="50%" r="42%" 
                    className="stroke-indigo-500 fill-none" 
                    strokeWidth="12" 
                    strokeDasharray="264"
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * (stats?.passPercentage || 0)) / 100 }}
                    transition={{ duration: 2, ease: "circOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                  <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                    {loading ? '--' : stats?.passPercentage}%
                  </span>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-2">Pass Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. PERFORMANCE GRID */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Quick Insights</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Attempts', value: stats?.totalAttempts, icon: Activity, color: 'blue' },
              { label: 'Average Grade', value: `${stats?.averageScore}%`, icon: Target, color: 'purple' },
              { label: 'Best Performance', value: `${stats?.highestScore}%`, icon: Award, color: 'amber' },
              { label: 'Success Velocity', value: `${stats?.passPercentage}%`, icon: TrendingUp, color: 'emerald' },
            ].map((stat, i) => {
              const colors = colorMap[stat.color] || colorMap.blue;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center ${colors.text} mb-6 group-hover:rotate-12 transition-transform`}>
                    <stat.icon size={26} />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-2">
                    {loading ? '...' : stat.value}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 4. ACTION CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ActionCard 
            to="/student/tests"
            icon={BookOpen}
            title="Active Examinations"
            desc="Access your assigned tests and competitive assessments."
            color="indigo"
            badge="New Available"
          />
          <ActionCard 
            to="/student/history"
            icon={History}
            title="Result Archive"
            desc="Review comprehensive breakdowns of your previous scores."
            color="emerald"
          />
          <ActionCard 
            to="/student/notes"
            icon={FileText}
            title="Resource Library"
            desc="Download lecture notes, PDFs, and prep materials."
            color="purple"
            badge="Updated"
          />
        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENT: Action Card
const ActionCard = ({ to, icon: Icon, title, desc, color, badge }) => {
  const colors = colorMap[color] || colorMap.indigo;

  return (
    <Link to={to} className="group relative">
      <div className="h-full bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start overflow-hidden">
        <div className={`absolute -right-8 -top-8 w-32 h-32 ${colors.bg} rounded-full blur-3xl group-hover:opacity-80 transition-opacity`} />
        
        {badge && (
          <span className={`mb-6 px-4 py-1.5 rounded-full ${colors.bg} ${colors.text} text-[10px] font-black uppercase tracking-[0.15em] border ${colors.border} z-10`}>
            {badge}
          </span>
        )}
        
        <div className={`${colors.iconBg} p-5 rounded-2xl text-white mb-8 shadow-lg ${colors.shadow} group-hover:scale-110 transition-transform duration-500 z-10`}>
          <Icon size={32} strokeWidth={2.5} />
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2 z-10">
          {title} <ChevronRight size={22} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </h3>
        <p className="text-slate-500 font-medium leading-relaxed z-10">
          {desc}
        </p>
      </div>
    </Link>
  );
};