# web2pdf.dev

Convert HTML, URLs, and JSX to PDF or screenshots using the [web2pdf.dev](https://web2pdf.dev) API.

## Features

- ✅ Convert URLs to PDF or screenshots
- ✅ Convert HTML strings to PDF or screenshots
- ✅ Convert JSX/React elements to PDF or screenshots (optional React support)
- ✅ Type-safe TypeScript API
- ✅ Works in Node.js and browser environments
- ✅ Custom CSS support
- ✅ Configurable PDF and screenshot options

## Installation

```bash
npm install web2pdf.dev
```

### Optional Dependencies

For JSX/React support, install React and React DOM:

```bash
npm install react react-dom
```

For Node.js versions below 18, you may need `node-fetch`:

```bash
npm install node-fetch
```

## Quick Start

```typescript
import { createClient, createPdf, createScreenshot } from "web2pdf.dev";

// Create a client
const client = createClient({
  apiId: "YOUR_API_ID",
  secretKey: "YOUR_SECRET_KEY",
});

// Convert URL to PDF
const pdfResult = await createPdf(client, {
  url: "https://example.com",
  pdfOptions: {
    format: "a4",
    landscape: false,
  },
});

// Save PDF (Node.js example)
import fs from "fs";
fs.writeFileSync("output.pdf", Buffer.from(pdfResult.data));
```

## API Reference

### `createClient(config)`

Creates a Web2PDF client instance.

**Parameters:**

- `config.apiId` (string): Your API ID from web2pdf.dev
- `config.secretKey` (string): Your secret key from web2pdf.dev
- `config.baseUrl` (string, optional): Base URL for the API (default: `https://web2pdf.dev`)

**Returns:** `Web2PdfClient` instance

### `createPdf(client, options)`

Generates a PDF from a URL, HTML, or JSX element.

**Parameters:**

- `client`: Web2PdfClient instance
- `options`:
  - `url` (string, optional): URL to convert
  - `html` (string, optional): HTML content to convert
  - `jsx` (ReactElement, optional): JSX/React element to convert
  - `customCss` (string, optional): Custom CSS (only with html/jsx)
  - `pdfOptions` (object, optional): PDF generation options
    - `format` ('letter' | 'legal' | 'tabloid' | 'ledger' | 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6'): Page format
    - `landscape` (boolean): Landscape orientation
    - `printBackground` (boolean): Include background graphics
    - `margin` (object): Page margins (`top`, `right`, `bottom`, `left` as strings like "1cm")
    - `displayHeaderFooter` (boolean): Show header/footer
    - `headerTemplate` (string): HTML template for header
    - `footerTemplate` (string): HTML template for footer

**Returns:** Promise resolving to `PdfResult`:

- `data` (ArrayBuffer): PDF file data
- `contentType` (string): Content type (usually "application/pdf")
- `rateLimitRemaining` (number, optional): Remaining API quota
- `rateLimitLimit` (number, optional): Total API quota

**Note:** Exactly one of `url`, `html`, or `jsx` must be provided.

### `createScreenshot(client, options)`

Generates a screenshot from a URL, HTML, or JSX element.

**Parameters:**

- `client`: Web2PdfClient instance
- `options`:
  - `url` (string, optional): URL to capture
  - `html` (string, optional): HTML content to capture
  - `jsx` (ReactElement, optional): JSX/React element to capture
  - `customCss` (string, optional): Custom CSS (only with html/jsx)
  - `screenshotOptions` (object, optional): Screenshot options
    - `type` ('png' | 'jpeg' | 'webp'): Image format
    - `fullPage` (boolean): Capture full page
    - `omitBackground` (boolean): Omit background
    - `captureBeyondViewport` (boolean): Capture beyond viewport
    - `viewport` (object): Viewport size
      - `width` (number): Viewport width
      - `height` (number): Viewport height

**Returns:** Promise resolving to `ScreenshotResult`:

- `data` (ArrayBuffer): Image file data
- `contentType` (string): Content type (e.g., "image/png")
- `rateLimitRemaining` (number, optional): Remaining API quota
- `rateLimitLimit` (number, optional): Total API quota

**Note:** Exactly one of `url`, `html`, or `jsx` must be provided.

## Examples

### Convert URL to PDF

```typescript
import { createClient, createPdf } from "web2pdf.dev";

const client = createClient({
  apiId: "YOUR_API_ID",
  secretKey: "YOUR_SECRET_KEY",
});

const result = await createPdf(client, {
  url: "https://example.com",
  pdfOptions: {
    format: "a4",
    landscape: false,
    margin: {
      top: "1cm",
      right: "1cm",
      bottom: "1cm",
      left: "1cm",
    },
  },
});
```

### Convert HTML to PDF

```typescript
const result = await createPdf(client, {
  html: "<html><body><h1>Hello World</h1></body></html>",
  customCss: "body { font-family: Arial; }",
  pdfOptions: {
    format: "a4",
  },
});
```

### Convert JSX to PDF (React)

```typescript
import React from "react";
import { createClient, createPdf } from "web2pdf.dev";

const client = createClient({
  apiId: "YOUR_API_ID",
  secretKey: "YOUR_SECRET_KEY",
});

const MyComponent = () => (
  <div>
    <h1>Hello from JSX!</h1>
    <p>This will be converted to PDF.</p>
  </div>
);

const result = await createPdf(client, {
  jsx: <MyComponent />,
  customCss: "body { font-family: Arial; }",
  pdfOptions: {
    format: "a4",
  },
});
```

### Convert to Screenshot

```typescript
import { createClient, createScreenshot } from "web2pdf.dev";

const client = createClient({
  apiId: "YOUR_API_ID",
  secretKey: "YOUR_SECRET_KEY",
});

const result = await createScreenshot(client, {
  url: "https://example.com",
  screenshotOptions: {
    type: "png",
    fullPage: true,
    viewport: {
      width: 1920,
      height: 1080,
    },
  },
});
```

### Browser Example

```typescript
import { createClient, createPdf } from "web2pdf.dev";

const client = createClient({
  apiId: "YOUR_API_ID",
  secretKey: "YOUR_SECRET_KEY",
});

const result = await createPdf(client, {
  url: "https://example.com",
});

// Download PDF in browser
const blob = new Blob([result.data], { type: result.contentType });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "document.pdf";
a.click();
URL.revokeObjectURL(url);
```

### Node.js Example

```typescript
import { createClient, createPdf } from "web2pdf.dev";
import fs from "fs";

const client = createClient({
  apiId: "YOUR_API_ID",
  secretKey: "YOUR_SECRET_KEY",
});

const result = await createPdf(client, {
  url: "https://example.com",
});

// Save PDF to file
fs.writeFileSync("output.pdf", Buffer.from(result.data));
```

## React/JSX Support

JSX rendering is optional and only works when React is available in your environment. The package will automatically detect if React is installed and available.

- **With React**: You can pass JSX elements directly to `createPdf` or `createScreenshot`
- **Without React**: You can still use `url` and `html` options

If you try to use JSX without React installed, you'll get a helpful error message.

## Error Handling

The API may return various error responses:

- **401 Unauthorized**: Invalid or missing API credentials
- **429 Too Many Requests**: Quota exceeded
- **400 Bad Request**: Invalid request parameters
- **500 Internal Server Error**: Server error

All errors are thrown as `Error` objects with descriptive messages.

## Rate Limiting

The API includes rate limit information in response headers. You can access this via the `rateLimitRemaining` and `rateLimitLimit` properties in the result objects.

## License

ISC

## Support

For API support, visit [web2pdf.dev](https://web2pdf.dev)
