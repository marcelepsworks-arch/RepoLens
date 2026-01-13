export interface ProjectFile {
  filename: string;
  content: string;
  description: string;
}

export interface AnalysisResult {
  improvementPlan: string;
  files: ProjectFile[];
  sources: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: AnalysisResult | null;
  error: string | null;
}