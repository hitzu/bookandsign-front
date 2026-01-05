export interface Note {
  id: number;
  content: string;
  kind: string;
  scope: string;
}

export interface CreateNotePayload {
  targetId: number;
  content: string;
  scope: string;
  kind: string;
}
