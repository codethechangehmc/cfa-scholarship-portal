# S3 File Upload Implementation Guide

This guide explains the S3 file upload capability that has been added to the CFA Scholarship Portal.

## Overview

The application now supports direct file uploads to Amazon S3, eliminating the need for users to email documents separately. Files are uploaded securely, stored in S3, and their metadata is tracked in MongoDB.

## Architecture

### Backend Components

1. **S3 Client Configuration** (`backend/src/utils/s3Client.ts`)
   - Initializes AWS S3 client with credentials
   - Validates environment variables
   - Exports configured client for use throughout the app

2. **S3 Upload Utilities** (`backend/src/utils/s3Upload.ts`)
   - `uploadFileToS3()`: Uploads files with unique names to prevent collisions
   - `deleteFileFromS3()`: Removes files from S3
   - `validateFile()`: Validates file size (max 10MB) and type

3. **File Routes** (`backend/src/routes/files.ts`)
   - `POST /api/files/upload`: Upload a file to S3
   - `GET /api/files/:fileId`: Get file metadata
   - `GET /api/files/entity/:entityType/:entityId`: Get all files for an entity
   - `DELETE /api/files/:fileId`: Delete a file (soft or permanent)

### Frontend Components

1. **FileUpload Component** (`frontend/src/components/FileUpload.tsx`)
   - Reusable upload component with drag-and-drop style interface
   - Shows upload progress and success/error states
   - Validates file size and type before upload
   - Displays uploaded file info with remove option

2. **Integration** (`frontend/src/app/new-applicant/page.tsx`)
   - Integrated into Section 4 of the scholarship application
   - Replaces email-based document submission
   - Tracks uploaded files in application state

## Setup Instructions

### 1. Configure AWS S3

First, you need to set up an S3 bucket and get your AWS credentials:

1. **Create an S3 Bucket:**
   - Go to AWS Console > S3
   - Click "Create bucket"
   - Choose a unique bucket name (e.g., `cfa-scholarship-documents`)
   - Select your region
   - Configure bucket settings (keep "Block all public access" enabled for security)
   - Create the bucket

2. **Create IAM User with S3 Access:**
   - Go to AWS Console > IAM > Users
   - Click "Add users"
   - Enter username (e.g., `cfa-scholarship-uploader`)
   - Select "Programmatic access"
   - Attach policy: `AmazonS3FullAccess` (or create a custom policy with limited permissions)
   - Complete the wizard and **save the Access Key ID and Secret Access Key**

3. **Configure CORS (if accessing S3 directly from frontend):**
   - Go to your S3 bucket > Permissions > CORS
   - Add this configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["http://localhost:3000", "your-production-domain.com"],
       "ExposeHeaders": []
     }
   ]
   ```

### 2. Update Environment Variables

Edit `backend/.env` with your actual AWS credentials:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_actual_access_key_id
AWS_SECRET_ACCESS_KEY=your_actual_secret_access_key
AWS_REGION=us-east-1  # Change to your bucket's region
AWS_S3_BUCKET_NAME=your-bucket-name
```

**Security Note:** Never commit `.env` files to version control. The `.env.example` file is provided as a template.

### 3. Test the Backend API

Start the backend server:

```bash
cd backend
yarn dev
```

Test the upload endpoint with curl:

```bash
curl -X POST http://localhost:8080/api/files/upload \
  -F "file=@/path/to/test-file.pdf" \
  -F "userId=000000000000000000000000" \
  -F "relatedEntityType=application" \
  -F "relatedEntityId=test123" \
  -F "documentType=transcript"
```

### 4. Test the Frontend

Start the frontend development server:

```bash
cd frontend
yarn dev
```

Navigate to http://localhost:3000/new-applicant and proceed to Section 4 to test file uploads.

## API Reference

### Upload File

