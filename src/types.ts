/**
 * PDF format options
 */
export type PdfFormat = 'letter' | 'legal' | 'tabloid' | 'ledger' | 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6';

/**
 * Screenshot image type
 */
export type ScreenshotType = 'png' | 'jpeg' | 'webp';

/**
 * Margin configuration for PDF
 */
export interface PdfMargin {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

/**
 * PDF generation options
 */
export interface PdfOptions {
  format?: PdfFormat;
  landscape?: boolean;
  printBackground?: boolean;
  margin?: PdfMargin;
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
}

/**
 * Viewport configuration for screenshots
 */
export interface ScreenshotViewport {
  width?: number;
  height?: number;
}

/**
 * Screenshot generation options
 */
export interface ScreenshotOptions {
  type?: ScreenshotType;
  fullPage?: boolean;
  omitBackground?: boolean;
  captureBeyondViewport?: boolean;
  viewport?: ScreenshotViewport;
}

/**
 * Client configuration
 */
export interface Web2PdfConfig {
  apiId: string;
  secretKey: string;
  baseUrl?: string;
}

/**
 * Request body for PDF generation
 */
export interface CreatePdfRequest {
  url?: string;
  html?: string;
  customCss?: string;
  pdfOptions?: PdfOptions;
}

/**
 * Request body for screenshot generation
 */
export interface CreateScreenshotRequest {
  url?: string;
  html?: string;
  customCss?: string;
  screenshotOptions?: ScreenshotOptions;
}

/**
 * API error response
 */
export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: {
    errors?: Array<{
      path: string;
      message: string;
    }>;
    remaining?: number;
    limit?: number;
    used?: number;
    error?: string;
  };
}

/**
 * Rate limit headers
 */
export interface RateLimitHeaders {
  'X-RateLimit-Remaining'?: string;
  'X-RateLimit-Limit'?: string;
}

