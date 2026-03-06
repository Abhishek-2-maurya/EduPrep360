import { api } from "../api/axios";

export const getNotes = async () => {
  const res = await api.get("/note");
  return res.data.data;
};

export const createNote = async (formData) => {
  const res = await api.post("/note", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteNote = async (id) => {
  return api.delete(`/note/${id}`);
};