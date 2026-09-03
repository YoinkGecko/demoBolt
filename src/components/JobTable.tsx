import type { Job } from '@/types';
import { StatusBadge } from './StatusBadge';
import { timeAgo, truncateId } from '@/utils';

interface JobTableProps {
  jobs: Job[];
  onSelect: (job: Job) => void;
}

export function JobTable({ jobs, onSelect }: JobTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Priority</th>
              <th className="px-5 py-3.5">Worker</th>
              <th className="px-5 py-3.5">Retries</th>
              <th className="px-5 py-3.5">Job ID</th>
              <th className="px-5 py-3.5">Updated</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr
                key={job.id}
                onClick={() => onSelect(job)}
                className="cursor-pointer transition-colors hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <span className="font-medium text-slate-800">{job.type}</span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-5 py-4 text-slate-600">{job.priority}</td>
                <td className="px-5 py-4 text-slate-600">
                  {job.assignedWorker ?? '—'}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {job.retryCount}/{job.maxRetries}
                </td>
                <td className="px-5 py-4 font-mono text-xs text-slate-500">
                  {truncateId(job.id)}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {timeAgo(job.updatedAt)}
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-slate-400 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
