import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, S3_BUCKET_NAME } from "./s3Client";
import crypto from "crypto";
import path from "path";

/**
 * Upload a file to S3 and return the URL
 * @param file - The file buffer from multer
 * @param originalName - Original filename
 * @param mimeType - MIME type of the file
 * @param folder - Optional folder path in S3 (e.g., 'applications', 'reimbursements')
 * @returns Promise<string> - The S3 URL of the uploaded file
 */
export async function uploadFileToS3(
  file: Buffer,
  originalName: string,
  mimeType: string,
  folder: string = "uploads"
): Promise<string> {
  // Generate a unique filename to avoid collisions
  const fileExtension = path.extname(originalName);
  const randomString = crypto.randomBytes(16).toString("hex");
  const timestamp = Date.now();
  const fileName = `${folder}/${timestamp}-${randomString}${fileExtension}`;

  // Prepare the upload parameters
  const uploadParams = {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: mimeType,
    // Make the file publicly readable (adjust based on your security needs)
    // ACL: "public-read" as const,
  };

  try {
    // Upload file to S3
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Construct and return the S3 URL
    const s3Url = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return s3Url;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}

/**
 * Delete a file from S3
 * @param fileUrl - The full S3 URL of the file to delete
 * @returns Promise<void>
 */
export async function deleteFileFromS3(fileUrl: string): Promise<void> {
  try {
    // Extract the key from the URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const deleteParams = {
      Bucket: S3_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);

    console.log(`Successfully deleted file: ${key}`);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("Failed to delete file from S3");
  }
}

/**
 * Validate file size and type
 * @param file - The file from multer
 * @param maxSizeMB - Maximum file size in MB
 * @param allowedTypes - Array of allowed MIME types
 */
export function validateFile(
  file: Express.Multer.File,
  maxSizeMB: number = 10,
  allowedTypes: string[] = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]
): { valid: boolean; error?: string } {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: `File type ${file.mimetype} is not allowed`,
    };
  }

  return { valid: true };
}
