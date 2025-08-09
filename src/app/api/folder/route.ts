import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Cleint } from "../../../config/index";

export async function POST(request: NextRequest) {
    try {
        // Validate environment variables
        if (!process.env.BUCKET_NAME) {
            console.error('BUCKET_NAME environment variable is not set');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const body = await request.json();
        const { folderName, parentPath } = body;
        
        if (!folderName) {
            return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
        }

        // Construct the folder path
        const folderPath = parentPath 
            ? `${parentPath.endsWith('/') ? parentPath : parentPath + '/'}${folderName}/`
            : `${folderName}/`;

        console.log('Creating folder:', folderPath);

        // Create an empty object to represent the folder
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: folderPath,
            Body: '',
            ContentType: 'application/x-directory'
        });

        await s3Cleint.send(command);

        return NextResponse.json({ 
            success: true, 
            message: `Folder "${folderName}" created successfully`,
            folderPath 
        });
        
    } catch (error) {
        console.error('Error creating folder:', error);
        
        // Handle specific AWS errors
        let errorMessage = 'Failed to create folder';
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
