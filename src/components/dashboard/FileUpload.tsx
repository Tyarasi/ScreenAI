import React, { useCallback, useState } from 'react';
import { LucideUpload, LucideX, LucideFile } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { v4 as uuidv4 } from 'uuid';

export const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  
  const { 
    uploadState, 
    setUploadState, 
    addResume 
  } = useStore();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  }, []);

  const handleFiles = useCallback((newFiles: File[]) => {
    // Filter for only PDF, DOCX, and TXT files
    const validFiles = newFiles.filter(file => {
      const fileType = file.type;
      return fileType === 'application/pdf' || 
             fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
             fileType === 'text/plain';
    });
    
    if (validFiles.length !== newFiles.length) {
      alert('Only PDF, DOCX, and TXT files are supported.');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const uploadFiles = useCallback(async () => {
    if (files.length === 0) return;
    
    setUploadState({ isUploading: true, progress: 0, error: null });
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    try {
      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadState({ progress: i });
      }
      
      // In a real app, you would send the files to the server here
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // For now, we'll simulate a successful upload
      // and create mock resume objects
      files.forEach(file => {
        addResume({
          id: uuidv4(),
          fileName: file.name,
          fileType: file.type,
          filePath: `/uploads/${file.name}`,
          content: '',
          parsed: {
            skills: [],
            experience: [],
            education: [],
            contact: {}
          },
          scores: {
            similarity: 0,
            keywordMatch: 0,
            atsScore: 0
          },
          skillGap: [],
          summary: ''
        });
      });
      
      setUploadState({ isUploading: false, progress: 100 });
      setFiles([]);
    } catch (error) {
      setUploadState({ 
        isUploading: false, 
        error: error instanceof Error ? error.message : 'Failed to upload files' 
      });
    }
  }, [files, setUploadState, addResume]);

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <LucideUpload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="mb-2 text-sm text-gray-700">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PDF, DOCX, or TXT files only
          </p>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
            onChange={handleChange}
          />
          <label
            htmlFor="file-upload"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          >
            Select Files
          </label>
        </div>
      </div>
      
      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center">
                  <LucideFile className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <LucideX className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
          
          <button
            onClick={uploadFiles}
            disabled={uploadState.isUploading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {uploadState.isUploading ? 'Uploading...' : 'Upload Files'}
          </button>
          
          {/* Upload progress */}
          {uploadState.isUploading && (
            <div className="mt-4">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {uploadState.progress}%
              </p>
            </div>
          )}
          
          {/* Error message */}
          {uploadState.error && (
            <p className="mt-2 text-sm text-red-500">
              {uploadState.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
