import { CreateNotePayload, Note } from "../../interfaces";

import {
  axiosInstanceWithToken,
  axiosInstanceWithoutToken,
} from "../config/axiosConfig";

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  try {
    const response = await axiosInstanceWithToken.post<Note>("/notes", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const getNotes = async (
  slotId: number,
  scope: string,
  kind: string
): Promise<Note[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("kind", kind);
    const response = await axiosInstanceWithToken.get<Note[]>(
      `/notes/${scope}/${slotId}?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
};

export const getPublicNotes = async (
  targetId: number,
  scope: string
): Promise<Note[]> => {
  try {
    const response = await axiosInstanceWithoutToken.get<Note[]>(
      `/notes/public/${scope}/${targetId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching public notes:", error);
    return [];
  }
};
