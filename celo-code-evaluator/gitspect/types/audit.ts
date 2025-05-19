export type AuditResult = {
  repoName?: string;
  analysis?: string;
  score?: number;
  metrics?: {
    stars?: number;
    forks?: number;
    contributors?: number;
    commits?: number;
    languages?: Record<string, number>;
  };
  criteria?: {
    name: string;
    score: string;
    justification: string;
  }[];
};

export type AuditResponse = {
  analyses: Record<string, string>;
  completed_repos: number;
  error: string | null;
  execution_time: number;
  success: boolean;
  total_repos: number;
};
