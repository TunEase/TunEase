import { faker } from '@faker-js/faker';
import { supabase } from '../services/supabaseClient';

const NEWS_TYPES = ['PROMOTION', 'UPDATE', 'EVENT', 'ANNOUNCEMENT', 'OFFER'] as const;
const TAGS = [
  'Special Offer', 'Limited Time', 'New Service', 'Featured',
  'Discount', 'Holiday', 'Seasonal', 'Premium', 'Flash Sale',
  'Member Only', 'Weekend Special', 'Trending'
];

async function seedNewsData(count = 20) {
  try {
    console.log('🌱 Starting news data seeding...');

    // Get existing businesses for reference
    const { data: businesses, error: businessError } = await supabase
      .from('business')
      .select('id');

    if (businessError || !businesses?.length) {
      throw new Error('No businesses found or error fetching businesses');
    }

    // Get some users for reactions and comments
    const { data: users, error: userError } = await supabase
      .from('user_profile')
      .select('id');

    if (userError || !users?.length) {
      throw new Error('No users found or error fetching users');
    }

    for (let i = 0; i < count; i++) {
      // Create news post
      const newsData = {
        business_id: businesses[Math.floor(Math.random() * businesses.length)].id,
        title: faker.company.catchPhrase(),
        content: faker.lorem.paragraphs(2),
        type: NEWS_TYPES[Math.floor(Math.random() * NEWS_TYPES.length)],
        status: Math.random() > 0.1 ? 'active' : 'inactive', // 90% active
        views: faker.number.int({ min: 0, max: 1000 }),
      };

      const { data: news, error: newsError } = await supabase
        .from('news')
        .insert(newsData)
        .select()
        .single();

      if (newsError || !news) {
        console.error(`Error creating news ${i + 1}:`, newsError);
        continue;
      }

      console.log(`📰 Created news post ${i + 1}`);

      // Add tags (2-4 random tags)
      const numTags = faker.number.int({ min: 2, max: 4 });
      const selectedTags = faker.helpers.shuffle(TAGS).slice(0, numTags);
      
      for (const tag of selectedTags) {
        await supabase
          .from('news_tags')
          .insert({
            news_id: news.id,
            tag_name: tag,
          });
      }

      // Add reactions (random number of upvotes/downvotes)
      const numReactions = faker.number.int({ min: 5, max: 20 });
      const reactionPromises = Array(numReactions).fill(null).map(async () => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        return supabase
          .from('news_reactions')
          .insert({
            news_id: news.id,
            user_id: randomUser.id,
            reaction_type: Math.random() > 0.3 ? 'upvote' : 'downvote', // 70% upvotes
          })
          .select();
      });

      await Promise.all(reactionPromises);

      // Add comments (0-5 random comments)
      const numComments = faker.number.int({ min: 0, max: 5 });
      const commentPromises = Array(numComments).fill(null).map(async () => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        return supabase
          .from('news_comments')
          .insert({
            news_id: news.id,
            user_id: randomUser.id,
            content: faker.lorem.sentence(),
          })
          .select();
      });

      await Promise.all(commentPromises);
    }

    console.log('✅ News data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding news data:', error);
  }
}

// Create a function to add media to news posts
async function addMediaToNews() {
  try {
    console.log('🖼️ Adding media to news posts...');

    const { data: newsItems, error: newsError } = await supabase
      .from('news')
      .select('id');

    if (newsError || !newsItems?.length) {
      throw new Error('No news found or error fetching news');
    }

    for (const news of newsItems) {
      // Add 1-3 images per news post
      const numImages = faker.number.int({ min: 1, max: 3 });
      
      for (let i = 0; i < numImages; i++) {
        const mediaData = {
          news_id: news.id,
          media_url: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
          is_primary: i === 0, // First image is primary
          media_type: 'image',
        };

        await supabase
          .from('media')
          .insert(mediaData);
      }

      console.log(`📸 Added media to news post ${news.id}`);
    }

    console.log('✅ Media addition completed successfully!');
  } catch (error) {
    console.error('❌ Error adding media:', error);
  }
}

// Export functions to be called from your app
export const seedNews = async () => {
  await seedNewsData();
  await addMediaToNews();
};


