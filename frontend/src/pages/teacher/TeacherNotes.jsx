import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNotes, createNote, deleteNote } from "../../services/noteService";
import { 
  FileText, Upload, Trash2, ExternalLink, 
  Search, BookOpen, GraduationCap, Calendar, 
  Plus, X, FilePlus
} from "lucide-react";
import toast from "react-hot-toast";

export const TeacherNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", subject: "", branch: "", year: "", file: null,
  });

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      toast.error("Failed to load notes");
    }
  };

  useEffect(() => { loadNotes(); }, []);

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setForm({ ...form, file: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      await createNote(formData);
      toast.success("Note uploaded successfully!");
      setForm({ title: "", description: "", subject: "", branch: "", year: "", file: null });
      loadNotes();
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource forever?")) return;
    try {
      await deleteNote(id);
      toast.success("Deleted");
      loadNotes();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-6 font-sans">
      
      {/* 1. HEADER SECTION */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <FileText size={12} /> Resource Cloud
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Study Materials</h1>
          <p className="text-slate-500 font-medium">Upload and manage PDFs for your students across all branches.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* 2. UPLOAD FORM - Left Sidebar style (4 cols) */}
        <div className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm sticky top-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <FilePlus size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">New Upload</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Document Title</label>
                <input name="title" value={form.title} placeholder="e.g. Unit 1: Data Structures" onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Subject</label>
                  <input name="subject" value={form.subject} placeholder="DSA" onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Branch</label>
                  <input name="branch" value={form.branch} placeholder="BCA" onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Academic Year</label>
                <input name="year" value={form.year} placeholder="2nd Year" onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm" required />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Brief Description</label>
                <textarea name="description" value={form.description} placeholder="What is this note about?" onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-sm min-h-[100px]" required />
              </div>

              <div className="relative group">
                <input type="file" name="file" accept="application/pdf" onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all text-center">
                  <Upload className="mx-auto mb-2 text-slate-400 group-hover:text-blue-500" size={24} />
                  <p className="text-xs font-bold text-slate-500 group-hover:text-blue-600">
                    {form.file ? form.file.name : "Choose PDF or Drop here"}
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isUploading ? "Uploading..." : "Publish Material"}
                {!isUploading && <Plus size={20} />}
              </button>
            </form>
          </motion.div>
        </div>

        {/* 3. NOTES LIST - Right content (8 cols) */}
        <div className="lg:col-span-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {notes.map((note) => (
                <motion.div 
                  key={note._id}
                  layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{note.branch}</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{note.year}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-1 line-clamp-1">{note.title}</h3>
                    <p className="text-sm font-bold text-indigo-500 mb-3">{note.subject}</p>
                    <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed mb-6">
                      {note.description}
                    </p>

                    <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                      <a
                        href={note.fileUrl} target="_blank" rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                      >
                        <ExternalLink size={14} /> View PDF
                      </a>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Material"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {notes.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <FileText className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No notes found for your department</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};