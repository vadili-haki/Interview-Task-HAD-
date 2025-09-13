import { findFolder, recent } from "@/lib/data";
import { CreateFolderButton } from "@/components/CreateFolderButton";
import { FolderList } from "@/components/FolderList";
import { BackButton } from "@/components/BackButton";
import { CreateFile } from "@/components/CreateFile";
import { revalidatePath } from "next/cache";

interface Props {
    params: { id: string };
}

export default async function FolderPage({ params }: Props) {
  const folder = findFolder(params.id);

  if (!folder) {
      return <p>Folder not found</p>;
  }
  
  

  // Remove current folder from recent array and push it back at the beginning
  const current = recent.findIndex((f: any) => f.id === folder.id)
  if(current !== -1){
    recent.splice(current, 1)
  }
  recent.unshift(folder)
  
  return (
      <div className="space-y-4">
          <div className="flex justify-between items-center">
              <div className="flex gap-x-3 items-center">
                  <BackButton />
                  <h1 className="text-xl font-bold">{folder.name}</h1>
              </div>
              <CreateFolderButton folderId={folder.id} />
          </div>
          <FolderList nodes={folder.children} />
          <CreateFile folderId={folder.id} />
      </div>
  );
}
