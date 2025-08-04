import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Cleint } from "../../../config/index";

export async function DELETE(request: NextRequest) {
    const key = request.nextUrl.searchParams.get('key') ?? undefined;
    
    if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME as string,
            Key: key,
        });
        
        const response = await s3Cleint.send(command);
        
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