```
POST /api/files/upload
Content-Type: multipart/form-data

Body:
- file: The file to upload
- userId: User ID who is uploading
- relatedEntityType: Type of entity (application, midYearReport, paymentRequest)
- relatedEntityId: ID of the related entity
- documentType: Type of document (diploma, transcript, etc.)

Response:
{
  "message": "File uploaded successfully",
  "file": {
    "id": "64f8c1a2...",
    "url": "https://bucket.s3.region.amazonaws.com/...",
    "originalName": "diploma.pdf",
    "size": 1048576,
    "documentType": "diploma"
  }
}
```

### Get File by ID

```
GET /api/files/:fileId

Response:
{
  "id": "64f8c1a2...",
  "url": "https://bucket.s3.region.amazonaws.com/...",
  "originalName": "diploma.pdf",
  "mimeType": "application/pdf",
  "size": 1048576,
  "documentType": "diploma",
  "uploadedAt": "2025-11-23T10:30:00.000Z"
}
```

### Get Files for Entity

```
GET /api/files/entity/:entityType/:entityId

Response:
{
  "files": [
    {
      "id": "64f8c1a2...",
      "url": "https://bucket.s3.region.amazonaws.com/...",
      "originalName": "diploma.pdf",
      ...
    }
  ]
}
```

### Delete File

```
DELETE /api/files/:fileId?permanent=true

Response:
{
  "message": "File permanently deleted"
}
```

## Security Considerations

1. **File Validation:**
   - Files are limited to 10MB by default
   - Only specific MIME types are allowed (PDF, images, Word docs)
   - Filenames are sanitized and made unique

2. **Access Control:**
   - In production, add authentication middleware to routes
   - Validate that users can only access their own files
   - Consider using presigned URLs for temporary, secure file access

3. **S3 Bucket Permissions:**
   - Keep bucket private (block public access)
   - Use IAM policies to grant minimal required permissions
   - Enable versioning and logging for audit trails

4. **Environment Variables:**
   - Never commit `.env` files
   - Use AWS Secrets Manager or similar in production
   - Rotate credentials regularly

## File Storage Structure

Files are organized in S3 with this structure:

```
bucket-name/
  ├── application/
  │   ├── 1732359000000-abc123def456.pdf
  │   └── 1732359001000-xyz789ghi012.jpg
  ├── midYearReport/
  │   └── ...
  └── paymentRequest/
      └── ...
```

The filename format is: `{folder}/{timestamp}-{random-hash}{extension}`

## Troubleshooting

### "Access Denied" Errors
- Check that AWS credentials are correct in `.env`
- Verify IAM user has S3 permissions
- Ensure bucket name matches exactly

### "File too large" Errors
- Default limit is 10MB
- Adjust `maxSizeMB` prop in FileUpload component
- Update multer limits in `backend/src/routes/files.ts`

### CORS Errors (Frontend)
- Configure CORS in S3 bucket settings
- Add your frontend URL to allowed origins
- Check backend CORS middleware allows your frontend

### Upload Fails Silently
- Check browser console for errors
- Verify backend is running on port 8080
- Check MongoDB connection is working

## Next Steps

1. **Add Authentication:** Integrate user authentication to replace placeholder userId
2. **Add Progress Indicators:** Show upload progress for large files
3. **Add File Previews:** Display thumbnails for images
4. **Add Download Links:** Allow users to download their uploaded files
5. **Add File Expiration:** Implement lifecycle policies to delete old files
6. **Add Virus Scanning:** Use AWS Lambda to scan uploaded files

## File Model Schema

The File model in MongoDB stores this metadata:

```typescript
{
  userId: ObjectId,
  relatedEntityType: "application" | "midYearReport" | "paymentRequest",
  relatedEntityId: ObjectId,
  fileMetadata: {
    originalName: string,
    mimeType: string,
    size: number,
    storageUrl: string,
    documentType: string
  },
  uploadedAt: Date,
  isDeleted: boolean,
  deletedAt?: Date
}
```

## Support

For questions or issues:
- Check AWS CloudWatch logs for S3 errors
- Check backend server logs for API errors
- Check browser console for frontend errors
- Review AWS S3 documentation: https://docs.aws.amazon.com/s3/
