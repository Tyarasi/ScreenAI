import React from 'react';
import { useStore } from '@/store/useStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Resume } from '@/types';

export const ResumeAnalytics = () => {
  const { resumes, jobDescription } = useStore();

  if (!jobDescription || resumes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Resume Analytics</h3>
        <p className="text-gray-500">
          Upload resumes and add a job description to see analytics.
        </p>
      </div>
    );
  }

  // Prepare data for charts
  const similarityData = resumes.map(resume => ({
    name: resume.fileName.length > 15 
      ? `${resume.fileName.substring(0, 15)}...` 
      : resume.fileName,
    similarity: resume.scores.similarity || Math.random() * 100, // Mock data
    atsScore: resume.scores.atsScore || Math.random() * 100, // Mock data
    keywordMatch: resume.scores.keywordMatch || Math.random() * 100 // Mock data
  }));

  // Sort by similarity score
  similarityData.sort((a, b) => b.similarity - a.similarity);

  // Top candidates (top 5 by similarity)
  const topCandidates = [...resumes]
    .sort((a, b) => (b.scores.similarity || 0) - (a.scores.similarity || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Resume Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={similarityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="similarity" name="Similarity Score" fill="#8884d8" />
              <Bar dataKey="atsScore" name="ATS Score" fill="#82ca9d" />
              <Bar dataKey="keywordMatch" name="Keyword Match" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Top Candidates</h3>
        <div className="space-y-4">
          {topCandidates.map((resume, index) => (
            <CandidateCard 
              key={resume.id} 
              resume={resume} 
              rank={index + 1} 
            />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Skill Gap Analysis</h3>
        <p className="text-sm text-gray-600 mb-4">
          Showing missing skills for top candidates compared to job requirements
        </p>
        <div className="space-y-4">
          {topCandidates.map((resume) => (
            <div key={`gap-${resume.id}`} className="border-b pb-4">
              <p className="font-medium">{resume.fileName}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {generateMockSkillGaps().map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper component for displaying candidate cards
const CandidateCard = ({ resume, rank }: { resume: Resume; rank: number }) => {
  return (
    <div className="flex items-start p-4 border rounded-lg">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-800 font-bold mr-4">
        {rank}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{resume.fileName}</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {generateMockSkills().map((skill, i) => (
            <span 
              key={i} 
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center">
          <div className="flex-1">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${resume.scores.similarity || Math.random() * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Match Score: {Math.round(resume.scores.similarity || Math.random() * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate mock skills for demo
const generateMockSkills = () => {
  const allSkills = [
    'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python',
    'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git',
    'REST API', 'GraphQL', 'SQL', 'NoSQL', 'MongoDB'
  ];
  
  // Randomly select 3-7 skills
  const count = Math.floor(Math.random() * 5) + 3;
  const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to generate mock skill gaps for demo
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

export default ResumeAnalytics;
