import type { Job, JobsResponse } from '@/types';

const BASE_URL = 'http://localhost:3000';

export async function fetchJobs(): Promise<JobsResponse> {
  const res = await fetch(`${BASE_URL}/jobs`);
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
  return res.json();
}

export async function fetchJob(id: string): Promise<Job> {
  const res = await fetch(`${BASE_URL}/jobs/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch job: ${res.status}`);
  return res.json();
}
