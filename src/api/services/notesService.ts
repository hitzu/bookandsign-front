import { CreateNotePayload, Note } from "../../interfaces/notes";

import { axiosInstanceWithToken } from "../config/axiosConfig";

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  try {
    const response = await axiosInstanceWithToken.post<Note>("/notes", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};
