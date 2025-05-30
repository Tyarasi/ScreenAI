'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useStore } from '@/store/useStore';
import { LucideUser, LucideAlertCircle, LucideCheckCircle, LucideXCircle } from 'lucide-react';
import { Resume } from '@/types';

export const CandidatesPage = () => {
  const { resumes, analysisState, jobDescription } = useStore();
  const [selectedCandidate, setSelectedCandidate] = useState<Resume | null>(null);

  // Sort resumes by similarity score
  const sortedResumes = [...resumes].sort(
    (a, b) => (b.scores.similarity || 0) - (a.scores.similarity || 0)
  );

  // Get top candidates (top 5)
  const topCandidates = sortedResumes.slice(0, 5);

  const handleCandidateClick = (candidate: Resume) => {
    setSelectedCandidate(candidate);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Candidates</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {topCandidates.length} Top Candidates
            </span>
          </div>
        </div>

        {!analysisState.result ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
            <LucideAlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No analysis results available</p>
            <p className="text-sm text-gray-500 mb-4">
              Upload resumes and analyze them to see candidates here
            </p>
            <a
              href="/"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Go to Dashboard
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-medium">Top Candidates</h3>
              </div>
              <div className="p-4">
                {topCandidates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No candidates available</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {topCandidates.map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${
                          selectedCandidate?.id === candidate.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                        onClick={() => handleCandidateClick(candidate)}
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 font-bold mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {candidate.fileName.length > 20
                              ? `${candidate.fileName.substring(0, 20)}...`
                              : candidate.fileName}
                          </h4>
                          <div className="flex items-center mt-1">
                            <div className="flex-1">
                              <div className="h-1.5 w-full bg-gray-200 rounded-full">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{
                                    width: `${candidate.scores.similarity}%`,
                                  }}
                                />
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">
                              {Math.round(candidate.scores.similarity)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
              {selectedCandidate ? (
                <div>
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Candidate Details</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start mb-6">
                      <div className="p-3 rounded-full bg-blue-100 mr-4">
                        <LucideUser className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          {selectedCandidate.fileName}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedCandidate.fileType}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <ScoreCard
                        title="Match Score"
                        value={Math.round(selectedCandidate.scores.similarity)}
                        color="green"
                      />
                      <ScoreCard
                        title="Keyword Match"
                        value={Math.round(selectedCandidate.scores.keywordMatch)}
                        color="blue"
                      />
                      <ScoreCard
                        title="ATS Score"
                        value={Math.round(selectedCandidate.scores.atsScore)}
                        color="purple"
                      />
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                        {selectedCandidate.summary ||
                          'No summary available for this candidate.'}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.parsed.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedCandidate.skillGap.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Skill Gaps</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.skillGap.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12">
                  <LucideUser className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">
                    Select a candidate to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Score card component
interface ScoreCardProps {
  title: string;
  value: number;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'red';
}

const ScoreCard = ({ title, value, color }: ScoreCardProps) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
  };

  const getScoreIcon = () => {
    if (value >= 80) {
      return <LucideCheckCircle className="h-5 w-5 text-green-500" />;
    } else if (value >= 50) {
      return <LucideCheckCircle className="h-5 w-5 text-orange-500" />;
    } else {
      return <LucideXCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-sm font-medium text-gray-500">{title}</h5>
        {getScoreIcon()}
      </div>
      <div className="flex items-end">
        <span className="text-2xl font-bold">{value}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            value >= 80
              ? 'bg-green-500'
              : value >= 50
              ? 'bg-orange-500'
              : 'bg-red-500'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default CandidatesPage;
