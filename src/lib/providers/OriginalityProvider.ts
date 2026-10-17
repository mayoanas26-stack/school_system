// src/lib/providers/OriginalityProvider.ts
export interface CheckOriginalityParams {
  text: string;
  documentUrl?: string;
}

export interface OriginalityResult {
  similarityScore: number; // 0 to 100 percentage
  flaggedSegments: Array<{
    text: string;
    sourceUrl?: string;
    similarity: number;
  }>;
}

export interface OriginalityProvider {
  checkOriginality(params: CheckOriginalityParams): Promise<OriginalityResult>;
}

export class StubOriginalityProvider implements OriginalityProvider {
  async checkOriginality(params: CheckOriginalityParams): Promise<OriginalityResult> {
    // Stub implementation returning low/clean similarity or simulated analysis
    const wordCount = params.text.split(/\s+/).filter(Boolean).length;
    console.log(`[OriginalityProvider] Analyzed document with ${wordCount} words.`);

    return {
      similarityScore: 4.5, // 4.5% baseline common phrasing
      flaggedSegments: [],
    };
  }
}

export const defaultOriginalityProvider = new StubOriginalityProvider();
