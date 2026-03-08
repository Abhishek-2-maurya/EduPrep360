import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "../../services/noteService";
import toast from "react-hot-toast";
import { FileText, User, Trash2, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

export const HodNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError("Failed to load notes. Please try again later.");
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id) => {
    // Optional: Add a confirmation dialog before deleting
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(id);
      toast.success("Note deleted successfully");
      // Optimistically remove the note from UI or reload
      loadNotes();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 flex items-center gap-3">
        <AlertCircle size={20} />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Branch Notes</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and review study materials uploaded by teachers.
        </p>
      </div>

      {notes.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No notes available</h3>
          <p className="text-gray-500 mb-4 text-sm">There are currently no notes uploaded for this branch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              
              <div className="p-6 border-b border-gray-100 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    <User size={12} />
                    {note.teacherId?.name || "Unknown Teacher"}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                    <FileText size={12} />
                    PDF
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2" title={note.title}>
                  {note.title}
                </h3>
                
                <p className="text-sm text-gray-600 line-clamp-3">
                  {note.description}
                </p>
              </div>
              
              {/* Footer Actions */}
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm text-sm"
                >
                  <ExternalLink size={16} />
                  View PDF
                </a>
                
                <button
                  onClick={() => handleDelete(note._id)}
                  className="flex justify-center items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium shadow-sm text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};