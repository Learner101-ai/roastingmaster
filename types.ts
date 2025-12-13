export interface AuditResult {
  url: string;
  clarity_score: number;
  clarity_critique: string;
  boring_headline_reason: string;
  target_audience_analysis: string;
  brutal_improvements: string[];
  overall_roast: string;
}

export interface ScrapingResult {
  success: boolean;
  text?: string;
  error?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  SCRAPING = 'SCRAPING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}