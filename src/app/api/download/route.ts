import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Cleint } from "../../../config/index"

export async function GET(request: NextRequest) {
    try {
        const key = request.nextUrl.searchParams.get('key');
        
        if (!key) {

            return NextResponse.json({ error: 'File key is required' }, { status: 400 });
        }

        // Create a command to get the object for download
        const getObjectCommand = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"` // Force download
        });

        // Generate a signed URL for download (expires in 1 hour)
        const downloadUrl = await getSignedUrl(s3Cleint, getObjectCommand, { expiresIn: 3600 });

        // Redirect to the download URL
        return NextResponse.redirect(downloadUrl);
        
    } catch (error) {
        console.error('Error generating download URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate download URL' }, 
            { status: 500 }
        );
    }
}
