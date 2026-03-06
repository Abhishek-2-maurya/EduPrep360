import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "../../services/noteService";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  FileText, Search, Trash2, ExternalLink, 
  Layers, Filter, BookOpen, Calendar, 
  User, Download, ChevronRight, Hash
} from "lucide-react";

export const AdminNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeBranch, setActiveBranch] = useState("All");

  const branches = ["All", "BTECH", "BCA", "BBA"];

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const data = await getNotes();
      setNotes(data);
    } catch {
      toast.error("Failed to sync resource database");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently remove "${title}" from the cloud?`)) return;
    try {
      await deleteNote(id);
      toast.success("Resource expunged");
      loadNotes();
    } catch {
      toast.error("Deletion protocol failed");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesBranch = activeBranch === "All" || note.branch === activeBranch;
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.teacherId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8F9FD]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 pt-4 md:pt-8 font-sans overflow-x-hidden">
      
      {/* 1. RESOURCE HERO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
              <FileText size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              Resource <span className="text-indigo-600">Library</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100 w-fit px-3 py-1 rounded-full">
            System Admin <ChevronRight size={10} /> Centralized Content
          </div>
        </div>

        {/* Branch Quick Filter */}
        <div className="flex bg-white p-1.5 rounded-2xl md:rounded-3xl shadow-xl border border-slate-100 overflow-x-auto no-scrollbar">
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => setActiveBranch(b)}
              className={`px-6 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
                activeBranch === b 
                ? "bg-slate-900 text-white shadow-lg" 
                : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* 2. STATS & SEARCH SIDEBAR */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Storage Stats</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Total Files</span>
                <span className="text-sm font-black text-indigo-600">{notes.length}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '70%' }} 
                  className="h-full bg-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={18} />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-slate-700"
            />
          </div>
        </div>

        {/* 3. NOTES LISTING */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden">
            
            {/* Table View (Desktop) */}
            <div className="hidden md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Document</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ownership</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredNotes.length > 0 ? (
                      filteredNotes.map((note, i) => (
                        <motion.tr 
                          key={note._id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="hover:bg-indigo-50/30 transition-colors group"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
                                <FileText size={20} />
                              </div>
                              <div className="max-w-[200px]">
                                <p className="font-black text-slate-900 leading-tight truncate">{note.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5">{note.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black">
                                {note.teacherId?.name?.charAt(0)}
                              </div>
                              <span className="text-xs font-bold text-slate-600">{note.teacherId?.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase">
                              {note.branch} • Yr {note.year}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a 
                                href={note.fileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-2 bg-white text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-100 transition-all"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <button 
                                onClick={() => handleDelete(note._id, note.title)}
                                className="p-2 bg-white text-slate-400 hover:text-rose-600 rounded-xl shadow-sm border border-slate-100 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-20 text-center">
                          <Filter className="mx-auto text-slate-200 mb-4" size={48} />
                          <p className="text-slate-400 font-bold italic">No documents match your filter.</p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredNotes.map((note) => (
                <div key={note._id} className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 leading-tight">{note.title}</h4>
                        <p className="text-xs text-slate-500">{note.teacherId?.name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">
                      {note.branch}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a href={note.fileUrl} target="_blank" rel="noreferrer" className="flex-1 bg-slate-50 text-slate-600 py-2 rounded-xl text-center text-xs font-bold">View File</a>
                    <button onClick={() => handleDelete(note._id)} className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl text-center text-xs font-bold">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};