import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { api } from '../api/axios';
import { 
  Users, UserCog, ShieldCheck, BookOpen, Activity, 
  BarChart, Award, Search, Bell, Zap, Calendar, 
  ChevronRight, Database, Globe, Cpu 
} from 'lucide-react';

// --- COLOR MAPPING ---
const colorMap = {
  blue: { bg: "bg-blue-50", iconBg: "bg-blue-600", text: "text-blue-600", border: "border-blue-100", shadow: "shadow-blue-200" },
  indigo: { bg: "bg-indigo-50", iconBg: "bg-indigo-600", text: "text-indigo-600", border: "border-indigo-100", shadow: "shadow-indigo-200" },
  purple: { bg: "bg-purple-50", iconBg: "bg-purple-600", text: "text-purple-600", border: "border-purple-100", shadow: "shadow-purple-200" },
  emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-100", shadow: "shadow-emerald-200" },
  rose: { bg: "bg-rose-50", iconBg: "bg-rose-600", text: "text-rose-600", border: "border-rose-100", shadow: "shadow-rose-200" },
  amber: { bg: "bg-amber-50", iconBg: "bg-amber-600", text: "text-amber-600", border: "border-amber-100", shadow: "shadow-amber-200" },
};

export const AdminDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await api.get('/results/admin-dashboard');
        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F9FD]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-20 font-sans">
      {/* 1. TOP UTILITY BAR */}
      <nav className="top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Global system search..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 pl-2">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 leading-none">Root Admin</p>
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-tight mt-1">Superuser Status</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-black shadow-lg">
                  A
               </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* 2. SYSTEM COMMAND CENTER HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-14 mb-12 shadow-2xl shadow-slate-900/20"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-500/10 to-transparent pointer-events-none" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600 rounded-full blur-[120px]"
          />

          <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-widest border border-rose-500/30 backdrop-blur-md flex items-center gap-2">
                  <Cpu size={12} fill="currentColor" /> Infrastructure Optimal
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md flex items-center gap-2">
                  <Calendar size={12} /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Global System <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400">Intelligence.</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-md">
                Platform-wide oversight across <span className="text-white font-bold">{stats?.totalTests || 0}</span> active examinations and <span className="text-white font-bold">{stats?.totalAttempts || 0}</span> data points.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="group bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-rose-50 transition-all flex items-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95">
                  Audit Logs <Database size={18} className="group-hover:translate-y-0.5 transition-transform"/>
                </button>
                <button className="bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-md">
                  System Settings
                </button>
              </div>
            </div>

            {/* Performance Circular Gauge */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-56 h-56 md:w-64 md:h-64 group">
                <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-3xl group-hover:bg-rose-500/40 transition-colors" />
                <svg className="w-full h-full transform -rotate-90 relative z-10">
                  <circle cx="50%" cy="50%" r="42%" className="stroke-white/5 fill-none" strokeWidth="12" />
                  <motion.circle 
                    cx="50%" cy="50%" r="42%" 
                    className="stroke-rose-500 fill-none" 
                    strokeWidth="12" 
                    strokeDasharray="264"
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * (stats?.overallPassPercentage || 0)) / 100 }}
                    transition={{ duration: 2, ease: "circOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                  <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                    {stats?.overallPassPercentage || 0}%
                  </span>
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mt-2">Global Pass Rate</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. USER BASE METRICS */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1.5 bg-rose-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">User Base Overview</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Students" value={stats?.totalStudents} icon={Users} color="blue" delay={0} />
            <StatCard label="Total Teachers" value={stats?.totalTeachers} icon={UserCog} color="indigo" delay={0.1} />
            <StatCard label="Total HODs" value={stats?.totalHODs} icon={ShieldCheck} color="purple" delay={0.2} />
            <StatCard label="Total Tests" value={stats?.totalTests} icon={BookOpen} color="emerald" delay={0.3} />
          </div>
        </div>

        {/* 4. ANALYTICS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Activity size={24} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Attempts</p>
            <h3 className="text-4xl font-black text-slate-900">{stats?.totalAttempts || 0}</h3>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <BarChart size={24} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Success Metric</p>
            <h3 className="text-4xl font-black text-slate-900">{stats?.overallPassPercentage || 0}%</h3>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Award size={24} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Top Performing Branch</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">{stats?.topBranch || 'N/A'}</h3>
          </motion.div>
        </div>

        {/* 5. ADMIN QUICK ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ActionCard 
            icon={ShieldCheck}
            title="User Authorization"
            desc="Manage system roles, permissions, and account security protocols."
            color="rose"
            badge="Security"
          />
          <ActionCard 
            icon={Globe}
            title="Branch Management"
            desc="Configure departmental structures and cross-branch analytics."
            color="indigo"
          />
          <ActionCard 
            icon={BarChart}
            title="System Reports"
            desc="Export comprehensive platform data for institutional review."
            color="amber"
            badge="Live Data"
          />
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, color, delay }) => {
  const colors = colorMap[color];
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all group"
    >
      <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center ${colors.text} mb-6 group-hover:rotate-12 transition-transform`}>
        <Icon size={26} />
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 mt-2">{value || 0}</h3>
    </motion.div>
  );
};

const ActionCard = ({ icon: Icon, title, desc, color, badge }) => {
  const colors = colorMap[color];
  return (
    <div className="group relative cursor-pointer">
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
    </div>
  );
};