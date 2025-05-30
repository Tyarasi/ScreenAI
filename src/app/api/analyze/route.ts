import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Resume, JobDescription, AnalysisResult } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { resumes, jobDescription } = await request.json();

    if (!resumes || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing resumes or job description' },
        { status: 400 }
      );
    }

    // In a real implementation, this would call LangChain.js or Python backend
    // to analyze the resumes and job description using LLMs and embeddings
    // For now, we'll simulate the analysis with mock data

    // Extract skills from job description
    const requiredSkills = extractSkillsFromJobDescription(jobDescription.content);
    
    // Process each resume
    const processedResumes = resumes.map((resume: Resume) => {
      // Extract skills from resume
      const resumeSkills = extractSkillsFromResume(resume.content);
      
      // Calculate similarity score
      const similarityScore = calculateSimilarityScore(resumeSkills, requiredSkills);
      
      // Calculate keyword match score
      const keywordMatchScore = calculateKeywordMatchScore(resume.content, jobDescription.content);
      
      // Calculate ATS score
      const atsScore = calculateATSScore(resume);
      
      // Identify skill gaps
      const skillGap = identifySkillGaps(resumeSkills, requiredSkills);
      
      // Generate summary
      const summary = generateSummary(resume, jobDescription, similarityScore, skillGap);
      
      return {
        ...resume,
        parsed: {
          ...resume.parsed,
          skills: resumeSkills
        },
        scores: {
          similarity: similarityScore,
          keywordMatch: keywordMatchScore,
          atsScore: atsScore
        },
        skillGap,
        summary
      };
    });
    
    // Sort by similarity score
    const sortedResumes = [...processedResumes].sort(
      (a, b) => b.scores.similarity - a.scores.similarity
    );
    
    // Get top candidates (top 5)
    const topCandidates = sortedResumes.slice(0, 5);
    
    // Calculate skill frequency across all resumes
    const skillFrequency = calculateSkillFrequency(processedResumes);
    
    // Create analysis result
    const analysisResult: AnalysisResult = {
      resumes: processedResumes,
      jobDescription: {
        ...jobDescription,
        parsed: {
          requiredSkills,
          preferredSkills: [],
          responsibilities: [],
          qualifications: []
        }
      },
      topCandidates,
      skillFrequency
    };

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error) {
    console.error('Error analyzing resumes:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resumes' },
      { status: 500 }
    );
  }
}

// Helper functions for resume analysis
// In a real implementation, these would use NLP, LLMs, and embeddings

function extractSkillsFromJobDescription(content: string): string[] {
  // Mock implementation - would use NLP/LLM in real app
  const commonSkills = [
    'javascript', 'typescript', 'react', 'node.js', 'python', 
    'java', 'c++', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'sql', 'nosql', 'mongodb', 'postgresql', 'communication',
    'teamwork', 'leadership', 'problem-solving', 'agile', 'scrum'
  ];
  
  return commonSkills.filter(skill => 
    content.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractSkillsFromResume(content: string): string[] {
  // Mock implementation - would use NLP/LLM in real app
  const commonSkills = [
    'javascript', 'typescript', 'react', 'node.js', 'python', 
    'java', 'c++', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'sql', 'nosql', 'mongodb', 'postgresql', 'communication',
    'teamwork', 'leadership', 'problem-solving', 'agile', 'scrum'
  ];
  
  // Randomly select 5-10 skills
  const count = Math.floor(Math.random() * 6) + 5;
  const shuffled = [...commonSkills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function calculateSimilarityScore(resumeSkills: string[], requiredSkills: string[]): number {
  // Mock implementation - would use embeddings in real app
  if (requiredSkills.length === 0) return 0;
  
  const matchingSkills = resumeSkills.filter(skill => 
    requiredSkills.includes(skill)
  );
  
  return (matchingSkills.length / requiredSkills.length) * 100;
}

function calculateKeywordMatchScore(resumeContent: string, jobContent: string): number {
  // Mock implementation - would use more sophisticated keyword extraction in real app
  // For now, just return a random score between 50-100
  return Math.floor(Math.random() * 51) + 50;
}

function calculateATSScore(resume: Resume): number {
  // Mock implementation - would check formatting, section completeness, etc.
  // For now, just return a random score between 60-95
  return Math.floor(Math.random() * 36) + 60;
}

function identifySkillGaps(resumeSkills: string[], requiredSkills: string[]): string[] {
  // Find skills in required that are not in resume
  return requiredSkills.filter(skill => !resumeSkills.includes(skill));
}

function generateSummary(
  resume: Resume, 
  jobDescription: JobDescription, 
  similarityScore: number, 
  skillGap: string[]
): string {
  // Mock implementation - would use LLM in real app
  const matchQuality = similarityScore > 80 
    ? 'excellent' 
    : similarityScore > 60 
      ? 'good' 
      : 'moderate';
  
  const gapText = skillGap.length > 0 
    ? `Missing skills: ${skillGap.join(', ')}.` 
    : 'No significant skill gaps identified.';
  
  return `This candidate shows ${matchQuality} alignment with the job requirements. ${gapText} Consider reviewing their experience in more detail.`;
}

function calculateSkillFrequency(resumes: Resume[]): Record<string, number> {
  const frequency: Record<string, number> = {};
  
  resumes.forEach(resume => {
    resume.parsed.skills.forEach(skill => {
      frequency[skill] = (frequency[skill] || 0) + 1;
    });
  });
  
  return frequency;
}
