"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FolderNode, FileNode } from '@/lib/data';

export function RenameButton({node}: {node: FolderNode | FileNode}) {
  const [name, setName] = useState(node.name.replace(/\.[^/.]+$/, ''));
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleRename(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      await fetch(`/api/files/${node.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      router.refresh();
    }
    setOpen(false);
  }

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>
      </button>
      {open && (
        <form className="fixed inset-0 flex items-center justify-center bg-black/40" onSubmit={handleRename}>
          <div className="bg-white p-4 rounded space-y-2">
              <input
                name="name"
                className="border p-1"
                placeholder="new file name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            <div className="flex gap-2 justify-end">
              <button type="submit" className="border px-2 py-1 rounded">
                Rename
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border px-2 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
