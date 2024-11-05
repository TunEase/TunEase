import { faker } from "@faker-js/faker";
import { supabase } from "../services/supabaseClient";


const MEDIA_TYPES = ['image', 'video'] as const;

// Updated image generation function
const generateMediaUrl = () => {
  // Using faker's new image API
  return faker.image.url({
    width: 1200,
    height: 800,
    category: faker.helpers.arrayElement([
      'business',
      'product',
      'event',
      'people',
      'technics',
      'nature'
    ])
  });
};

export const addMediaToNews = async () => {
  try {
    const { data: newsItems, error: newsError } = await supabase
      .from('news')
      .select('id');

    if (newsError) throw newsError;
    if (!newsItems?.length) {
      console.log('No news items found');
      return;
    }

    console.log(`Found ${newsItems.length} news items. Adding media...`);

    for (const news of newsItems) {
      const mediaCount = faker.number.int({ min: 1, max: 4 });
      const mediaItems = [];

      for (let i = 0; i < mediaCount; i++) {
        //@ts-ignore
        mediaItems.push({
          news_id: news.id,
          media_type: faker.helpers.arrayElement(MEDIA_TYPES),
          media_url: generateMediaUrl(),
          is_primary: i === 0,
          created_at: faker.date.past(),
          updated_at: faker.date.recent()
        });
      }

      const { error: mediaError } = await supabase
        .from('media')
        .insert(mediaItems);

      if (mediaError) {
        console.error(`Error adding media to news ${news.id}:`, mediaError);
        continue;
      }

      console.log(`Added ${mediaCount} media items to news ${news.id}`);
    }

    console.log('Successfully added media to all news items');
  } catch (error) {
    console.error('Error in addMediaToNews:', error);
  }
};

// Alternative version with more realistic URLs
export const addCustomMediaToNews = async () => {
  const customUrls = [
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg',
    'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg',
    'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg',
    'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg',
    'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg',
    'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg',
    'https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg',
    'https://images.pexels.com/photos/3184300/pexels-photo-3184300.jpeg'
  ];

  try {
    const { data: newsItems, error: newsError } = await supabase
      .from('news')
      .select('id, type');

    if (newsError) throw newsError;
    if (!newsItems?.length) return;

    for (const news of newsItems) {
      const mediaCount = faker.number.int({ min: 1, max: 3 });
      const selectedUrls = faker.helpers.arrayElements(customUrls, mediaCount);
      
      const mediaItems = selectedUrls.map((url, index) => ({
        news_id: news.id,
        media_type: 'image',
        media_url: url,
        is_primary: index === 0,
        created_at: new Date(),
        updated_at: new Date()
      }));

      const { error: mediaError } = await supabase
        .from('media')
        .insert(mediaItems);

      if (mediaError) {
        console.error(`Error adding media to news ${news.id}:`, mediaError);
        continue;
      }

      console.log(`Added ${mediaCount} media items to news ${news.id}`);
    }

    console.log('Successfully added custom media to all news items');
  } catch (error) {
    console.error('Error in addCustomMediaToNews:', error);
  }
};