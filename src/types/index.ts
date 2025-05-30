export interface Resume {
  id: string;
  fileName: string;
  fileType: string;
  filePath: string;
  content: string;
  parsed: {
    skills: string[];
    experience: string[];
    education: string[];
    contact: {
      name?: string;
      email?: string;
      phone?: string;
    };
  };
  scores: {
    similarity: number;
    keywordMatch: number;
    atsScore: number;
  };
  skillGap: string[];
  summary: string;
}

export interface JobDescription {
  id: string;
  content: string;
  parsed: {
    requiredSkills: string[];
    preferredSkills: string[];
    responsibilities: string[];
    qualifications: string[];
  };
  summary: string;
}

export interface AnalysisResult {
  resumes: Resume[];
  jobDescription: JobDescription;
  topCandidates: Resume[];
  skillFrequency: Record<string, number>;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  error: string | null;
  result: AnalysisResult | null;
}
