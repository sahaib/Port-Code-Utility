export interface BulkCalculationRow {
  sourceType: 'port' | 'postal';
  sourceLocation: string;
  destType: 'port' | 'postal';
  destLocation: string;
}

export interface BulkCalculationResult extends BulkCalculationRow {
  distance: number | null;
  status: 'success' | 'error';
  error?: string;
}

export interface ProcessingStats {
  total: number;
  processed: number;
  successful: number;
  failed: number;
} 