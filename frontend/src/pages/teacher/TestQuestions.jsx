import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/axios";
import { 
  ChevronLeft, Save, Edit3, HelpCircle, 
  CheckCircle2, AlertCircle, Loader2, Sparkles,
  Layers, Hash, Zap, Cpu
} from "lucide-react";
import toast from "react-hot-toast";

export const TestQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/tests/${id}/questions`);
        setQuestions(response.data.data);
      } catch (err) {
        toast.error("Cloud synchronization failed");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  const handleUpdate = async (qId, updatedData) => {
    try {
      const correctIndex = updatedData.options.indexOf(updatedData.correctAnswer);
      await api.put(`/tests/question/${qId}`, {
        questionText: updatedData.questionText,
        options: updatedData.options,
        correctAnswer: correctIndex
      });
      
      setQuestions((prev) =>
        prev.map((q) => (q._id === qId ? { ...q, ...updatedData, correctAnswer: correctIndex } : q))
      );
      setEditingId(null);
      toast.success("Manifest Updated");
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8F9FD] p-6 text-center">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"
      />
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing Registry...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F8FF] pb-20 pt-6 md:pt-12 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* TOP NAV: Responsive stacking for small screens */}
        <nav className="mb-10 md:mb-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto group flex items-center justify-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-500 hover:text-indigo-600 transition-all hover:shadow-md active:scale-95"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-black uppercase text-[10px] tracking-widest">Exit Manifest</span>
          </button>
          
          <div className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Cpu size={14} className="text-indigo-600" />
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">
              ID: <span className="text-slate-900">{id.slice(-6)}</span>
            </span>
          </div>
        </nav>

        {/* HEADER SECTION: Scaled down text for mobile */}
        <header className="mb-16 md:mb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full font-black text-[9px] uppercase tracking-[0.2em] mb-6 shadow-xl shadow-indigo-200"
          >
            <Sparkles size={12} /> Live Engine
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-4 md:mb-6 leading-tight">
            Question <span className="text-indigo-600">Manifest</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-lg mx-auto text-sm md:text-lg leading-relaxed px-4">
            Refine your evaluation logic. Changes are synchronized in real-time across the infrastructure.
          </p>
        </header>

        {/* QUESTIONS CONTAINER */}
        <div className="space-y-8 md:space-y-16">
          <AnimatePresence mode="popLayout">
            {questions.map((q, idx) => (
              <QuestionRow 
                key={q._id} 
                question={q} 
                index={idx} 
                isEditing={editingId === q._id}
                onEdit={() => setEditingId(q._id)}
                onSave={(data) => handleUpdate(q._id, data)}
                onCancel={() => setEditingId(null)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const QuestionRow = ({ question, index, isEditing, onEdit, onSave, onCancel }) => {
  const [tempData, setTempData] = useState({ ...question });

  useEffect(() => {
    const initialCorrect = (typeof question.correctAnswer === 'number' && question.options[question.correctAnswer])
      ? question.options[question.correctAnswer]
      : (question.correctAnswer || "");
    setTempData({ ...question, correctAnswer: initialCorrect });
  }, [question, isEditing]);

  const handleOptionChange = (idx, newValue) => {
    const updated = [...tempData.options];
    const old = updated[idx];
    updated[idx] = newValue;
    const newCorrect = tempData.correctAnswer === old ? newValue : tempData.correctAnswer;
    setTempData({ ...tempData, options: updated, correctAnswer: newCorrect });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-4*1 md:rounded-[3rem] transition-all duration-500 border-2 ${
        isEditing 
          ? 'bg-white border-indigo-600 shadow-2xl shadow-indigo-100 scale-[1.01] md:scale-[1.02] z-50' 
          : 'bg-white/70 backdrop-blur-xl border-white shadow-xl shadow-slate-200/50 hover:bg-white'
      }`}
    >
      {/* RESPONSIVE FLOATING INDEX: Hidden on very small screens, adjusted on mobile */}
      <div className="absolute -left-2 md:-left-8 top-6 md:top-12 w-10 h-10 md:w-16 md:h-16 bg-slate-900 text-white rounded-xl md:rounded-3*1 flex items-center justify-center font-black text-sm md:text-2xl shadow-2xl border-2 md:border-4 border-[#F6F8FF] z-10 select-none">
        {index + 1}
      </div>

      <div className="p-6 pt-12 md:p-12 md:pl-16">
        {/* ROW ACTIONS: Sticky header style for edit controls on mobile */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-4 mb-8 md:mb-10">
          {!isEditing ? (
            <button 
              onClick={onEdit} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
            >
              <Edit3 size={16} /> 
              <span className="font-black uppercase text-[10px] tracking-widest">Edit Entry</span>
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
               <button onClick={onCancel} className="w-full sm:w-auto py-3 text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 tracking-widest transition-colors order-2 sm:order-1">Discard</button>
               <button 
                onClick={() => onSave(tempData)} 
                className="w-full sm:w-auto px-8 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-300 hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2"
               >
                <Save size={16} /> Save Changes
               </button>
            </div>
          )}
        </div>

        {/* TEXT AREA: Font size scales for mobile */}
        <div className="mb-10 md:mb-14">
          {isEditing ? (
            <textarea 
              className="w-full p-6 md:p-8 bg-slate-50 border-none rounded-3*1 md:rounded-[2.5rem] font-bold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all min-h-25 text-base md:text-xl leading-relaxed shadow-inner"
              value={tempData.questionText || tempData.question || ""}
              onChange={(e) => setTempData({...tempData, questionText: e.target.value})}
            />
          ) : (
            <h3 className="text-xl md:text-3xl font-black text-slate-900 leading-snug md:leading-tight tracking-tight pr-4">
              {question.questionText || question.question}
            </h3>
          )}
        </div>

        {/* OPTIONS GRID: Stacks on mobile, 2-cols on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {tempData.options.map((opt, i) => {
            const isCorrect = isEditing 
              ? tempData.correctAnswer === opt
              : question.correctAnswer === i;

            return (
              <div 
                key={i}
                className={`p-2 pr-4 md:pr-6 rounded-3*1 md:rounded-4*1 border-2 transition-all duration-300 flex items-center gap-3 md:gap-4 ${
                  isCorrect 
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-lg shadow-emerald-100' 
                  : 'border-slate-100 bg-white'
                }`}
              >
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setTempData({...tempData, correctAnswer: opt})}
                      className={`ml-1 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${
                        tempData.correctAnswer === opt 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                        : 'bg-white text-slate-200 border-2 border-slate-100'
                      }`}
                    >
                      <CheckCircle2 size={18} className="md:w-5 md:h-5" />
                    </button>
                    <input 
                      type="text"
                      className="flex-1 bg-transparent border-none font-bold text-slate-700 outline-none p-2 md:p-4 text-xs md:text-sm focus:ring-0"
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <div className={`ml-2 md:ml-4 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${
                      isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'
                    }`}>
                      <Hash size={16} className="opacity-40" />
                    </div>
                    <span className={`text-xs md:text-sm font-bold flex-1 py-3 md:py-4 leading-relaxed ${isCorrect ? 'text-emerald-950' : 'text-slate-600'}`}>
                      {opt}
                    </span>
                    {isCorrect && <CheckCircle2 size={18} className="text-emerald-500 md:w-5 md:h-5" />}
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        {/* FOOTER: Adjusted for smaller screens */}
        {isEditing && (
          <div className="flex items-center justify-center gap-3 text-indigo-500 bg-indigo-50/50 p-4 rounded-[1.2rem] md:rounded-3xl mt-10 border border-indigo-100 text-center">
            <Zap size={14} className="animate-pulse shrink-0" />
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Toggle checkmark for correct response logic</p>
          </div>
        )}
        
        {!isEditing && (
           <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-50 pt-6 md:pt-8 gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <AlertCircle size={14} />
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Payload ID: {question._id.slice(-8)}</p>
              </div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-300">Standard MCQ Schema</p>
           </div>
        )}
      </div>
    </motion.div>
  );
};