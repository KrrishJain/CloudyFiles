import { S3Client } from "@aws-sdk/client-s3"

export const s3Cleint = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
    region: 'ap-south-1',
})
