'use client';

import { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, XCircle, AlertTriangle, Loader2, Moon, Sun } from 'lucide-react';
import Image from 'next/image';

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Image src="/logo.png" alt="16K" width={32} height={32} />
                <h1 className="text-xl font-bold">16KBPSChecker</h1>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Check Your Android App&apos;s 16KB Compatibility</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Verify that your APK or native libraries are compatible with Android&apos;s 16KB page size requirement 
              for Google Play compliance by November 1st, 2025.
            </p>
          </div>

          {/* Upload Section */}
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
                    onClick={() => {
                      setUploadedFile(null);
                      setResults(null);
                      setError(null);
                    }}
                    className="ml-3 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Try Another File
                  </button>
                </div>
              </div>
            )}
          </div>

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
          {results && (
            <div className="space-y-8">
              {/* Success Case - Additional Guidance */}
              {results.complianceStatus === 'PASSED' && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                      🎉 Congratulations! Your app is 16KB compatible!
                    </h3>
                  </div>
                  <div className="space-y-3 text-green-700 dark:text-green-300">
                    <p>Your app meets all the requirements for Google Play's 16KB page size compliance.</p>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Next Steps:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Test your app on Android 15 emulator with 16KB system image</li>
                        <li>• Verify with: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">adb shell getconf PAGE_SIZE</code> (should return 16384)</li>
                        <li>• Check for any hardcoded PAGE_SIZE dependencies in your code</li>
                        <li>• Ensure all third-party SDKs are also 16KB compatible</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {/* Summary Card */}
              <div className={`rounded-lg p-6 ${
                results.complianceStatus === 'PASSED' 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center space-x-3 mb-4">
                  {results.complianceStatus === 'PASSED' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <h3 className="text-xl font-bold">
                    {results.complianceStatus === 'PASSED' ? 'Compatibility Check Passed' : 'Compatibility Check Failed'}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{results.summary}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.totalLibraries}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Total Libraries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {results.alignedLibraries}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Aligned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {results.unalignedLibraries}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Unaligned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {results.criticalFailures}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Critical</div>
                  </div>
                </div>
              </div>

              {/* Libraries Table */}
              {results.libraries.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold">Library Analysis</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Library
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Architecture
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Alignment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {results.libraries.map((lib, index) => (
                          <tr key={index} className={lib.isCritical ? 'bg-orange-50 dark:bg-orange-900/20' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              {lib.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {lib.architecture}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                              {lib.alignment}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {lib.status === 'ALIGNED' ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <span className={`text-sm font-medium ${
                                  lib.status === 'ALIGNED' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {lib.status}
                                </span>
                                {lib.isCritical && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                    Critical
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Detailed Fix Instructions */}
              {results.complianceStatus === 'FAILED' && (
                <div className="space-y-6">
                  {/* Quick Fix Summary */}
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
                        Action Required
                      </h3>
                    </div>
                    <div className="space-y-3 text-red-700 dark:text-red-300">
                      <p className="font-medium">
                        {results.criticalFailures > 0 
                          ? `Your app has ${results.criticalFailures} critical alignment issues that must be fixed for Google Play compliance.`
                          : `Your app has ${results.unalignedLibraries} non-critical alignment issues that should be fixed for complete compatibility.`
                        }
                      </p>
                      {results.criticalFailures === 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 text-blue-600 mt-0.5">💡</div>
                            <div>
                              <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                                Try Uploading to Play Store First
                              </p>
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                Since you have no critical failures, you can try uploading your app to Google Play Console. 
                                The Play Console will show specific 16KB alignment warnings if any issues need to be addressed.
                              </p>
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                Google Play Console → App Bundle Explorer → Check for 16KB native library alignment messages
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <p>Follow the steps below to fix these issues:</p>
                    </div>
                  </div>

                  {/* Step-by-Step Fix Guide */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        🔧 Step-by-Step Fix Guide
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Follow these steps to make your app 16KB compatible
                      </p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      {/* Step 1: Update Build Tools */}
                      <div className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Update Your Build Environment</h4>
                        </div>
                        <div className="ml-8 space-y-3">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Android Gradle Plugin (AGP)</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Update to version 8.5.1 or higher in your project-level build.gradle:</p>
                            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                              <div>// project/build.gradle</div>
                              <div>buildscript {'{'}</div>
                              <div>  dependencies {'{'}</div>
                              <div>    classpath 'com.android.tools.build:gradle:8.5.1'</div>
                              <div>  {'}'}</div>
                              <div>{'}'}</div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Android NDK</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Update to NDK r27 or higher (r28+ recommended) in your app-level build.gradle:</p>
                            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                              <div>// app/build.gradle</div>
                              <div>android {'{'}</div>
                              <div>  ndkVersion "28.0.10711218"</div>
                              <div>{'}'}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Configure 16KB Alignment */}
                      <div className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Configure 16KB ELF Alignment</h4>
                        </div>
                        <div className="ml-8 space-y-3">
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">For NDK r28 and newer (Recommended)</h5>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              ✅ 16KB alignment is enabled by default - no changes needed!
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">For NDK r27</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Add to your app/build.gradle:</p>
                            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                              <div>android {'{'}</div>
                              <div>  defaultConfig {'{'}</div>
                              <div>    externalNativeBuild {'{'}</div>
                              <div>      cmake {'{'}</div>
                              <div>        arguments '-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON'</div>
                              <div>      {'}'}</div>
                              <div>    {'}'}</div>
                              <div>  {'}'}</div>
                              <div>{'}'}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 3: Rebuild and Test */}
                      <div className="border-l-4 border-purple-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Rebuild and Verify</h4>
                        </div>
                        <div className="ml-8 space-y-3">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Build Commands</h5>
                            <div className="space-y-2">
                              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                                ./gradlew clean
                              </div>
                              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                                ./gradlew assembleRelease
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Verification Commands</h5>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check APK alignment:</p>
                                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                                  zipalign -c -P 16 -v 4 app-release.apk
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Test on device (should return 16384):</p>
                                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                                  adb shell getconf PAGE_SIZE
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flutter-Specific Guidance */}
                  {(results.isFlutterApp || results.libraries.some(lib => 
                    lib.name.includes('flutter') || 
                    lib.name.includes('dart') || 
                    lib.name.includes('engine') ||
                    lib.name.includes('skia')
                  )) && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">🎯</span>
                        </div>
                        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                          Flutter App Detected
                        </h3>
                      </div>
                      <div className="space-y-4 text-purple-700 dark:text-purple-300">
                        <p className="font-medium">
                          Your app appears to be built with Flutter. Here are Flutter-specific steps to ensure 16KB compatibility:
                        </p>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Flutter-Specific Requirements:</h4>
                          
                          <div className="space-y-3">
                            <div className="border-l-4 border-purple-500 pl-4">
                              <h5 className="font-medium text-gray-900 dark:text-gray-100">1. Update Flutter SDK</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ensure you're using the latest stable Flutter version:</p>
                              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                                flutter --version
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Update with: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">flutter upgrade</code>
                              </p>
                            </div>
                            
                            <div className="border-l-4 border-purple-500 pl-4">
                              <h5 className="font-medium text-gray-900 dark:text-gray-100">2. Update Dependencies</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Update all Flutter dependencies in pubspec.yaml:</p>
                              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                                flutter pub upgrade
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Pay special attention to native plugins like camera, ads, analytics, ML, etc.
                              </p>
                            </div>
                            
                            <div className="border-l-4 border-purple-500 pl-4">
                              <h5 className="font-medium text-gray-900 dark:text-gray-100">3. Flutter Build Configuration</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Update your android/app/build.gradle:</p>
                              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                                <div>android {'{'}</div>
                                <div>  compileSdk 35</div>
                                <div>  ndkVersion "28.0.10711218"</div>
                                <div>  </div>
                                <div>  defaultConfig {'{'}</div>
                                <div>    targetSdkVersion 35</div>
                                <div>    // ... other config</div>
                                <div>  {'}'}</div>
                                <div>{'}'}</div>
                              </div>
                            </div>
                            
                            <div className="border-l-4 border-purple-500 pl-4">
                              <h5 className="font-medium text-gray-900 dark:text-gray-100">4. Test with Flutter DevTools</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Use Flutter's built-in analysis tools:</p>
                              <div className="space-y-2">
                                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                                  flutter build appbundle --analyze-size
                                </div>
                                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                                  flutter build apk --analyze-size
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Open the generated JSON file in DevTools to visualize native library sizes
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                          <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Common Flutter Issues:</h5>
                          <ul className="text-sm space-y-1 text-yellow-700 dark:text-yellow-300">
                            <li>• PDF plugins (flutter_pdfview) - update to latest versions</li>
                            <li>• Camera plugins - ensure they support 16KB alignment</li>
                            <li>• Analytics SDKs (Firebase, etc.) - check for compatibility updates</li>
                            <li>• Machine Learning plugins - verify TensorFlow Lite compatibility</li>
                            <li>• Custom native code - rebuild with 16KB alignment flags</li>
                          </ul>
                        </div>
                        
                        {results.criticalFailures === 0 && (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Flutter Upload Recommendation:</h5>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              Since your Flutter app has no critical alignment issues, you can try uploading to Google Play Console first. 
                              The Play Console's App Bundle Explorer will show specific 16KB alignment warnings if any Flutter dependencies need updates.
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                              This approach is often faster than updating all dependencies upfront, as Google Play will tell you exactly which libraries need attention.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      🚀 Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText('com.android.tools.build:gradle:8.5.1');
                          alert('Gradle version copied to clipboard!');
                        }}
                        className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                      >
                        <File className="w-4 h-4" />
                        <span>Copy Gradle Version</span>
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText('-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON');
                          alert('CMake argument copied to clipboard!');
                        }}
                        className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                      >
                        <File className="w-4 h-4" />
                        <span>Copy CMake Argument</span>
                      </button>
                      {(results.isFlutterApp || results.libraries.some(lib => 
                        lib.name.includes('flutter') || 
                        lib.name.includes('dart') || 
                        lib.name.includes('engine')
                      )) && (
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText('flutter build appbundle --analyze-size');
                            alert('Flutter build command copied to clipboard!');
                          }}
                          className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
                        >
                          <File className="w-4 h-4" />
                          <span>Copy Flutter Build Command</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      📚 Additional Resources
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a 
                        href="https://developer.android.com/guide/practices/page-sizes"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">📖</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">Official Guide</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Android 16KB page sizes</p>
                        </div>
                      </a>
                      <a 
                        href="https://developer.android.com/ndk/guides/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400 text-sm font-bold">⚙️</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">NDK Documentation</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Native development guide</p>
                        </div>
                      </a>
                      {(results.isFlutterApp || results.libraries.some(lib => 
                        lib.name.includes('flutter') || 
                        lib.name.includes('dart') || 
                        lib.name.includes('engine')
                      )) && (
                        <>
                          <a 
                            href="https://dev.to/smartterss/preparing-your-flutter-apps-for-google-plays-16kb-page-size-requirement-1g0j"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                              <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">🎯</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">Flutter 16KB Guide</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Complete Flutter preparation guide</p>
                            </div>
                          </a>
                          <a 
                            href="https://docs.flutter.dev/deployment/android"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                              <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">📱</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">Flutter Android Deploy</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Official deployment guide</p>
                            </div>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Google Play requires 16KB page size compatibility by November 1st, 2025</p>
              <p className="mt-2">
                <a 
                  href="https://developer.android.com/guide/practices/page-sizes" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Learn more about 16KB page sizes →
                </a>
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
