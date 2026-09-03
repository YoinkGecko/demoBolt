import { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import type { Job } from '@/types';
import { fetchJob } from '@/api';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '@/utils';

interface JobDetailProps {
  job: Job;
  onBack: () => void;
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd
        className={`text-sm text-slate-800 sm:text-right ${
          mono ? 'font-mono text-xs break-all' : ''
        }`}
      >
        {value ?? '—'}
      </dd>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-3.5">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="px-5 py-1">
        <dl className="divide-y divide-slate-50">{children}</dl>
      </div>
    </div>
  );
}

export function JobDetail({ job, onBack }: JobDetailProps) {
  const [current, setCurrent] = useState<Job>(job);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const fresh = await fetchJob(job.id);
      setCurrent(fresh);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.id]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </button>
        <button
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {current.type}
          </h1>
          <StatusBadge status={current.status} />
        </div>
        <p className="mt-1 font-mono text-xs text-slate-400">{current.id}</p>
      </div>

      <div className="space-y-6">
        <SectionCard title="Overview">
          <DetailRow label="Type" value={current.type} />
          <DetailRow label="Status" value={<StatusBadge status={current.status} />} />
          <DetailRow label="Priority" value={current.priority} />
          <DetailRow label="Assigned Worker" value={current.assignedWorker} />
          <DetailRow
            label="Retries"
            value={`${current.retryCount} / ${current.maxRetries}`}
          />
        </SectionCard>

        <SectionCard title="Timing">
          <DetailRow label="Created" value={formatDate(current.createdAt)} />
          <DetailRow label="Scheduled" value={formatDate(current.scheduledAt)} />
          <DetailRow label="Started" value={formatDate(current.startedAt)} />
          <DetailRow label="Completed" value={formatDate(current.completedAt)} />
          <DetailRow label="Updated" value={formatDate(current.updatedAt)} />
          <DetailRow label="Last Heartbeat" value={formatDate(current.heartbeatAt)} />
          <DetailRow label="Lock Expires" value={formatDate(current.lockExpiresAt)} />
        </SectionCard>

        <SectionCard title="Payload">
          <div className="py-3">
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
              {JSON.stringify(current.payload, null, 2)}
            </pre>
          </div>
        </SectionCard>

        {current.lastError && (
          <SectionCard title="Last Error">
            <div className="py-3">
              <pre className="overflow-x-auto rounded-lg bg-rose-50 p-4 text-xs leading-relaxed text-rose-800 ring-1 ring-inset ring-rose-200">
                {current.lastError}
              </pre>
            </div>
          </SectionCard>
        )}

        <SectionCard title="Identifiers">
          <DetailRow label="Job ID" value={current.id} mono />
        </SectionCard>
      </div>
    </div>
  );
}
