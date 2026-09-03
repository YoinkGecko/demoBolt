import type { JobStatus } from '@/types';

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function timeAgo(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const diff = Date.now() - d.getTime();
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const suffix = diff >= 0 ? 'ago' : 'from now';
  if (days > 0) return `${days}d ${suffix}`;
  if (hours > 0) return `${hours}h ${suffix}`;
  if (mins > 0) return `${mins}m ${suffix}`;
  return 'just now';
}

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  RUNNING: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  QUEUED: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  FAILED: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  CANCELLED: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  RETRYING: 'bg-violet-50 text-violet-700 ring-violet-600/20',
};

const STATUS_DOTS: Record<string, string> = {
  COMPLETED: 'bg-emerald-500',
  RUNNING: 'bg-blue-500 animate-pulse',
  PENDING: 'bg-amber-500',
  QUEUED: 'bg-amber-500',
  FAILED: 'bg-rose-500',
  CANCELLED: 'bg-gray-400',
  RETRYING: 'bg-violet-500',
};

export function statusClasses(status: JobStatus | string): string {
  return (
    STATUS_STYLES[status] ??
    'bg-gray-100 text-gray-600 ring-gray-500/20'
  );
}

export function statusDotClass(status: JobStatus | string): string {
  return STATUS_DOTS[status] ?? 'bg-gray-400';
}

export function truncateId(id: string, len = 8): string {
  return id.length > len ? `${id.slice(0, len)}…` : id;
}
