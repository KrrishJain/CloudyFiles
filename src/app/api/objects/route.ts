import { NextRequest, NextResponse } from "next/server";
import { ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Cleint } from "../../../config/index"

export async function GET(request: NextRequest) {
    const prefix = request.nextUrl.searchParams.get('prefix') ?? undefined
    const objectCommand = new ListObjectsV2Command({
        Bucket: process.env.BUCKET_NAME,
        Delimiter: '/',
        Prefix: prefix
    })
    const result = await s3Cleint.send(objectCommand)

    async function getFileUrl(key: string) {
        const viewFileObjectCommand = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        });
        return await getSignedUrl(s3Cleint, viewFileObjectCommand);
    }

    const modifiedFiles = await Promise.all(
        result.Contents?.map(async (file) => ({
            Key: file.Key,
            Size: file.Size,
            LastModified: file.LastModified,
            url: await getFileUrl(file.Key as string)
        })) || []
    );
    const folders = result.CommonPrefixes?.map(prefix => prefix.Prefix) || []

    return NextResponse.json({ files: modifiedFiles, folders })
}

export async function DELETE(request: NextRequest) {
    try {
        const key = request.nextUrl.searchParams.get('key');
        
        if (!key) {
            return NextResponse.json({ error: 'File key is required' }, { status: 400 });
        }

        // Create a command to delete the object
        const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        });

        // Execute the delete command
        await s3Cleint.send(deleteCommand);

        return NextResponse.json({ 
            success: true, 
            message: `File ${key} deleted successfully` 
        });
        
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' }, 
            { status: 500 }
        );
    }
}