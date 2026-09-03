import { useState } from 'react';
import type { Job } from '@/types';
import { JobList } from '@/components/JobList';
import { JobDetail } from '@/components/JobDetail';

export default function App() {
  const [selected, setSelected] = useState<Job | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {selected ? (
        <JobDetail job={selected} onBack={() => setSelected(null)} />
      ) : (
        <JobList onSelect={setSelected} />
      )}
    </div>
  );
}
