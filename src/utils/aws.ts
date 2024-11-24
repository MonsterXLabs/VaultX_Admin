import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

export const imageUploadAwsS3 = async (file: File): Promise<AWS.S3.ManagedUpload.SendData> => {
  try {
    // Configure AWS
    AWS.config.update({
      accessKeyId: import.meta.env.VITE_AWS_API_KEY || "",
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY || "",
      region: import.meta.env.VITE_AWS_REGION || "",
    });

    const s3 = new AWS.S3();

    // AWS S3 parameters
    const params: AWS.S3.PutObjectRequest = {
      Bucket: import.meta.env.VITE_AWS_BUCKET_LIST || "",
      Key: uuidv4(), // Unique file key
      Body: file, // Use the File object directly
    };

    // Upload to S3
    return await s3.upload(params).promise();
  } catch (error) {
    throw new Error("Error uploading file: " + (error as Error).message);
  }
};