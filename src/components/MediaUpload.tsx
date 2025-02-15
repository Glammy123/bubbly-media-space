
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Music, Video } from "lucide-react";

interface MediaUploadProps {
  onUpload: (file: File) => void;
  type: 'audio' | 'video';
}

const MediaUpload = ({ onUpload, type }: MediaUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    validateAndUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
  };

  const validateAndUpload = (file: File) => {
    const isAudio = type === 'audio' && file.type.startsWith('audio/');
    const isVideo = type === 'video' && file.type.startsWith('video/');
    
    if (!isAudio && !isVideo) {
      toast.error(`Please upload a valid ${type} file`);
      return;
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast.error('File size must be less than 100MB');
      return;
    }

    onUpload(file);
    toast.success('File uploaded successfully');
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative mt-4 p-8 border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
    >
      <input
        type="file"
        accept={type === 'audio' ? 'audio/*' : 'video/*'}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-2 text-center">
        {type === 'audio' ? (
          <Music className="w-8 h-8 text-primary" />
        ) : (
          <Video className="w-8 h-8 text-primary" />
        )}
        <p className="text-sm font-medium">
          Drag and drop your {type} file here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Maximum file size: 100MB
        </p>
      </div>
    </div>
  );
};

export default MediaUpload;
