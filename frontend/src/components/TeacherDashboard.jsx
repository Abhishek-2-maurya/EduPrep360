import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, PlusCircle, FileText, Activity, 
  Search, Bell, Zap, Calendar, ChevronRight, 
  Users, CheckCircle, BarChart3
} from 'lucide-react';
import { api } from '../api/axios';

// --- COLOR MAPPING (Ensures Tailwind doesn't strip classes) ---
const colorMap = {
  blue: { bg: "bg-blue-50", iconBg: "bg-blue-600", text: "text-blue-600", border: "border-blue-100", shadow: "shadow-blue-200" },
  indigo: { bg: "bg-indigo-50", iconBg: "bg-indigo-600", text: "text-indigo-600", border: "border-indigo-100", shadow: "shadow-indigo-200" },
  emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-100", shadow: "shadow-emerald-200" }
};

export const TeacherDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [data, setData] = useState({
    stats: { activeTests: 0, avgScore: 0, totalStudents: 0 },
    recentActivity: [],
    loading: true
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await api.get('/results/teacher/dashboard-summary');
        setData({
          stats: res.data.data.stats,
          recentActivity: res.data.data.recentActivity,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching teacher dashboard:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    fetchTeacherData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-20 font-sans">
      {/* 1. TOP NAV BAR */}
      <nav className="top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search students or exams..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 pl-2">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 leading-none">{user?.name}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tight mt-1">Instructor • {user?.branch}</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
                  {user?.name?.charAt(0)}
               </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* 2. HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-14 mb-12 shadow-2xl shadow-blue-900/20"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest border border-blue-500/30 backdrop-blur-md flex items-center gap-2">
                  <Zap size={12} fill="currentColor" /> Admin Dashboard
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md flex items-center gap-2">
                  <Calendar size={12} /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Empower your <br/> 
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-emerald-400">Classroom.</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-md">
                Welcome back, {user?.name?.split(' ')[0]}. You are managing <span className="text-blue-400 font-bold">{data.stats.totalStudents} students</span> in {user?.branch}.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/teacher/tests/create" className="group bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95">
                  Create New Test <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300"/>
                </Link>
                <Link to="/teacher/tests/manage" className="bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-md">
                  Review Results
                </Link>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-4xl text-center">
                        <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-1">Active Tests</p>
                        <p className="text-4xl font-black text-white">{data.loading ? '...' : data.stats.activeTests}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-4xl text-center">
                        <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-1">Avg Score</p>
                        <p className="text-4xl font-black text-white">{data.loading ? '...' : data.stats.avgScore}%</p>
                    </div>
                </div>
            </div>
          </div>
        </motion.div>

        {/* 3. MANAGEMENT SUITE */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Management Suite</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ActionCard 
              to="/teacher/tests/create"
              icon={PlusCircle}
              title="Test Creator"
              desc="Build custom examinations with automated grading."
              color="blue"
              badge="Design Tool"
            />
            <ActionCard 
              to="/teacher/tests/manage"
              icon={BookOpen}
              title="Manage Exams"
              desc="Monitor live sessions and edit existing tests."
              color="indigo"
            />
            <ActionCard 
              to="/teacher/notes"
              icon={FileText}
              title="Study Resources"
              desc="Upload notes and PDFs directly to your students."
              color="emerald"
              badge="Updated"
            />
          </div>
        </div>

        {/* 4. ACTIVITY FEED */}
        <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-600 rounded-full" />
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Recent Activity</h3>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Live Updates
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {data.loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />)
                ) : data.recentActivity.length > 0 ? (
                    data.recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{activity.testName}</p>
                                    <p className="text-xs text-slate-500 font-medium">{activity.message}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-900">{activity.score}% Grade</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{activity.timeAgo}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-slate-400 font-medium">No recent submissions found.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENT: Action Card
const ActionCard = ({ to, icon: Icon, title, desc, color, badge }) => {
  const colors = colorMap[color] || colorMap.blue;
  return (
    <Link to={to} className="group relative">
      <div className="h-full bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start overflow-hidden">
        <div className={`absolute -right-8 -top-8 w-32 h-32 ${colors.bg} rounded-full blur-3xl group-hover:opacity-80 transition-opacity`} />
        {badge && <span className={`mb-6 px-4 py-1.5 rounded-full ${colors.bg} ${colors.text} text-[10px] font-black uppercase tracking-widest border ${colors.border} z-10`}>{badge}</span>}
        <div className={`${colors.iconBg} p-5 rounded-2xl text-white mb-8 shadow-lg ${colors.shadow} group-hover:scale-110 transition-transform duration-500 z-10`}>
          <Icon size={32} strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3 flex items-center gap-2 z-10">{title} <ChevronRight size={22} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></h3>
        <p className="text-slate-500 font-medium leading-relaxed z-10">{desc}</p>
      </div>
    </Link>
  );
};