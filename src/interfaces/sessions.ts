export interface SessionCacheClearResponse {
  ok: boolean;
  cleared: {
    sessions: number;
    galleries: number;
  };
}
