import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Users, GraduationCap, UserCog, 
  Mail, Calendar, ExternalLink, MoreVertical, Filter
} from 'lucide-react';

export const HodUsers = () => {
  const { user } = useSelector(state => state.auth);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('student'); // Default to Students

  useEffect(() => {
    const fetchBranchUsers = async () => {
      try {
        const response = await api.get('/user/all-users');
        
        // --- LOGIC: Remove HODs from the list ---
        const filteredDeptUsers = response.data.data.filter(u => u.role !== 'HOD');
        
        setAllUsers(filteredDeptUsers);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranchUsers();
  }, []);

  // Filter for Search and Active Tab
  const filteredDisplay = allUsers.filter(u => {
    const matchesRole = u.role === activeTab;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F9FD]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 pt-6">
      
      {/* 1. HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {user?.branch} <span className="text-indigo-600">Personnel</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Managing {allUsers.filter(u => u.role === 'student').length} Students & {allUsers.filter(u => u.role === 'teacher').length} Teachers
          </p>
        </div>

        <div className="relative w-full xl:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={`Search ${activeTab}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none shadow-sm text-sm font-semibold"
          />
        </div>
      </div>

      {/* 2. TWO-TAB SYSTEM (Student & Teacher Only) */}
      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full sm:w-fit mb-8 gap-1">
        {[
          { id: 'student', label: 'Students', icon: GraduationCap },
          { id: 'teacher', label: 'Teachers', icon: UserCog },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id 
              ? "bg-white text-indigo-600 shadow-md" 
              : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. RESPONSIVE CONTAINER */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        
        {/* DESKTOP VIEW */}
        <div className="hidden lg:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                {activeTab === 'student' && (
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Academic Year</th>
                )}
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDisplay.map((u) => (
                <tr key={u._id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{u.email}</td>
                  {activeTab === 'student' && (
                    <td className="px-8 py-5 text-center">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">Year {u.year}</span>
                    </td>
                  )}
                  <td className="px-8 py-5 text-center">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><ExternalLink size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="lg:hidden divide-y divide-slate-100">
          {filteredDisplay.length > 0 ? (
            filteredDisplay.map((u) => (
              <div key={u._id} className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black">
                      {u.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-slate-900 truncate">{u.name}</h4>
                      <p className="text-xs font-medium text-slate-500 truncate">{u.email}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-300"><MoreVertical size={20} /></button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  {activeTab === 'student' && (
                    <div className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase">
                      Year {u.year}
                    </div>
                  )}
                  <StatusBadge status={u.status} />
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <Filter className="text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold italic">No records found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
    status === 'active' 
    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
    : "bg-rose-50 text-rose-600 border-rose-100"
  }`}>
    <div className={`w-1 h-1 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
    {status || 'Active'}
  </div>
);