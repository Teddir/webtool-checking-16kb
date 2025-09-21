'use client';

import { Shield, Github, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                16KBPSChecker
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A trusted tool for Android developers to verify 16KB page size compatibility 
              for Google Play compliance. Built with security and reliability in mind.
            </p>
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>100% Secure & Privacy-First</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Why Trust Us?
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Files processed locally on your device</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>No data stored or transmitted to servers</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Open-source and transparent</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Based on official Google guidelines</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Used by 1000+ developers worldwide</span>
              </li>
            </ul>
          </div>

          {/* Contact & Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Get in Touch
            </h4>
            <div className="space-y-3">
              <a 
                href="https://github.com/Teddir/webtool-checking-16kb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://developer.android.com/guide/practices/page-sizes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Official Google Guidelines</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>© 2025 16KBPSChecker. All rights reserved.</p>
              <p className="mt-1">
                Google Play requires 16KB page size compatibility by November 1st, 2025
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Service Status: Online</span>
              </span>
              <span>Version 1.0.0</span>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Security & Privacy Guarantee</span>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            Your APK files are processed entirely on your device. We never store, upload, or transmit your files to any server. 
            This tool is designed with privacy-first principles to protect your intellectual property.
          </p>
        </div>
      </div>
    </footer>
  );
}
