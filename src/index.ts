/**
 * Web2PDF - Convert HTML, URLs, and JSX to PDF or screenshots
 */

// Export client
export { createClient, Web2PdfClient } from './client.js';

// Export functions
export { createPdf, type CreatePdfOptions, type PdfResult } from './create-pdf.js';
export { createScreenshot, type CreateScreenshotOptions, type ScreenshotResult } from './create-screenshot.js';

// Export types
export type {
  Web2PdfConfig,
  PdfFormat,
  PdfOptions,
  PdfMargin,
  ScreenshotType,
  ScreenshotOptions,
  ScreenshotViewport,
  CreatePdfRequest,
  CreateScreenshotRequest,
  ApiError,
  RateLimitHeaders,
} from './types.js';

// Export JSX utilities
export { renderJsxToHtml, isJsxElement } from './jsx-renderer.js';

