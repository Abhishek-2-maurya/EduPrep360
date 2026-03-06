import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "../../services/noteService";
import toast from "react-hot-toast";

export const HodNotes = () => {
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch {
      toast.error("Failed to load notes");
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      toast.success("Note deleted");
      loadNotes();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Branch Notes</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div key={note._id} className="bg-white p-6 rounded-xl shadow border">
            <h3 className="font-semibold">{note.title}</h3>
            <p className="text-sm text-gray-500">{note.description}</p>

            <p className="text-xs mt-2 text-gray-400">
              Teacher: {note.teacherId?.name}
            </p>

            <div className="flex justify-between mt-4">
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm"
              >
                View PDF
              </a>

              <button
                onClick={() => handleDelete(note._id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};