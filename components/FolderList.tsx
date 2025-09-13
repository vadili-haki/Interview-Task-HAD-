import Link from 'next/link';
import type { FolderNode, FileNode } from '@/lib/data';
import { RenameButton } from '@/components/RenameButton';
import { DeleteButton } from '@/components/DeleteButton';
import {} from 'node:path'

export function FolderList({ nodes }: { nodes: Array<FolderNode | FileNode> }) {
  if (!nodes.length) {
    return <p className="text-gray-500">(empty)</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {nodes.map((node) => {
        if (node.type === 'folder') {
          return (
            <li key={node.id}>
              <Link
                href={`/folder/${node.id}`} className="flex items-center gap-x-3 border p-2 lg:p-4 rounded-xl bg-white hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 48 48">
                  <path fill="#FFA000" d="M40,12H22l-4-4H8c-2.2,0-4,1.8-4,4v8h40v-4C44,13.8,42.2,12,40,12z"></path><path fill="#FFCA28" d="M40,12H8c-2.2,0-4,1.8-4,4v20c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V16C44,13.8,42.2,12,40,12z"></path>
                </svg>
                <span>{node.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-auto" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </Link>
            </li>
          );
        }
        return (
          <li key={node.id} className="flex items-center justify-between gap-x-3 border p-2 rounded bg-white">
            <div className="flex items-center gap-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
              </svg>
              <span className="text-sm text-gray-700">{node.name}</span>
            </div>
            <div className="flex items-center gap-x-3">
              <RenameButton node={node}/>
              <DeleteButton node={node} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
