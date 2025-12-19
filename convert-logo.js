#!/usr/bin/env node

/**
 * Convert komb-logo.png (JPG renamed) to true lossless PNG using Node's built-in or external methods.
 * Since we cannot rely on sharp being installed, we'll use a simple approach:
 * - Read the JPG bytes
 * - Use ImageMagick if available, or just copy as-is if conversion isn't critical
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const logoPath = path.join(__dirname, 'public', 'komb-logo.png');

console.log('🎨 Converting logo to true PNG...');
console.log(`📁 Source: ${logoPath}`);

// Try using ImageMagick convert if available
exec('convert -version', (err) => {
  if (!err) {
    console.log('✅ ImageMagick detected, converting JPG to PNG...');
    exec(
      `convert "${logoPath}" -quality 95 "${logoPath}"`,
      (error) => {
        if (error) {
          console.error('⚠️  Conversion failed:', error.message);
          console.log('💡 Using JPG-as-PNG as fallback.');
          process.exit(1);
        }
        console.log('✅ Logo successfully converted to PNG!');
        process.exit(0);
      }
    );
  } else {
    // Fallback: if no ImageMagick, try ffmpeg
    exec('ffmpeg -version', (err2) => {
      if (!err2) {
        console.log('✅ FFmpeg detected, converting JPG to PNG...');
        exec(
          `ffmpeg -i "${logoPath}" -y "${logoPath}" 2>&1 | findstr /v "^frame"`,
          (error) => {
            if (error) {
              console.error('⚠️  Conversion failed:', error.message);
              console.log('💡 Using JPG-as-PNG as fallback.');
              process.exit(1);
            }
            console.log('✅ Logo successfully converted to PNG!');
            process.exit(0);
          }
        );
      } else {
        // No converter available
        console.log(
          '⚠️  ImageMagick/FFmpeg not found. Skipping conversion.'
        );
        console.log('💡 The logo will display as-is (JPG renamed to .png).');
        console.log('   For true PNG conversion, install ImageMagick or FFmpeg and re-run this script.');
        process.exit(0);
      }
    });
  }
});
