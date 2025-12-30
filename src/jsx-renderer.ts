/**
 * JSX Renderer - Converts JSX elements to HTML string
 * Supports React if available, otherwise provides fallback
 */

type ReactElement = unknown;
type ReactComponent = unknown;

/**
 * Check if React is available in the environment
 */
function isReactAvailable(): boolean {
  try {
    // Try to require/import React
    if (typeof require !== 'undefined') {
      try {
        require('react');
        require('react-dom/server');
        return true;
      } catch {
        // React not available via require
      }
    }
    
    // Check if React is available globally (browser)
    if (typeof window !== 'undefined') {
      return !!(window as unknown as { React?: unknown }).React;
    }
    
    // Check if React is available in global scope (Node.js)
    if (typeof globalThis !== 'undefined') {
      const global = globalThis as unknown as { React?: unknown };
      if (global.React) {
        return true;
      }
    }
  } catch {
    // Ignore errors
  }
  
  return false;
}

/**
 * Render JSX element to HTML string using React
 */
async function renderWithReact(element: ReactElement): Promise<string> {
  try {
    let ReactDOMServer: { renderToString: (element: ReactElement) => string };
    
    // Try to import React DOM Server
    if (typeof require !== 'undefined') {
      // Node.js environment
      try {
        const reactDomServer = await import('react-dom/server');
        ReactDOMServer = reactDomServer as unknown as { renderToString: (element: ReactElement) => string };
      } catch (importError) {
        // Try CommonJS require as fallback
        const reactDomServer = require('react-dom/server');
        ReactDOMServer = reactDomServer as { renderToString: (element: ReactElement) => string };
      }
    } else if (typeof window !== 'undefined') {
      // Browser environment - React should be available globally
      const win = window as unknown as { ReactDOMServer?: { renderToString: (element: ReactElement) => string } };
      if (!win.ReactDOMServer) {
        throw new Error('ReactDOMServer is not available. Please ensure react-dom is loaded.');
      }
      ReactDOMServer = win.ReactDOMServer;
    } else {
      throw new Error('Unable to determine environment');
    }

    return ReactDOMServer.renderToString(element);
  } catch (error) {
    throw new Error(
      `Failed to render JSX with React: ${error instanceof Error ? error.message : String(error)}. ` +
      `Make sure react and react-dom are installed and React is available in your environment.`
    );
  }
}

/**
 * Render JSX element to HTML string
 * Automatically uses React if available, otherwise throws an error
 */
export async function renderJsxToHtml(element: ReactElement): Promise<string> {
  if (!isReactAvailable()) {
    throw new Error(
      'React is not available in this environment. ' +
      'To use JSX rendering, please install react and react-dom: npm install react react-dom. ' +
      'Alternatively, pass HTML string directly instead of JSX element.'
    );
  }

  return renderWithReact(element);
}

/**
 * Check if a value is a JSX element (React element)
 */
export function isJsxElement(value: unknown): value is ReactElement {
  if (!isReactAvailable()) {
    return false;
  }

  try {
    let React: { isValidElement: (element: unknown) => boolean };
    
    if (typeof require !== 'undefined') {
      // Node.js - we know React is available from isReactAvailable check
      try {
        const react = require('react');
        React = react as { isValidElement: (element: unknown) => boolean };
      } catch {
        return false;
      }
    } else if (typeof window !== 'undefined') {
      const win = window as unknown as { React?: { isValidElement: (element: unknown) => boolean } };
      if (!win.React) {
        return false;
      }
      React = win.React;
    } else if (typeof globalThis !== 'undefined') {
      const global = globalThis as unknown as { React?: { isValidElement: (element: unknown) => boolean } };
      if (!global.React) {
        return false;
      }
      React = global.React;
    } else {
      return false;
    }

    return React.isValidElement(value);
  } catch {
    return false;
  }
}

