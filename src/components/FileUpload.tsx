import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    electron: {
      uploadFile: (
        file: string,
        activeCloudProvider: string,
      ) => Promise<string>;
    };
  }
}

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [settings, setSettings] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loadedSettings = await window.electron.loadSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setUploadStatus('idle');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const uploadFile = async (fileName: File, activeCloudProvider: string) => {
    const shareUrl = await window.electron.uploadFile(
      fileName.path,
      activeCloudProvider,
    );
    navigator.clipboard.writeText(shareUrl);
    return shareUrl;
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadStatus('idle');
    const success = await uploadFile(file, settings.activeCloudProvider);
    setIsUploading(false);
    setUploadStatus(success ? 'success' : 'error');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary',
          )}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-primary">Drop the file here ...</p>
          ) : (
            // eslint-disable-next-line react/no-unescaped-entities
            <p>Drag 'n' drop a file here, or click to select a file</p>
          )}
          {file && (
            <p className="mt-2 text-sm text-muted-foreground">{file.name}</p>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="flex items-center"
          >
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload to Cloud
              </>
            )}
          </Button>
        </div>
        {uploadStatus === 'success' && (
          <p className="mt-4 text-center text-green-500 flex items-center justify-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            File uploaded successfully!
          </p>
        )}
        {uploadStatus === 'error' && (
          <p className="mt-4 text-center text-red-500 flex items-center justify-center">
            <XCircle className="mr-2 h-4 w-4" />
            Error uploading file. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
