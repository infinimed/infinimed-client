'use client';
import React, { useState } from 'react';
import {
  AiOutlinePlus,
  AiOutlineDelete,
  AiOutlineUpload,
} from 'react-icons/ai';
import axios from 'axios';
import Button from '@/components/Button';

interface UploadImageProps {
  cloudinaryUrl: string;
  uploadPreset: string;
  onUploadImage: (assets: string[]) => Promise<void>;
  handleSkip: () => Promise<void>;
}

const UploadImage: React.FC<UploadImageProps> = ({
  cloudinaryUrl,
  uploadPreset,
  onUploadImage,
  handleSkip,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleDelete = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedUrls = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    setUploading(true);

    try {
      const uploadPromises = selectedFiles.map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        return axios.post(cloudinaryUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      });

      const responses = await Promise.all(uploadPromises);
      await onUploadImage(responses.map((response) => response.data.url));

      setUploading(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <label className="cursor-pointer flex flex-col items-center justify-center py-4 px-6 bg-white text-primary rounded-lg shadow-md transition-all duration-300">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="flex">
          <AiOutlinePlus className="text-3xl" />
          <p className="font-poppins text-2xl">Upload</p>
        </span>
      </label>
      {previewUrls.length === 0 && (
        <label className="cursor-pointer flex flex-col items-center justify-center py-4 px-6  text-primary rounded-lg shadow-md transition-all duration-300 bg-primaryDark">
          <span className="flex ">
            <p
              className="font-poppins text-2xl text-white"
              onClick={handleSkip}
            >
              Cancel
            </p>
          </span>
        </label>
      )}

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded-md shadow-sm"
              />
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 shadow hover:bg-red-600 transition-all"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <Button
          type="button"
          onClick={handleUpload}
          size="medium"
          variant="primary"
          icon={<AiOutlineUpload />}
          disabled={uploading}
          className={`mt-4 transition-all duration-300 ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </Button>
      )}
    </div>
  );
};

export default UploadImage;
