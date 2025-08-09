import { S3Client } from "@aws-sdk/client-s3"

// Validate environment variables
if (!process.env.AWS_ACCESS_KEY_ID) {
    console.error('AWS_ACCESS_KEY_ID environment variable is not set');
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('AWS_SECRET_ACCESS_KEY environment variable is not set');
}

if (!process.env.BUCKET_NAME) {
    console.error('BUCKET_NAME environment variable is not set');
}

export const s3Cleint = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    region: process.env.AWS_REGION || 'ap-south-1',
})
