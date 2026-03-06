import { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Users, GraduationCap, UserCog, ShieldCheck, 
  LayoutGrid, ChevronRight, Mail, MoreVertical, 
  Trash2, Edit3, X, Save, Power, CheckCircle2, AlertCircle, Filter
} from 'lucide-react';

export const AdminUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeBranch, setActiveBranch] = useState('BTECH');
  const [activeRole, setActiveRole] = useState('student');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const branches = ["BTECH", "BCA", "BBA"];
  const roles = [
    { id: 'student', label: 'Students', icon: GraduationCap },
    { id: 'teacher', label: 'Faculty', icon: UserCog },
    { id: 'HOD', label: 'Heads (HOD)', icon: ShieldCheck },
  ];

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/user/all-users');
      setAllUsers(response.data.data);
    } catch (error) { toast.error('Sync failed'); }
    finally { setIsLoading(false); }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/user/status/${id}`, { status: newStatus });
      setAllUsers(allUsers.map(u => u._id === id ? { ...u, status: newStatus } : u));
      toast.success(`Account marked as ${newStatus}`);
    } catch (error) { toast.error('Status update failed'); }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await api.put(`/user/update/${selectedUser._id}`, selectedUser);
      setAllUsers(allUsers.map(u => u._id === selectedUser._id ? res.data.data : u));
      toast.success('System record updated');
      setSelectedUser(null);
    } catch (error) { toast.error('Update failed'); }
    finally { setIsUpdating(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge user from database? This is irreversible.")) return;
    try {
      await api.delete(`/user/delete/${id}`);
      setAllUsers(allUsers.filter(u => u._id !== id));
      toast.success('User record expunged');
    } catch (error) { toast.error('Purge failed'); }
  };

  const filteredUsers = allUsers.filter(u => 
    u.branch === activeBranch && 
    u.role === activeRole &&
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#F8F9FD]"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 pt-4 md:pt-8 font-sans overflow-x-hidden">
      
      {/* 1. ADAPTIVE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-12">
        <div className="space-y-2 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-2xl">
              <LayoutGrid size={24} />
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">Registry <span className="text-indigo-600">OS</span></h1>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 w-fit px-3 py-1 rounded-full mx-auto lg:mx-0">
            {activeBranch} <ChevronRight size={10} /> {activeRole}s
          </div>
        </div>

        {/* Branch Tabs - Full width scrollable on mobile */}
        <div className="flex bg-white p-1.5 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 overflow-x-auto no-scrollbar max-w-full">
          <div className="flex gap-1 min-w-full lg:min-w-0">
            {branches.map(b => (
              <button key={b} onClick={() => setActiveBranch(b)} className={`flex-1 lg:flex-none px-6 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-xs font-black transition-all whitespace-nowrap ${activeBranch === b ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}>{b}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
        {/* 2. ROLE SELECTOR - FIXED FOR 984x738 BREAKAGE */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 md:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`flex items-center justify-center lg:justify-between p-3.5 md:p-5 rounded-xl md:rounded-[2rem] transition-all border-2 min-w-[140px] md:min-w-[180px] lg:min-w-0 flex-shrink-0 ${activeRole === role.id ? `bg-white border-indigo-600 shadow-xl shadow-indigo-100 text-indigo-600` : "bg-transparent border-transparent text-slate-400 hover:bg-white"}`}
            >
              <div className="flex items-center gap-3">
                <role.icon size={18} className="md:size-[22px]" />
                <span className="font-black text-[11px] md:text-sm uppercase tracking-widest">{role.label}</span>
              </div>
              <span className={`hidden lg:inline-block text-[10px] font-black px-2.5 py-1 rounded-xl ${activeRole === role.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {allUsers.filter(u => u.branch === activeBranch && u.role === role.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* 3. MAIN CONTENT AREA */}
        <div className="lg:col-span-9 space-y-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input
              type="text"
              placeholder="Filter names or emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 md:py-5 bg-white border-none rounded-2xl md:rounded-[2rem] shadow-xl shadow-slate-200/40 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            />
          </div>

          <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden">
            {/* Table for Desktop, Card for Mobile/Tablet */}
            <div className="hidden xl:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((u) => (
                    <UserTableRow key={u._id} u={u} toggleStatus={toggleStatus} setSelectedUser={setSelectedUser} handleDelete={handleDelete} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="xl:hidden divide-y divide-slate-100">
              {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                <UserMobileCard key={u._id} u={u} toggleStatus={toggleStatus} setSelectedUser={setSelectedUser} handleDelete={handleDelete} />
              )) : <div className="p-10 text-center text-slate-400 italic">No members found.</div>}
            </div>
          </div>
        </div>
      </div>

      {/* 4. RESPONSIVE ACTION DRAWER */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-[95%] sm:max-w-md bg-white z-50 shadow-2xl p-6 md:p-10 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Modify Record</h2>
                <button onClick={() => setSelectedUser(null)} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-rose-50 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Status</label>
                  <select value={selectedUser.status} onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})} className={`w-full p-4 rounded-xl md:rounded-2xl border-none font-bold outline-none ${selectedUser.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    <option value="active">Active Access</option>
                    <option value="inactive">Suspended / Inactive</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" value={selectedUser.name} onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl md:rounded-2xl border-none font-bold outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch</label>
                      <select value={selectedUser.branch} onChange={(e) => setSelectedUser({...selectedUser, branch: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl md:rounded-2xl border-none font-bold">
                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                      <select value={selectedUser.role} onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl md:rounded-2xl border-none font-bold">
                        {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                      </select>
                   </div>
                </div>

                <div className="pt-10">
                  <button type="submit" disabled={isUpdating} className="w-full py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black shadow-xl shadow-indigo-200">
                    {isUpdating ? "Syncing..." : "Update Registry"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// COMPONENT: Desktop Table Row
const UserTableRow = ({ u, toggleStatus, setSelectedUser, handleDelete }) => (
  <tr className={`group transition-all ${u.status === 'inactive' ? 'bg-slate-50/50' : 'hover:bg-indigo-50/30'}`}>
    <td className="px-10 py-6">
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg ${u.status === 'active' ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
          {u.name.charAt(0)}
        </div>
        <div className={u.status === 'inactive' ? 'opacity-50' : ''}>
          <p className="font-black text-slate-900 text-lg leading-none mb-1">{u.name}</p>
          <p className="text-xs font-bold text-slate-400">{u.email}</p>
        </div>
      </div>
    </td>
    <td className="px-10 py-6 text-center">
      <StatusBtn u={u} toggleStatus={toggleStatus} />
    </td>
    <td className="px-10 py-6">
      <div className="flex items-center justify-end gap-3">
        <button onClick={() => setSelectedUser(u)} className="p-3 bg-white text-slate-400 hover:text-indigo-600 rounded-2xl border border-slate-100"><Edit3 size={18} /></button>
        <button onClick={() => handleDelete(u._id)} className="p-3 bg-white text-slate-400 hover:text-rose-600 rounded-2xl border border-slate-100"><Trash2 size={18} /></button>
      </div>
    </td>
  </tr>
);

// COMPONENT: Mobile/Tablet Card
const UserMobileCard = ({ u, toggleStatus, setSelectedUser, handleDelete }) => (
  <div className={`p-5 flex flex-col gap-4 ${u.status === 'inactive' ? 'bg-slate-50/50' : ''}`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${u.status === 'active' ? 'bg-indigo-600' : 'bg-slate-300'}`}>
          {u.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h4 className="font-black text-slate-900 leading-tight truncate">{u.name}</h4>
          <p className="text-[10px] font-bold text-slate-400 truncate">{u.email}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setSelectedUser(u)} className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Edit3 size={14}/></button>
        <button onClick={() => handleDelete(u._id)} className="p-2 bg-slate-50 text-rose-400 rounded-lg"><Trash2 size={14}/></button>
      </div>
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
      <StatusBtn u={u} toggleStatus={toggleStatus} />
      <span className="text-[10px] font-black text-slate-300 uppercase">Batch: {u.branch}</span>
    </div>
  </div>
);

const StatusBtn = ({ u, toggleStatus }) => (
  <button 
    onClick={() => toggleStatus(u._id, u.status)}
    className={`inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
      u.status === 'active' 
      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
      : 'bg-rose-50 text-rose-600 border-rose-100'
    }`}
  >
    {u.status === 'active' ? <CheckCircle2 size={12}/> : <AlertCircle size={12}/>}
    {u.status || 'active'}
  </button>
);