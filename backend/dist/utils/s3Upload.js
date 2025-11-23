"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToS3 = uploadFileToS3;
exports.deleteFileFromS3 = deleteFileFromS3;
exports.validateFile = validateFile;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Client_1 = require("./s3Client");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
/**
 * Upload a file to S3 and return the URL
 * @param file - The file buffer from multer
 * @param originalName - Original filename
 * @param mimeType - MIME type of the file
 * @param folder - Optional folder path in S3 (e.g., 'applications', 'reimbursements')
 * @returns Promise<string> - The S3 URL of the uploaded file
 */
async function uploadFileToS3(file, originalName, mimeType, folder = "uploads") {
    // Generate a unique filename to avoid collisions
    const fileExtension = path_1.default.extname(originalName);
    const randomString = crypto_1.default.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}-${randomString}${fileExtension}`;
    // Prepare the upload parameters
    const uploadParams = {
        Bucket: s3Client_1.S3_BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: mimeType,
        // Make the file publicly readable (adjust based on your security needs)
        // ACL: "public-read" as const,
    };
    try {
        // Upload file to S3
        const command = new client_s3_1.PutObjectCommand(uploadParams);
        await s3Client_1.s3Client.send(command);
        // Construct and return the S3 URL
        const s3Url = `https://${s3Client_1.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        return s3Url;
    }
    catch (error) {
        console.error("Error uploading file to S3:", error);
        throw new Error("Failed to upload file to S3");
    }
}
/**
 * Delete a file from S3
 * @param fileUrl - The full S3 URL of the file to delete
 * @returns Promise<void>
 */
async function deleteFileFromS3(fileUrl) {
    try {
        // Extract the key from the URL
        const url = new URL(fileUrl);
        const key = url.pathname.substring(1); // Remove leading slash
        const deleteParams = {
            Bucket: s3Client_1.S3_BUCKET_NAME,
            Key: key,
        };
        const command = new client_s3_1.DeleteObjectCommand(deleteParams);
        await s3Client_1.s3Client.send(command);
        console.log(`Successfully deleted file: ${key}`);
    }
    catch (error) {
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
function validateFile(file, maxSizeMB = 10, allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]) {
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
