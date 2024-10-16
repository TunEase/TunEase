import axios from "axios";
console.log("access key", process.env.ACCESS_KEY);

// Function to fetch images from Unsplash based on a topic
export const fetchImages = async (
  topic: string,
  count: number = 5
): Promise<string[]> => {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: topic,
        per_page: count,
      },
      headers: {
        Authorization: `Client-ID ${process.env.ACCESS_KEY}`,
      },
    });

    // Extract image URLs from the response
    const imageUrls = response.data.results.map(
      (image: any) => image.urls.regular
    );
    return imageUrls;
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    return [];
  }
};
