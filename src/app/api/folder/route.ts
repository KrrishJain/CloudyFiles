import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Cleint } from "../../../config/index";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { folderName, parentPath } = body;
        
        if (!folderName) {
            return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
        }

        // Construct the folder path
        const folderPath = parentPath 
            ? `${parentPath.endsWith('/') ? parentPath : parentPath + '/'}${folderName}/`
            : `${folderName}/`;

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
        return NextResponse.json(
            { error: 'Failed to create folder' }, 
            { status: 500 }
        );
    }
}
