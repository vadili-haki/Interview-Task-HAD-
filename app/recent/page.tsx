import { recent } from '@/lib/data';
import { FolderList } from '@/components/FolderList';

export default function RecentPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Recent Folders</h1>
      </div>
      {recent.length > 0 ? <FolderList nodes={recent} /> : <p className='text-gray-500'>(No recent folders)</p>}
    </div>
  );
}