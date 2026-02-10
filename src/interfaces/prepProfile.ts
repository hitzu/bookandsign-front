export type PrepProfileAnswerValue =
  | string
  | boolean
  | number
  | null
  | PrepAssetMetadata
  | PrepAssetMetadata[]
  | Record<string, unknown>
  | unknown[];

export type PrepProfileAnswers = Record<string, PrepProfileAnswerValue>;

export interface PrepAssetMetadata {
  assetId?: number;
  path: string;
  mime: string;
  url?: string;
}

export interface PrepProfilePublicResponse {
  contractId: number;
  answers: PrepProfileAnswers;
  locked: Record<string, boolean>;
}

export type PrepProfileAnswerPatchItem = {
  questionId: string;
  value: PrepProfileAnswerValue;
};

export type PatchPrepProfileAnswersPayload = {
  answers: PrepProfileAnswerPatchItem[];
};

export type PatchPrepProfileAnswerPayload = {
  questionId: string;
  value: PrepProfileAnswerValue;
};

export type PrepProfileUploadUrlPayload = {
  questionId: string;
  fileName: string;
  mime: string;
};

export type PrepProfileUploadUrlResponse = {
  contractId: number;
  bucket: string;
  path: string;
  signedUrl: string;
  token: string;
  publicUrl: string;
};

