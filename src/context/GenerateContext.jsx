import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { EMPTY_TYPE_COUNTS } from '../data/questionTypes';

const GenerateContext = createContext(null);

const defaultBloom = {
  Remember: 15, Understand: 20, Apply: 30, Analyze: 25, Evaluate: 10, Create: 0,
};

export const GenerateProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedTopics, setExtractedTopics] = useState([]);
  const [extractStale, setExtractStale] = useState(true);

  const [docTitle, setDocTitle] = useState('');
  const [boardId, setBoardId] = useState('cambridge-sri-lanka');
  const [levelId, setLevelId] = useState('cambridge-igcse');
  const [subject, setSubject] = useState('');
  const [boardLabel, setBoardLabel] = useState('Cambridge');
  const [levelLabel, setLevelLabel] = useState('Cambridge IGCSE (Grade 9/10)');

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [typeCounts, setTypeCounts] = useState({ ...EMPTY_TYPE_COUNTS, MCQ: 10 });
  const [duration, setDuration] = useState(45);
  const [bloomLevels, setBloomLevels] = useState(defaultBloom);

  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [generateWarnings, setGenerateWarnings] = useState([]);
  const [paperId, setPaperId] = useState(null);
  const [totalMarks, setTotalMarks] = useState(0);
  const [generationNonce, setGenerationNonce] = useState(0);
  const [libraryEpoch, setLibraryEpoch] = useState(0);

  const notifyLibraryChanged = useCallback(() => {
    setLibraryEpoch((n) => n + 1);
  }, []);

  const resetSession = () => {
    setUploadedFiles([]);
    setExtractedTopics([]);
    setExtractStale(true);
    setDocTitle('');
    setSubject('');
    setSelectedTemplate(null);
    setTypeCounts({ ...EMPTY_TYPE_COUNTS, MCQ: 10 });
    setDuration(45);
    setBloomLevels(defaultBloom);
    setGeneratedQuestions([]);
    setGenerateWarnings([]);
    setPaperId(null);
    setTotalMarks(0);
    setGenerationNonce(0);
  };

  const value = useMemo(() => ({
    uploadedFiles, setUploadedFiles,
    extractedTopics, setExtractedTopics,
    extractStale, setExtractStale,
    docTitle, setDocTitle,
    boardId, setBoardId,
    levelId, setLevelId,
    subject, setSubject,
    boardLabel, setBoardLabel,
    levelLabel, setLevelLabel,
    selectedTemplate, setSelectedTemplate,
    typeCounts, setTypeCounts,
    duration, setDuration,
    bloomLevels, setBloomLevels,
    generatedQuestions, setGeneratedQuestions,
    generateWarnings, setGenerateWarnings,
    paperId, setPaperId,
    totalMarks, setTotalMarks,
    generationNonce, setGenerationNonce,
    libraryEpoch,
    notifyLibraryChanged,
    resetSession,
  }), [
    uploadedFiles, extractedTopics, extractStale, docTitle, boardId, levelId,
    subject, boardLabel, levelLabel, selectedTemplate, typeCounts, duration,
    bloomLevels, generatedQuestions, generateWarnings, paperId, totalMarks,
    generationNonce, libraryEpoch, notifyLibraryChanged,
  ]);

  return (
    <GenerateContext.Provider value={value}>
      {children}
    </GenerateContext.Provider>
  );
};

export const useGenerate = () => {
  const ctx = useContext(GenerateContext);
  if (!ctx) {
    throw new Error('useGenerate must be used within GenerateProvider');
  }
  return ctx;
};

export default GenerateContext;
