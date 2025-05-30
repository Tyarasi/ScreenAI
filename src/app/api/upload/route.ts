import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        // Generate a unique filename to prevent collisions
        const uniqueId = uuidv4();
        const originalName = file.name;
        const fileExtension = originalName.split('.').pop() || '';
        const fileName = `${uniqueId}.${fileExtension}`;
        const filePath = join(process.cwd(), 'public', 'uploads', fileName);

        // Convert the file to an ArrayBuffer
        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);

        // Write the file to the uploads directory
        await writeFile(filePath, fileBuffer);

        // Return the file metadata
        return {
          id: uniqueId,
          originalName,
          fileName,
          fileType: file.type,
          filePath: `/uploads/${fileName}`,
          size: file.size,
        };
      })
    );

    return NextResponse.json({ files: uploadResults }, { status: 200 });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
