'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import FileUpload from '@/components/dashboard/FileUpload';
import JobDescriptionInput from '@/components/dashboard/JobDescriptionInput';
import ResumeAnalytics from '@/components/dashboard/ResumeAnalytics';
import { useStore } from '@/store/useStore';
import { LucideFileText, LucideUsers, LucideBarChart, LucideCheckCircle } from 'lucide-react';

export default function Home() {
  const { 
    resumes, 
    jobDescription, 
    analysisState,
    setAnalysisState
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('upload');
  const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);

  // Generate mock word cloud data based on resumes
  useEffect(() => {
    if (resumes.length > 0) {
      const skillMap: Record<string, number> = {};
      
      // Collect skills from all resumes
      resumes.forEach(resume => {
        resume.parsed.skills.forEach(skill => {
          skillMap[skill] = (skillMap[skill] || 0) + 1;
        });
      });
      
      // Convert to word cloud format
      const cloudData = Object.entries(skillMap).map(([text, value]) => ({
        text,
        value
      }));
      
      setWordCloudData(cloudData);
    }
  }, [resumes]);

  const handleAnalyzeResumes = () => {
    if (resumes.length === 0 || !jobDescription) {
      alert('Please upload at least one resume and add a job description.');
      return;
    }

    setAnalysisState({ 
      isAnalyzing: true, 
      progress: 0, 
      error: null 
    });

    // Simulate analysis progress
    const interval = setInterval(() => {
      // Get current state to calculate next progress value
      const currentProgress = analysisState.progress;
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setAnalysisState({ 
          isAnalyzing: false,
          progress: 100,
          error: null 
        });
      } else {
        setAnalysisState({ 
          progress: currentProgress + 10 
        });
      }
    }, 300);

    // Simulate analysis completion after 3 seconds
    setTimeout(() => {
      clearInterval(interval);
      
      // Generate mock analysis results
      const updatedResumes = resumes.map(resume => ({
        ...resume,
        scores: {
          similarity: Math.random() * 100,
          keywordMatch: Math.random() * 100,
          atsScore: Math.random() * 100
        },
        skillGap: generateMockSkillGaps(),
        summary: 'This is a mock summary of the resume.'
      }));
      
      // Sort by similarity score
      const sortedResumes = [...updatedResumes].sort(
        (a, b) => b.scores.similarity - a.scores.similarity
      );
      
      // Set top candidates
      const topCandidates = sortedResumes.slice(0, 5);
      
      setAnalysisState({
        isAnalyzing: false,
        progress: 100,
        error: null,
        result: {
          resumes: updatedResumes,
          jobDescription,
          topCandidates,
          skillFrequency: wordCloudData.reduce((acc, { text, value }) => {
            acc[text] = value;
            return acc;
          }, {} as Record<string, number>)
        }
      });
      
      // Switch to results tab
      setActiveTab('results');
    }, 3000);
  };

  // Helper function to generate mock skill gaps
  const generateMockSkillGaps = () => {
    const allGaps = [
      'Kubernetes', 'GraphQL', 'AWS Lambda', 'Terraform',
      'CI/CD', 'System Design', 'Microservices', 'Redis'
    ];
    
    // Randomly select 1-3 skill gaps
    const count = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...allGaps].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Resumes Uploaded"
            value={resumes.length}
            icon={<LucideFileText className="h-6 w-6 text-blue-500" />}
            color="blue"
          />
          <StatCard
            title="Job Description"
            value={jobDescription ? 'Added' : 'Not Added'}
            icon={<LucideCheckCircle className="h-6 w-6 text-green-500" />}
            color="green"
          />
          <StatCard
            title="Top Candidates"
            value={analysisState.result ? analysisState.result.topCandidates.length : 0}
            icon={<LucideUsers className="h-6 w-6 text-purple-500" />}
            color="purple"
          />
          <StatCard
            title="Analysis Complete"
            value={analysisState.result ? 'Yes' : 'No'}
            icon={<LucideBarChart className="h-6 w-6 text-orange-500" />}
            color="orange"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b">
            <nav className="flex">
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'upload'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('upload')}
              >
                Upload & Configure
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'results'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('results')}
                disabled={!analysisState.result}
              >
                Analysis Results
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upload' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Upload Resumes</h3>
                    <FileUpload />
                  </div>
                  <div>
                    <JobDescriptionInput />
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleAnalyzeResumes}
                    disabled={resumes.length === 0 || !jobDescription || analysisState.isAnalyzing}
                    className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {analysisState.isAnalyzing ? (
                      <>
                        <span>Analyzing Resumes...</span>
                        <div className="mt-2 h-2 w-full bg-blue-300 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${analysisState.progress}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      'Analyze Resumes'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <ResumeAnalytics />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Stat card component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]} mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};
