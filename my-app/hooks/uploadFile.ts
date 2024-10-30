import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import * as ImagePicker from "expo-image-picker";

type UploadOptions = {
  mediaType?: ImagePicker.MediaTypeOptions;
  folder?: string;
  width?: number;
  height?: number;
  mediaTypes?: ImagePicker.MediaTypeOptions;
  allowsEditing?: boolean;
  quality?: number;
};

type UploadFileResponse = {
  path?: string;
  error?: string;
  url?: string;
};

type ProfilePicResponse = {
  url?: string;
  error?: string;
  path?: string;
};
export function useSupabaseUpload(bucketName: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const uploadFile = async (
    uri: string,
    mimeType: string,
    folder: string
  ): Promise<UploadFileResponse> => {
    setUploading(true);
    setError(null);

    try {
      const fileExt = uri.split(".").pop()?.toLowerCase() || "jpeg";
      const fileName = `${folder}/${Date.now()}.${fileExt}`;
      const fileArrayBuffer = await fetch(uri).then((res) => res.arrayBuffer());

      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileArrayBuffer, {
          contentType: mimeType,
        });

      if (uploadError) {
        setError(uploadError.message);
        return { error: uploadError.message };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return { 
        path: data.path,
        url: publicUrlData.publicUrl 
      };
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      setError("Failed to upload the file.");
      return { error: "Failed to upload the file." };
    } finally {
      setUploading(false);
    }
  };

  const pickFile = async (options: UploadOptions = {}) => {
    const { 
      mediaType = ImagePicker.MediaTypeOptions.Images, 
      folder = "uploads", 
      width, 
      height 
    } = options;
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsEditing: true,
      aspect: width && height ? [width, height] : undefined,
      quality: 1,
    });
  
    if (result.canceled) return;
  
    const fileUri = result.assets[0].uri;
    const mimeType = result.assets[0].type || "application/octet-stream";
    const uploadResult = await uploadFile(fileUri, mimeType, folder);
  
    return { ...uploadResult, uri: fileUri };
  };


  const uploadMultipleFiles = async (options: UploadOptions = {}) => {
    try {
      setUploading(true);
      setError(null);
      setFileUrls([]); // Reset file URLs

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: options.mediaTypes || ImagePicker.MediaTypeOptions.All, // Default to all media types
        allowsEditing: options.allowsEditing || false, // Default to no editing
        quality: options.quality || 1, // Default quality
      });

      if (result.canceled && !result.assets || result.assets.length === 0) {
        console.log("User cancelled file picker.");
        return;
      }

      const uploadPromises = result.assets.map(
        (asset) =>
          uploadFile(
            asset.uri,
            asset.type || "application/octet-stream",
            "uploads"
          ) // Specify the folder
      ); // Upload each file
      const urls = await Promise.all(uploadPromises); // Wait for all uploads to complete

      setFileUrls(urls.filter((url) => url !== null) as string[]); // Filter out null URLs
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleProfilePicture = async (
    userId: string,
    imageUri?: string | null
  ): Promise<ProfilePicResponse> => {
    if (!imageUri) {
      // Handle image removal
      return { url: undefined };
    }

    try {
      // Upload new image
      const uploadResult = await uploadFile(
        imageUri,
        'image/jpeg',
        `profiles/${userId}`
      );

      if (uploadResult.error) {
        return { error: uploadResult.error };
      }

      return { url: uploadResult.url };
    } catch (error) {
      console.error('Profile picture update error:', error);
      return { error: 'Failed to update profile picture' };
    }
  };


  return { uploading, error, pickFile, uploadFile, fileUrls, uploadMultipleFiles, handleProfilePicture };
}
