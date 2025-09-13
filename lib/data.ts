export type FileNode = {
  id: string;
  name: string;
  type: "file";
};

export type FolderNode = {
  id: string;
  name: string;
  type: "folder";
  children: Array<FolderNode | FileNode>;
};

export const root: FolderNode = {
  id: "root",
  name: "root",
  type: "folder",
  children: [
    { id: "folder-1", name: "Folder 1", type: "folder", children: [] },
    { id: "folder-2", name: "Folder 2", type: "folder", children: [] }
  ],
};

export const recent: Array<FolderNode> = []

export function findFolder(
  id: string,
  current: FolderNode = root
): FolderNode | null {
  if (current.id === id) return current;
  for (const child of current.children) {
    if (child.type === "folder") {
      const result = findFolder(id, child);
      if (result) return result;
    }
  }
  return null;
}

export function findFileFolder(id: string, current: FolderNode = root): FolderNode | null {
  if(id === current.id) return current;
  for (const child of current.children) {
    if (child.type === "file" && child.id === id) {
      return current;
    } else if (child.type === "folder") {
      const result = findFileFolder(id, child);
      if (result) return result;
    }
  }
  return null;
}