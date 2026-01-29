const fs = require('fs');
const path = require('path');

const pathsContent = fs.readFileSync('paths.txt', 'utf8');
const lines = pathsContent.split('\n').filter(line => line.trim() !== '');

// Exclude first 3 lines (icons, garbage) and last line (blob)
// Based on analysis: lines 0, 1, 2 are skip. Line 15 (0-indexed 15) is blob?
// lines 3 to 14 are handwriting.
// Let's verify with the content starts.
// Handwriting starts with M138 (line 4 in 1-based, so index 3).
// Blob starts with M93.8 (line 16 in 1-based, index 15).

const validLines = [];
lines.forEach((line, index) => {
    // Basic heuristic: handwriting paths in this file seem to start with specific coordinates or just capture the middle block
    if (index >= 3 && index <= 14) {
        validLines.push(line);
    }
});

const allPaths = [];

validLines.forEach(line => {
    const match = line.match(/d="([^"]+)"/);
    if (match) {
        let d = match[1];
        // Split compound paths: zM or ZM implies new subpath
        // Insert a delimiter
        d = d.replace(/([zZ])(M)/g, '$1|$2');
        const subPaths = d.split('|');
        subPaths.forEach(sp => allPaths.push(sp));
    }
});

const output = `export const COVER_PATHS = ${JSON.stringify(allPaths, null, 2)};`;

fs.writeFileSync('src/components/sections/CoverSectionPaths.ts', output);
console.log(`Extracted ${allPaths.length} paths.`);
