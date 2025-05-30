import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { JobDescription } from '@/types';

export const JobDescriptionInput = () => {
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { setJobDescription } = useStore();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJdText(e.target.value);
  };

  const analyzeJobDescription = async () => {
    if (!jdText.trim()) {
      alert('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);

    try {
      // In a real app, you would send the job description to the backend for analysis
      // For now, we'll simulate the analysis with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a mock job description object with parsed data
      const jobDescription: JobDescription = {
        id: uuidv4(),
        content: jdText,
        parsed: {
          requiredSkills: extractSkills(jdText),
          preferredSkills: [],
          responsibilities: [],
          qualifications: []
        },
        summary: 'Job description analysis will be performed by the backend.'
      };

      setJobDescription(jobDescription);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Error analyzing job description:', error);
      setIsAnalyzing(false);
    }
  };

  // Simple function to extract potential skills from text
  // In a real app, this would be done by the backend using NLP
  const extractSkills = (text: string): string[] => {
    const commonSkills = [
      'javascript', 'typescript', 'react', 'node.js', 'python', 
      'java', 'c++', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
      'sql', 'nosql', 'mongodb', 'postgresql', 'communication',
      'teamwork', 'leadership', 'problem-solving', 'agile', 'scrum'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    return foundSkills;
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-2">Job Description</h3>
      <p className="text-sm text-gray-600 mb-4">
        Paste the job description to analyze and match with resumes
      </p>
      
      <textarea
        value={jdText}
        onChange={handleTextChange}
        placeholder="Paste job description here..."
        className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <button
        onClick={analyzeJobDescription}
        disabled={isAnalyzing || !jdText.trim()}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Job Description'}
      </button>
    </div>
  );
};

export default JobDescriptionInput;
