import { describe, it, beforeAll, expect, vi } from "vitest";
import { imageUploadAwsS3 } from "@/utils/aws";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

vi.mock("aws-sdk");
vi.mock("uuid");

describe("imageUploadAwsS3", () => {
  const mockS3Upload = vi.fn();
  const mockUuid = "mock-uuid";

  beforeAll(() => {
    // Mock the UUID generation
    vi.mocked(uuidv4).mockReturnValue(mockUuid);

    // Mock the AWS S3 SDK
    AWS.S3.prototype.upload = mockS3Upload;
  });

  it("should upload a file to AWS S3 successfully", async () => {
    const mockFile = new File(["dummy content"], "test-file.txt", {
      type: "text/plain",
    });

    const mockResponse = {
      Location: "https://example-bucket.s3.amazonaws.com/mock-uuid",
      Key: mockUuid,
      Bucket: "example-bucket",
    };

    mockS3Upload.mockImplementationOnce(() => ({
      promise: vi.fn().mockResolvedValue(mockResponse),
    }));

    const result = await imageUploadAwsS3(mockFile);

    expect(result).toEqual(mockResponse);
    expect(mockS3Upload).toHaveBeenCalledWith({
      Bucket: process.env.VITE_AWS_BUCKET_LIST,
      Key: mockUuid,
      Body: mockFile,
      ContentType: "text/plain",
    });
  });

  it("should throw an error when upload fails", async () => {
    const mockFile = new File(["dummy content"], "test-file.txt", {
      type: "text/plain",
    });

    mockS3Upload.mockImplementationOnce(() => ({
      promise: vi.fn().mockRejectedValue(new Error("Upload failed")),
    }));

    await expect(imageUploadAwsS3(mockFile)).rejects.toThrow("Error uploading file: Upload failed");
  });
});
