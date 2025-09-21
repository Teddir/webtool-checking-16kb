'use client';

import { Upload, File, Loader2 } from 'lucide-react';

interface FileUploadProps {
  isUploading: boolean;
  uploadedFile: File | null;
  onFileUpload: (file: File) => void;
  onTryAnotherFile: () => void;
  formatFileSize: (bytes: number) => string;
}

export default function FileUpload({
  isUploading,
  uploadedFile,
  onFileUpload,
  onTryAnotherFile,
  formatFileSize
}: FileUploadProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isUploading
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800"></div>
              <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Analyzing your file...</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                This may take a few moments depending on file size
              </p>
              <div className="mt-3 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium mb-2">Drop your APK or ZIP file here</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                or click to browse files
              </p>
              <input
                type="file"
                accept=".apk,.zip"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <File className="w-4 h-4 mr-2" />
                Choose File
              </label>
            </div>
          </div>
        )}
      </div>

      {uploadedFile && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <File className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={onTryAnotherFile}
              className="ml-3 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Try Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
