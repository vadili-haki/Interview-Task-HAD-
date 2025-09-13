"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateFile({ folderId = "root" }: { folderId?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  function getFileName(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setName(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
    }
  }

  async function handleFileCreation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    const providedName = name.trim();
    const fileInput = (e.target as HTMLFormElement).elements.namedItem(
      "file"
    ) as HTMLInputElement;

    if (providedName) formData.append("name", providedName);

    if (fileInput && fileInput.files?.length) {
      formData.append("file", fileInput.files[0]);
      await fetch(`/api/files/${folderId}`, {
        method: "POST",
        body: formData,
      });
      router.refresh();
    }
    setOpen(false);
    setName("");
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-black bg-opacity-10 fixed right-4 bottom-20 rounded-full px-3 py-3 lg:px-2 lg:py-1 lg:bottom-4 lg:rounded">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="block lg:hidden fill-gray-700" viewBox="0 0 16 16">
          <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5"/>
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
        </svg>
        <span className="hidden lg:block">+ Add New File</span>
      </button>
      {open && (
        <form className="fixed inset-0 flex items-center justify-center bg-black/40 z-2" onSubmit={handleFileCreation}>
          <div className="bg-white p-4 rounded space-y-2">
            <div className="grid gap-y-3">
              <input
                name="name"
                className="border p-1"
                placeholder="file name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                name="file"
                type="file"
                className="border p-1"
                onChange={getFileName}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="submit" className="border px-2 py-1 rounded">
                Create
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
