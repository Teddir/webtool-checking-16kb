'use client';

import { useState, useCallback, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import ResultsDisplay from '@/components/ResultsDisplay';
import Footer from '@/components/Footer';

interface LibraryResult {
  name: string;
  architecture: string;
  alignment: string;
  status: 'ALIGNED' | 'UNALIGNED' | 'FAILED';
  isCritical: boolean;
}

interface ScanResults {
  status: string;
  totalLibraries: number;
  alignedLibraries: number;
  unalignedLibraries: number;
  criticalFailures: number;
  libraries: LibraryResult[];
  summary: string;
  complianceStatus: 'PASSED' | 'FAILED' | 'unknown';
  recommendations: string[];
  isFlutterApp?: boolean;
  flutterVersion?: string;
}

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<ScanResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    setResults(null);
    setUploadedFile(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed');
      }

      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const tryAnotherFile = useCallback(() => {
    setUploadedFile(null);
    setResults(null);
    setError(null);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Check Your Android App&apos;s 16KB Compatibility</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Verify that your APK or native libraries are compatible with Android&apos;s 16KB page size requirement 
            for Google Play compliance by November 1st, 2025.
          </p>
        </div>

        {/* File Upload */}
        <FileUpload
          isUploading={isUploading}
          uploadedFile={uploadedFile}
          onFileUpload={handleFileUpload}
          onTryAnotherFile={tryAnotherFile}
          formatFileSize={formatFileSize}
        />

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
              </div>
              <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && <ResultsDisplay results={results} />}
      </main>

      <Footer />
    </div>
  );
}