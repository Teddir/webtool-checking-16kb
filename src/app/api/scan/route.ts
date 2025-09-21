import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, rm } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/vnd.android.package-archive', 'application/zip'];
    const fileType = file.type;
    
    if (!allowedTypes.includes(fileType) && !file.name.endsWith('.apk') && !file.name.endsWith('.zip')) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload an APK or ZIP file.' 
      }, { status: 400 });
    }

    // Create temporary directory
    const tempDir = path.join(process.cwd(), 'temp', `scan_${Date.now()}`);
    await mkdir(tempDir, { recursive: true });

    try {
      // Save uploaded file
      const filePath = path.join(tempDir, file.name);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Make script executable and run it
      const scriptPath = path.join(process.cwd(), 'public', 'script.sh');
      
      if (!existsSync(scriptPath)) {
        throw new Error('Script not found');
      }

      // Make script executable
      await execAsync(`chmod +x "${scriptPath}"`);

      // Run the script - it returns exit code 1 when unaligned libraries are found (this is normal)
      let stdout = '';
      let stderr = '';
      
      try {
        const result = await execAsync(`"${scriptPath}" "${filePath}"`);
        stdout = result.stdout;
        stderr = result.stderr;
      } catch (error: any) {
        // The script returns exit code 1 when unaligned libraries are found - this is expected
        if (error.code === 1 && error.stdout) {
          stdout = error.stdout;
          stderr = error.stderr || '';
        } else {
          throw error;
        }
      }
      
      // Parse the output to extract structured results
      const results = parseScriptOutput(stdout, stderr);

      return NextResponse.json({
        success: true,
        results,
        rawOutput: stdout,
        errors: stderr
      });

    } finally {
      // Clean up temporary directory
      try {
        await rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to clean up temp directory:', cleanupError);
      }
    }

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json({ 
      error: 'Failed to process file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function parseScriptOutput(stdout: string, _stderr: string) {
  const lines = stdout.split('\n');
  
  // Extract key information from the script output
  const results = {
    status: 'unknown',
    totalLibraries: 0,
    alignedLibraries: 0,
    unalignedLibraries: 0,
    criticalFailures: 0,
    libraries: [] as Array<{
      name: string;
      architecture: string;
      alignment: string;
      status: 'ALIGNED' | 'UNALIGNED' | 'FAILED';
      isCritical: boolean;
    }>,
    summary: '',
    complianceStatus: 'unknown' as 'PASSED' | 'FAILED' | 'unknown',
    recommendations: [] as string[],
    isFlutterApp: false,
    flutterVersion: undefined as string | undefined
  };

  // Detect Flutter app
  const flutterLibraries = ['flutter', 'dart', 'engine', 'skia', 'libflutter', 'libdart'];
  let flutterLibraryCount = 0;
  
  // Parse library information from table format
  let inTable = false;
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check for table start
    if (trimmedLine.includes('│') && trimmedLine.includes('Library')) {
      inTable = true;
      continue;
    }
    
    // Check for table end
    if (inTable && trimmedLine.includes('└') && trimmedLine.includes('┘')) {
      inTable = false;
      continue;
    }
    
    // Parse table rows
    if (inTable && trimmedLine.includes('│') && !trimmedLine.includes('Library')) {
      const parts = trimmedLine.split('│').map(p => p.trim()).filter(p => p);
      if (parts.length >= 4) {
        const name = parts[0];
        const architecture = parts[1];
        const alignment = parts[2];
        const statusText = parts[3];
        
        const isAligned = statusText.includes('PASS') || statusText.includes('✓');
        const isCritical = architecture.includes('arm64-v8a') || architecture.includes('x86_64');
        
        results.libraries.push({
          name,
          architecture,
          alignment,
          status: isAligned ? 'ALIGNED' : 'UNALIGNED',
          isCritical
        });
        
        // Check if this is a Flutter-related library
        if (flutterLibraries.some(flutterLib => name.toLowerCase().includes(flutterLib))) {
          flutterLibraryCount++;
        }
        
        if (isAligned) {
          results.alignedLibraries++;
        } else {
          results.unalignedLibraries++;
          if (isCritical) {
            results.criticalFailures++;
          }
        }
      }
    }
    
    // Check for summary information
    if (trimmedLine.includes('Total libraries scanned:')) {
      const match = trimmedLine.match(/(\d+)/);
      if (match) {
        results.totalLibraries = parseInt(match[1]);
      }
    }
    
    // Check for compliance status
    if (trimmedLine.includes('Google Play Compliance:')) {
      if (trimmedLine.includes('PASSED')) {
        results.complianceStatus = 'PASSED';
        results.status = 'success';
      } else if (trimmedLine.includes('FAILED')) {
        results.complianceStatus = 'FAILED';
        results.status = 'error';
      }
    }
    
    // Check for no libraries case
    if (trimmedLine.includes('NO NATIVE LIBRARIES') || trimmedLine.includes('No native libraries')) {
      results.status = 'success';
      results.complianceStatus = 'PASSED';
      results.summary = 'No native libraries found - automatically compatible';
    }
  }

  // Detect Flutter app
  results.isFlutterApp = flutterLibraryCount > 0;
  
  // Generate summary
  if (results.unalignedLibraries === 0 && results.totalLibraries > 0) {
    results.summary = `All ${results.totalLibraries} libraries are properly aligned for 16KB page size.`;
    if (results.isFlutterApp) {
      results.summary += ` Your Flutter app is ready for Google Play!`;
    }
  } else if (results.unalignedLibraries > 0) {
    results.summary = `${results.unalignedLibraries} of ${results.totalLibraries} libraries need alignment fixes.`;
    if (results.criticalFailures > 0) {
      results.summary += ` ${results.criticalFailures} critical failures require immediate attention.`;
    }
    if (results.isFlutterApp) {
      results.summary += ` Follow the Flutter-specific steps below to fix these issues.`;
    }
  }

  return results;
}
