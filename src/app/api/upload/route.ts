import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3Cleint } from "../../../config/index"

export async function PUT(request: NextRequest) {
    const key = request.nextUrl.searchParams.get('key') ?? undefined
    
    if(!key) {
        throw new Error("Key is required");
    }

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME as string,
            Key: key,
        });
        
        const url = await getSignedUrl(s3Cleint, command, {expiresIn: 3600});
        
        return NextResponse.json({ url });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
}