export interface PlaytimeEstimate {
  category: string;
  averageHours: number;
  medianHours: number;
  minHours: number;
  maxHours: number;
  submissionCount: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface GamePlaytimeStats {
  gameId: string;
  mainStory?: PlaytimeEstimate;
  mainPlusSides?: PlaytimeEstimate;
  completionist?: PlaytimeEstimate;
  casual?: PlaytimeEstimate;
  lastCalculatedAt: Date;
}

export function calculateConfidence(submissionCount: number): 'low' | 'medium' | 'high' {
  if (submissionCount === 0) return 'low';
  if (submissionCount < 5) return 'low';
  if (submissionCount < 20) return 'medium';
  return 'high';
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 
    ? sorted[mid] 
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}