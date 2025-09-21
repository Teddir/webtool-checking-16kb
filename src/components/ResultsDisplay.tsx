'use client';

import { CheckCircle, XCircle, File, Upload } from 'lucide-react';

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

interface ResultsDisplayProps {
  results: ScanResults;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
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
            <p>Your app meets all the requirements for Google Play&apos;s 16KB page size compliance.</p>
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

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          🚀 Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.criticalFailures === 0 && (
            <button 
              onClick={() => {
                window.open('https://play.google.com/console', '_blank');
              }}
              className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Try Play Store Upload</span>
            </button>
          )}
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
    </div>
  );
}
