import { useState } from "react";
import { supabase } from "../services/supabaseClient";
type MediaOptions = {
  user_profile_id?: string;
  business_id?: string;
  service_id?: string;
  complaint_id?: string;
  review_id?: string;
  fee_id?: string;
  eligibility_id?: string;
};

type MediaRecord = {
  id: string;
  media_url: string;
  media_type: string;
  user_profile_id?: string;
  business_id?: string;
  service_id?: string;
  complaint_id?: string;
  review_id?: string;
  fee_id?: string;
};

export function useMedia() {
  const [Mediaerror, setMediaError] = useState<string | null>(null);
  const [MediaUploading, setMediaUploading] = useState(false);
  const insertMediaRecord = async (
    url: string,
    mimeType: string,
    options: MediaOptions
  ) => {
    setMediaError(null);
    setMediaUploading(true);
    try {
      const { data, error } = await supabase
        .from("media")
        .insert({
          media_url: url,
          media_type: mimeType,
          user_profile_id: options.user_profile_id,
          business_id: options.business_id,
          service_id: options.service_id,
          complaint_id: options.complaint_id,
          review_id: options.review_id,
          fee_id: options.fee_id,
        })
        .select("*")
        .single();
      setMediaUploading(false);
      if (error) {
        setMediaError(error.message);
      }

      return { data };
    } catch (error) {
      setMediaUploading(false);
      setMediaError("Failed to insert media record");
    }
  };

  return { insertMediaRecord, Mediaerror, MediaUploading };
}
