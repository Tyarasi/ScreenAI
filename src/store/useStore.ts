import { create } from 'zustand';
import { 
  AnalysisResult, 
  AnalysisState, 
  JobDescription, 
  Resume, 
  UploadState 
} from '@/types';

interface AppState {
  // Upload state
  uploadState: UploadState;
  setUploadState: (state: Partial<UploadState>) => void;
  resetUploadState: () => void;
  
  // Analysis state
  analysisState: AnalysisState;
  setAnalysisState: (state: Partial<AnalysisState>) => void;
  resetAnalysisState: () => void;
  
  // Resume and job description data
  resumes: Resume[];
  jobDescription: JobDescription | null;
  setResumes: (resumes: Resume[]) => void;
  setJobDescription: (jd: JobDescription) => void;
  addResume: (resume: Resume) => void;
  removeResume: (id: string) => void;
  clearResumes: () => void;
  clearJobDescription: () => void;
  
  // Analysis results
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult) => void;
  clearAnalysisResult: () => void;
}

const initialUploadState: UploadState = {
  isUploading: false,
  progress: 0,
  error: null,
};

const initialAnalysisState: AnalysisState = {
  isAnalyzing: false,
  progress: 0,
  error: null,
  result: null,
};

export const useStore = create<AppState>((set) => ({
  // Upload state
  uploadState: initialUploadState,
  setUploadState: (state) => set((prev) => ({ 
    uploadState: { ...prev.uploadState, ...state } 
  })),
  resetUploadState: () => set({ uploadState: initialUploadState }),
  
  // Analysis state
  analysisState: initialAnalysisState,
  setAnalysisState: (state) => set((prev) => ({ 
    analysisState: { ...prev.analysisState, ...state } 
  })),
  resetAnalysisState: () => set({ analysisState: initialAnalysisState }),
  
  // Resume and job description data
  resumes: [],
  jobDescription: null,
  setResumes: (resumes) => set({ resumes }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  addResume: (resume) => set((state) => ({ 
    resumes: [...state.resumes, resume] 
  })),
  removeResume: (id) => set((state) => ({ 
    resumes: state.resumes.filter((resume) => resume.id !== id) 
  })),
  clearResumes: () => set({ resumes: [] }),
  clearJobDescription: () => set({ jobDescription: null }),
  
  // Analysis results
  analysisResult: null,
  setAnalysisResult: (analysisResult) => set({ analysisResult }),
  clearAnalysisResult: () => set({ analysisResult: null }),
}));
