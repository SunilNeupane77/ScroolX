"use client";
import { IKUpload, ImageKitProvider } from "imagekitio-next";
import { IKUploadResponse, UploadError } from "imagekitio-next/dist/types/components/IKUpload/props";
import { useState } from "react";
import { Progress } from "./ui/progress";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

if (!publicKey || !urlEndpoint) {
  throw new Error("ImageKit environment variables are not properly configured");
}

interface AuthResponse {
  signature: string;
  expire: number;
  token: string;
}

const authenticator = async (): Promise<AuthResponse> => {
  try {
    const response = await fetch("/api/auth"); // Changed to relative path
    if (!response.ok) throw new Error(`Auth failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

type UploadProps = {
  setVideoUrl: (url: string) => void;
};

export default function Upload({ setVideoUrl }: UploadProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (err: UploadError) => {
    console.error("Upload Error:", err);
    setError(err.message || "Upload failed");
    setUploadProgress(0);
    setIsUploading(false);
  };

  const onSuccess = (res: IKUploadResponse) => {
    console.log("Upload Success:", res);
    setVideoUrl(res.url);
    setUploadProgress(100);
    setTimeout(() => setUploadProgress(0), 2000); // Reset after 2 seconds
    setIsUploading(false);
    setError(null);
  };

  const onUploadProgress = (evt: ProgressEvent<XMLHttpRequestEventTarget>) => {
    if (evt.lengthComputable) {
      const progress = Math.round((evt.loaded / evt.total) * 100);
      setUploadProgress(progress);
    }
  };

  const onUploadStart = () => {
    setUploadProgress(0);
    setIsUploading(true);
    setError(null);
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div className="space-y-4">
        <p className="text-sm font-medium">Upload Video</p>
        
        <IKUpload
          useUniqueFileName={true}
          validateFile={(file) => {
            const isValid = file.size < 20 * 1024 * 1024; // 20MB limit
            if (!isValid) setError("File must be smaller than 20MB");
            return isValid;
          }}
          folder="/videos"
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />

        {(isUploading || uploadProgress > 0) && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-gray-500 text-right">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </ImageKitProvider>
  );
}