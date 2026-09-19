import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { AppError } from '../utils/AppError.js';

/**
 * Extract text and page structures from a single file buffer
 */
export const extractTextFromFile = async (file) => {
  const filename = file.originalname || 'document.txt';
  const isPdf = file.mimetype === 'application/pdf' || filename.toLowerCase().endsWith('.pdf');
  const isTxt = file.mimetype === 'text/plain' || filename.toLowerCase().endsWith('.txt');

  if (!isPdf && !isTxt) {
    throw new AppError(
      `Unsupported file format: "${filename}". Only PDF and TXT files are supported.`,
      400
    );
  }

  let fullText = '';
  let pageCount = 1;
  const pages = [];

  if (isPdf) {
    try {
      const data = new Uint8Array(file.buffer);
      const doc = await pdfjsLib.getDocument({
        data,
        useSystemFonts: true,
        isEvalSupported: false
      }).promise;

      pageCount = doc.numPages || 1;

      for (let i = 1; i <= pageCount; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const pageStrings = textContent.items.map(item => item.str);
        const pageText = pageStrings.join(' ').replace(/\s+/g, ' ').trim();

        if (pageText.length > 0) {
          pages.push({
            pageNumber: i,
            text: pageText
          });
          fullText += `\n[Page ${i}]\n${pageText}\n`;
        }
      }
    } catch (err) {
      console.error(`PDF extraction error on ${filename}:`, err);
      throw new AppError(
        `Failed to parse PDF document "${filename}": ${err.message}. Ensure the file is not password-protected or corrupted.`,
        400
      );
    }
  } else {
    // TXT file
    const txtContent = file.buffer.toString('utf-8').trim();
    fullText = txtContent;
    pages.push({
      pageNumber: 1,
      text: txtContent
    });
  }

  const cleanedText = fullText
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .trim();

  // Validate minimum text extracted
  if (!cleanedText || cleanedText.length < 20) {
    throw new AppError(
      `The document "${filename}" contains no extractable text. If it is a PDF, it may be a scanned image without embedded text. Please provide a text-based document.`,
      400
    );
  }

  return {
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: filename,
    originalName: filename,
    size: file.size || Buffer.byteLength(file.buffer),
    mimeType: isPdf ? 'application/pdf' : 'text/plain',
    pageCount: pageCount,
    extractedTextLength: cleanedText.length,
    fullText: cleanedText,
    pages: pages
  };
};

/**
 * Extract text from multiple files
 */
export const extractAllDocuments = async (files) => {
  if (!files || files.length < 2) {
    throw new AppError(
      'At least two requirement documents are required for comparative analysis.',
      400
    );
  }

  const results = [];
  for (const file of files) {
    const docData = await extractTextFromFile(file);
    results.push(docData);
  }

  return results;
};
