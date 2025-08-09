import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Cleint } from "../../../config/index";

export async function DELETE(request: NextRequest) {
    try {
        // Validate environment variables
        if (!process.env.BUCKET_NAME) {
            console.error('BUCKET_NAME environment variable is not set');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const key = request.nextUrl.searchParams.get('key') ?? undefined;
        
        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        console.log('Deleting file:', key);

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
        
        // Handle specific AWS errors
        let errorMessage = 'Failed to delete file';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        return NextResponse.json(
            { 
                error: errorMessage,
                details: error instanceof Error ? error.message : 'Unknown error'
            }, 
            { status: 500 }
        );
    }
}