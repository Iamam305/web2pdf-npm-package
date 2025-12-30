import type { Web2PdfConfig } from "./types.js";

/**
 * Web2PDF API Client
 */
export class Web2PdfClient {
  private apiId: string;
  private secretKey: string;
  private baseUrl: string;

  constructor(config: Web2PdfConfig) {
    this.apiId = config.apiId;
    this.secretKey = config.secretKey;
    this.baseUrl = config.baseUrl || "https://web2pdf.dev";
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiId}:${this.secretKey}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Make API request
   */
  async request<T>(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<{ data: T; headers: Headers }> {
    const url = `${this.baseUrl}${endpoint}`;

    // Check if we're in Node.js environment
    const isNode = typeof window === "undefined";

    let fetchFn: typeof fetch;
    if (isNode) {
      // Check if native fetch is available (Node.js 18+)
      if (typeof globalThis.fetch !== "undefined") {
        fetchFn = globalThis.fetch;
      } else {
        // Fallback to node-fetch if available
        try {
          const { default: nodeFetch } = await import("node-fetch");
          fetchFn = nodeFetch as unknown as typeof fetch;
        } catch (error) {
          throw new Error(
            "fetch is not available. Please use Node.js 18+ or install node-fetch: npm install node-fetch"
          );
        }
      }
    } else {
      fetchFn = fetch;
    }

    const response = await fetchFn(url, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      throw new Error(
        `API request failed: ${response.status} ${
          response.statusText
        }. ${JSON.stringify(errorData)}`
      );
    }

    return {
      data: (await response.arrayBuffer()) as unknown as T,
      headers: response.headers,
    };
  }

  /**
   * Get API credentials
   */
  getCredentials(): { apiId: string; secretKey: string } {
    return {
      apiId: this.apiId,
      secretKey: this.secretKey,
    };
  }
}

/**
 * Create a Web2PDF client instance
 */
export function createClient(config: Web2PdfConfig): Web2PdfClient {
  return new Web2PdfClient(config);
}
