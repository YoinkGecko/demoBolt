import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import type { Job } from '@/types';
import { fetchJobs } from '@/api';
import { JobTable } from './JobTable';

interface JobListProps {
  onSelect: (job: Job) => void;
}

export function JobList({ onSelect }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJobs();
        if (!active) return;
        setJobs(data.jobs);
        setTotal(data.total);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : 'Failed to load jobs');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const statuses = useMemo(() => {
    const set = new Set(jobs.map((j) => j.status));
    return ['ALL', ...Array.from(set)];
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchesStatus =
        statusFilter === 'ALL' || job.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        job.type.toLowerCase().includes(q) ||
        job.id.toLowerCase().includes(q) ||
        (job.assignedWorker?.toLowerCase().includes(q) ?? false);
      return matchesStatus && matchesSearch;
    });
  }, [jobs, search, statusFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Jobs
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {loading
            ? 'Loading…'
            : `${filtered.length} shown · ${total.toLocaleString()} total`}
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search type, worker, or ID…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 shadow-sm transition focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/5"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-24 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500 shadow-sm">
          No jobs match your filters.
        </div>
      ) : (
        <JobTable jobs={filtered} onSelect={onSelect} />
      )}
    </div>
  );
}
