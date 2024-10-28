import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import * as ImagePicker from "expo-image-picker";

type UploadOptions = {
  mediaType?: ImagePicker.MediaTypeOptions;
  folder?: string;
  width?: number;
  height?: number;
};

type UploadFileResponse = {
  path?: string;
  error?: string;
};

export function useSupabaseUpload(bucketName: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      return { path: data.path };
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      setError("Failed to upload the file.");
      return { error: "Failed to upload the file." };
    } finally {
      setUploading(false);
    }
  };

  const pickFile = async (options: UploadOptions = {}) => {
    const { mediaType = ImagePicker.MediaTypeOptions.Images, folder = "uploads", width, height } = options;

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

  return { uploading, error, pickFile, uploadFile };
}
