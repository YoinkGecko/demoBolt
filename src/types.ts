export type JobStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'RETRYING';

export interface Job {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  status: JobStatus | string;
  priority: number;
  scheduledAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  retryCount: number;
  maxRetries: number;
  assignedWorker: string | null;
  heartbeatAt: string | null;
  lockExpiresAt: string | null;
  lastError: string | null;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
}
