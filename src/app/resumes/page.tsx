'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import FileUpload from '@/components/dashboard/FileUpload';
import JobDescriptionInput from '@/components/dashboard/JobDescriptionInput';
import { useStore } from '@/store/useStore';
import { LucideFileText, LucideAlertCircle } from 'lucide-react';

export const ResumesPage = () => {
  const { resumes, jobDescription, uploadState } = useStore();
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resume Analysis</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'} Uploaded
            </span>
          </div>
        </div>

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
                Upload Resumes
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'job'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('job')}
              >
                Job Description
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'list'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('list')}
              >
                Resume List
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upload' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Upload Resumes</h3>
                <FileUpload />
              </div>
            )}

            {activeTab === 'job' && (
              <div>
                <JobDescriptionInput />
              </div>
            )}

            {activeTab === 'list' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Uploaded Resumes</h3>
                {resumes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <LucideAlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">No resumes uploaded yet</p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Upload Resumes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className="flex items-start p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="p-3 rounded-full bg-blue-50 mr-4">
                          <LucideFileText className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{resume.fileName}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {resume.fileType}
                          </p>
                          {resume.scores.similarity > 0 && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Match Score</span>
                                <span>{Math.round(resume.scores.similarity)}%</span>
                              </div>
                              <div className="h-2 w-full bg-gray-200 rounded-full">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${resume.scores.similarity}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumesPage;
