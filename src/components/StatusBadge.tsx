import type { JobStatus } from '@/types';
import { statusClasses, statusDotClass } from '@/utils';

export function StatusBadge({ status }: { status: JobStatus | string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClasses(
        status
      )}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass(status)}`} />
      {status}
    </span>
  );
}
