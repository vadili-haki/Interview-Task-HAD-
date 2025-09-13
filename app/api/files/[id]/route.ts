import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { findFolder, findFileFolder } from '@/lib/data';
import { writeFile, mkdir, rename } from 'fs/promises';
import { join, basename, extname } from 'path';
import { unlink } from 'fs/promises';

export const runtime = 'nodejs';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const providedName = formData.get('name')?.toString();
  const parent = findFolder(params.id);
  if (!parent || !file) {
    return NextResponse.json({ error: 'Invalid request: missing parent or file' }, { status: 400 });
  }

  // Decide filename: prefer 'name' field, fallback to uploaded file's original name
  const rawName = (providedName && providedName.trim()) ? `${providedName.trim()}${extname(file.name)}` : file.name;
  const safeName = basename(rawName);
  if (!safeName) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
  }
  const publicDir = join(process.cwd(), 'public');
  const filePath = join(publicDir, safeName);

  try {
    // Ensure public directory exists and create the file (fail if it already exists)
    await mkdir(publicDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes), { flag: 'wx' });
  } catch (err: any) {
    if (err && typeof err === 'object' && 'code' in err && (err as any).code === 'EEXIST') {
      return NextResponse.json({ error: 'File already exists in public folder' }, { status: 409 });
    }
    console.error('Failed to create file in public folder:', err);
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }

  // Update in-memory structure after successful file creation
  parent.children.push({
    id: Date.now().toString(),
    name: safeName,
    type: 'file',
  });
  revalidatePath('/');
  revalidatePath(`/folder/${params.id}`);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const parent = findFileFolder(params.id);
  if (!parent) {
    return NextResponse.json({ error: 'File folder not found' }, { status: 404 });
  }

  // Find the file to delete
  const fileIndex = parent.children.findIndex(child => child.id === params.id && child.type === 'file');
  if (fileIndex === -1) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const file = parent.children[fileIndex];
  const publicDir = join(process.cwd(), 'public');
  const filePath = join(publicDir, file.name);

  try {
    await unlink(filePath);
  } catch (err: any) {
    // If file doesn't exist, still remove from memory
    if (err && typeof err === 'object' && 'code' in err && (err as any).code !== 'ENOENT') {
      console.error('Failed to delete file from filesystem:', err);
      return NextResponse.json({ error: 'Failed to delete file from filesystem' }, { status: 500 });
    }
  }

  parent.children.splice(fileIndex, 1);

  revalidatePath('/');
  revalidatePath(`/folder/${parent.id}`);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { name } = await req.json();

  let newName = name?.toString().trim();

  if (!newName) {
    return NextResponse.json({ error: 'Missing new file name' }, { status: 400 });
  }

  const parent = findFileFolder(params.id);
  if (!parent) {
    return NextResponse.json({ error: 'File folder not found' }, { status: 404 });
  }

  const file = parent.children.find(child => child.id === params.id && child.type === 'file');

  if (!file) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  if(newName.toLocaleLowerCase() === file.name.toLocaleLowerCase()){
    return NextResponse.json({ success: true });
  }

  newName = `${newName}${extname(file.name)}`;

  // Rename file in public folder
  const publicDir = join(process.cwd(), 'public');
  const oldPath = join(publicDir, file.name);
  const newPath = join(publicDir, newName);

  try {
    await rename(oldPath, newPath);
  } catch (err: any) {
    if (err && typeof err === 'object' && 'code' in err && (err as any).code === 'EEXIST') {
      return NextResponse.json({ error: 'File with the new name already exists' }, { status: 409 });
    }
    console.error('Failed to rename file:', err);
    return NextResponse.json({ error: 'Failed to rename file' }, { status: 500 });
  }

  file.name = newName;
  revalidatePath('/');
  revalidatePath(`/folder/${parent.id}`);
  return NextResponse.json({ success: true });
}