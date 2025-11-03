import { PDFDocument } from 'pdf-lib';

/**
 * Parst Seitenzahlen aus einem String wie "8" oder "1,3,8" oder "5-8"
 * @param {string} pagesInput - Der Seitenzahlen-String
 * @returns {number[]} - Array von Seitenzahlen (0-basiert)
 */
export function parsePageNumbers(pagesInput) {
  const pages = new Set();
  
  if (!pagesInput || !pagesInput.trim()) {
    return null; // null bedeutet: alle Seiten
  }
  
  const parts = pagesInput.split(',').map(p => p.trim());
  
  for (const part of parts) {
    if (part.includes('-')) {
      // Bereich wie "5-8"
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
      if (isNaN(start) || isNaN(end)) continue;
      for (let i = start; i <= end; i++) {
        pages.add(i - 1); // 0-basiert
      }
    } else {
      // Einzelne Seite wie "8"
      const page = parseInt(part, 10);
      if (!isNaN(page)) {
        pages.add(page - 1); // 0-basiert
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Extrahiert bestimmte Seiten aus einem PDF und gibt ein neues PDF zurück
 * @param {Buffer} pdfBuffer - Das originale PDF als Buffer
 * @param {number[]} pageIndices - Array von 0-basierten Seitenindizes
 * @returns {Promise<Buffer>} - Das neue PDF mit nur den ausgewählten Seiten
 */
export async function extractPdfPages(pdfBuffer, pageIndices) {
  const srcDoc = await PDFDocument.load(pdfBuffer);
  const newDoc = await PDFDocument.create();
  
  const totalPages = srcDoc.getPageCount();
  
  // Wenn pageIndices null ist, alle Seiten verwenden
  const indices = pageIndices || Array.from({ length: totalPages }, (_, i) => i);
  
  // Validierung und Kopieren der Seiten
  for (const index of indices) {
    if (index >= 0 && index < totalPages) {
      const [copiedPage] = await newDoc.copyPages(srcDoc, [index]);
      newDoc.addPage(copiedPage);
    }
  }
  
  const pdfBytes = await newDoc.save();
  return Buffer.from(pdfBytes);
}
