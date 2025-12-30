import type { Web2PdfClient } from './client.js';
import type { CreateScreenshotRequest, ScreenshotOptions, ScreenshotType } from './types.js';
import { renderJsxToHtml, isJsxElement } from './jsx-renderer.js';

type ReactElement = unknown;

/**
 * Options for creating a screenshot
 */
export interface CreateScreenshotOptions {
  url?: string;
  html?: string;
  jsx?: ReactElement;
  customCss?: string;
  screenshotOptions?: ScreenshotOptions;
}

/**
 * Result of screenshot creation
 */
export interface ScreenshotResult {
  data: ArrayBuffer;
  contentType: string;
  rateLimitRemaining?: number;
  rateLimitLimit?: number;
}

/**
 * Create a screenshot from URL, HTML, or JSX
 */
export async function createScreenshot(
  client: Web2PdfClient,
  options: CreateScreenshotOptions
): Promise<ScreenshotResult> {
  const { url, html, jsx, customCss, screenshotOptions } = options;

  // Validate that exactly one source is provided
  const sources = [url, html, jsx].filter(Boolean);
  if (sources.length !== 1) {
    throw new Error('Exactly one of url, html, or jsx must be provided');
  }

  // Render JSX to HTML if JSX is provided
  let finalHtml: string | undefined;
  if (jsx) {
    if (!isJsxElement(jsx)) {
      throw new Error('Invalid JSX element provided. Make sure React is available and the element is a valid React element.');
    }
    finalHtml = await renderJsxToHtml(jsx);
  } else {
    finalHtml = html;
  }

  // Validate that customCss is only used with html/jsx
  if (customCss && url) {
    throw new Error('customCss can only be used with html or jsx, not with url');
  }

  const requestBody: CreateScreenshotRequest = {
    ...(url && { url }),
    ...(finalHtml && { html: finalHtml }),
    ...(customCss && { customCss }),
    ...(screenshotOptions && { screenshotOptions }),
  };

  const { data, headers } = await client.request<ArrayBuffer>(
    '/api/create/screen-shot',
    requestBody as Record<string, unknown>
  );

  // Extract content type from headers
  const contentType = headers.get('content-type') || 'image/png';
  
  // Extract rate limit info
  const rateLimitRemaining = headers.get('x-ratelimit-remaining')
    ? parseInt(headers.get('x-ratelimit-remaining')!, 10)
    : undefined;
  const rateLimitLimit = headers.get('x-ratelimit-limit')
    ? parseInt(headers.get('x-ratelimit-limit')!, 10)
    : undefined;

  const result: ScreenshotResult = {
    data,
    contentType,
  };
  
  if (rateLimitRemaining !== undefined) {
    result.rateLimitRemaining = rateLimitRemaining;
  }
  
  if (rateLimitLimit !== undefined) {
    result.rateLimitLimit = rateLimitLimit;
  }
  
  return result;
}

