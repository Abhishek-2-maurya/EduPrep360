import { useEffect, useState } from "react";
import { getNotes } from "../../services/noteService";
import { FileText, Eye, Download, X } from "lucide-react";

export const StudentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewPdf, setPreviewPdf] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading notes...</div>;
  }

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-6">Study Materials</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col"
          >
            <FileText className="text-purple-500 mb-3" size={32} />
            <h3 className="font-semibold text-lg mb-1">{note.title}</h3>
            <p className="text-sm text-gray-500 mb-4 grow">
              {note.description}
            </p>

            <div className="flex gap-3 mt-auto">
              {/* View Button */}
              <button
                onClick={() => setPreviewPdf(note.fileUrl)}
                className="flex items-center gap-1 flex-1 justify-center bg-purple-50 text-purple-700 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
              >
                <Eye size={16} />
                View
              </button>

              
              <a
                href={note.fileUrl.replace("/upload/", "/upload/fl_attachment/")}
                download
                className="flex items-center gap-1 flex-1 justify-center bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <Download size={16} />
                Save
              </a>
            </div>
          </div>
        ))}
      </div>

      
      {previewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-800">Document Preview</h3>
              <button 
                onClick={() => setPreviewPdf(null)}
                className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            
            <div className="grow w-full h-full bg-gray-100">
              <iframe
                src={previewPdf}
                className="w-full h-full border-none"
                title="PDF Preview"
              ></iframe>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};