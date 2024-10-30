import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

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
        console.log("Upload error:", uploadError);
        setError(uploadError.message);
        return { error: uploadError.message };
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        url: publicUrlData.publicUrl,
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
      height,
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
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access media library is required!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: options.mediaTypes || ImagePicker.MediaTypeOptions.All, // Default to all media type
        quality: options.quality || 1, // Default quality,
        allowsMultipleSelection: true,
      });

      if ((result.canceled && !result.assets) || result.assets.length === 0) {
        console.log("User cancelled file picker.");
        return;
      }

      const uploadPromises = result.assets.map(async (asset) => {
        console.log(`Uploading file: ${asset.uri}`);
        const response = await uploadFile(asset.uri, "image", "uploads");

        if (response.error) {
          console.error(`Error uploading file ${asset.uri}: ${response.error}`);
        }
        return response.url;
      });

      const urls = await Promise.all(uploadPromises);
      return {
        urls: urls,
      }; // Filter out null URLs
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
  const uploadPdfFiles = async () => {
    setUploading(true);
    setError(null);
    setFileUrls([]); // Reset file URLs
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: "application/pdf", // Specify PDF type
        copyToCacheDirectory: true, // Optional: copy to cache directory
        multiple: true,
      });
      if ((result.canceled && !result.assets) || result.assets.length === 0) {
        console.log("User cancelled file picker.");
        return;
      }

      const uploadPromises = result.assets.map(async (asset) => {
        console.log(`Uploading file: ${asset.uri}`);
        const response = await uploadFile(
          asset.uri,
          asset.type || "application/octet-stream",
          "uploads"
        );
        if (response.error) {
          console.error(`Error uploading file ${asset.uri}: ${response.error}`);
        }
        return response.url;
      });

      const urls = await Promise.all(uploadPromises);
      console.log("urls", urls);
      return {
        urls: urls,
      }; // Filter out null URLs
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
  return {
    uploading,
    error,
    pickFile,
    uploadFile,
    fileUrls,
    uploadMultipleFiles,
    uploadPdfFiles,
  };
}
