import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useSupabaseUpload } from "./uploadFile";
import { useMedia } from "./useMedia";

export function useSendMessage(conversationId: string, senderId: string) {
  const { uploadMultipleFiles, uploading: mediaUploading } =
    useSupabaseUpload("application");
  const { insertMediaRecord, Mediaerror, MediaUploading } = useMedia();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    content: string,
    mediaType?: "image" | "video"
  ) => {
    setSendingMessage(true);
    setError(null);

    try {
      // Step 1: Insert the message
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
        })
        .select("id")
        .single();

      if (messageError) {
        throw new Error(messageError.message);
      }

      const messageId = messageData.id;

      // Step 2: Handle media upload if mediaType is provided
      if (mediaType) {
        const result = await uploadMultipleFiles({
          mediaTypes: mediaType === "image" ? "Images" : "Videos",
        });
        if (result && result.urls) {
          // Step 3: Insert media records with the message_id
          await Promise.all(
            result.urls.map(async (mediaUrl) => {
              const sendMedia = await insertMediaRecord(
                mediaUrl || "",
                mediaType,
                {
                  message_id: messageId,
                }
              );

              if (Mediaerror) {
                throw new Error(Mediaerror);
              }
            })
          );
        } else if (result && result.error) {
          throw new Error(result.error);
        }
      }

      return messageData;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const loading = mediaUploading || sendingMessage || MediaUploading;

  return {
    sendMessage,
    loading,
    error: error || Mediaerror,
  };
}
