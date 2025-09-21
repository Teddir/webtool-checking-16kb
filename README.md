# Android 16KB Page Size Checker

A minimalist web tool to help Android developers check whether their APKs or native libraries are compatible with Android's 16KB memory page size requirement for Google Play compliance.

## Features

- **File Upload**: Upload APK files or ZIP archives containing native libraries
- **Real-time Analysis**: Uses the provided `script.sh` to perform comprehensive ELF alignment checks
- **Structured Results**: Displays detailed analysis with library-by-library breakdown
- **Modern UI**: Clean, responsive interface with dark mode support
- **Google Play Compliance**: Specifically designed for the November 1st, 2025 deadline

## What It Checks

- ✅ APK zip-alignment for 16KB boundaries (requires build-tools 35.0.0+)
- ✅ ELF segment alignment in native libraries (arm64-v8a and x86_64)
- ✅ Compliance with Android 16KB page size requirements
- ✅ Critical vs non-critical architecture identification

## Getting Started

### Prerequisites

- Node.js 18+ 
- Bun, npm, or yarn
- Unix-like system (macOS, Linux) for running the shell script

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webtool-checking-16kb
```

2. Install dependencies:
```bash
bun install
# or
npm install
# or
yarn install
```

3. Make the script executable:
```bash
chmod +x public/script.sh
```

4. Start the development server:
```bash
bun dev
# or
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload File**: Drag and drop an APK or ZIP file, or click to browse
2. **Wait for Analysis**: The tool will run the compatibility check script
3. **Review Results**: See detailed analysis with pass/fail status for each library
4. **Take Action**: Follow recommendations to fix any alignment issues

## API Endpoints

### POST `/api/scan`

Uploads and analyzes a file for 16KB compatibility.

**Request:**
- `Content-Type: multipart/form-data`
- `file`: APK or ZIP file

**Response:**
```json
{
  "success": true,
  "results": {
    "status": "success|error",
    "totalLibraries": 5,
    "alignedLibraries": 4,
    "unalignedLibraries": 1,
    "criticalFailures": 0,
    "libraries": [...],
    "summary": "Analysis summary",
    "complianceStatus": "PASSED|FAILED",
    "recommendations": [...]
  }
}
```

## Technical Details

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes with file upload handling
- **Analysis**: Custom shell script (`script.sh`) for ELF alignment checking
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS with custom dark mode support

## File Structure

```
src/
├── app/
│   ├── api/scan/route.ts    # File upload and analysis API
│   ├── globals.css          # Global styles and dark mode
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main UI component
public/
└── script.sh                # ELF alignment checker script
```

## Dependencies

- `next`: React framework
- `react`: UI library
- `lucide-react`: Icon library
- `formidable`: File upload handling
- `tailwindcss`: Styling framework

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Related Resources

- [Android 16KB Page Size Guide](https://developer.android.com/guide/practices/page-sizes)
- [Google Play 16KB Requirements](https://developer.android.com/guide/practices/page-sizes)
- [Android NDK Documentation](https://developer.android.com/ndk/guides/)