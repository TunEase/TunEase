import React, { useState } from "react";
import { View, Button, Image, Text, StyleSheet } from "react-native";
import { useSupabaseUpload } from "../../hooks/uploadFile";

const Signup = () => {
  const { uploading, error, pickFile } = useSupabaseUpload("application");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileUpload = async () => {
    const result = await pickFile();
    if (result?.path) {
      setFileUrl(result.path);
    }
  };

  return (
    <View>
      {fileUrl && <Image source={{ uri: fileUrl }} style={styles.avatar} />}
      <Button
        title={uploading ? "Uploading..." : "Upload File"}
        onPress={handleFileUpload}
        disabled={uploading}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 150,
    height: 150,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default Signup;