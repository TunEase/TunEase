import { faker } from "@faker-js/faker";
import { supabase } from "../services/supabaseClient";

export const addNews = async () => {
    try {
        // Fetch existing businesses to reference them
        const { data: businesses } = await supabase
            .from('business')
            .select('id');

        if (!businesses || businesses.length === 0) {
            console.error('No businesses found');
            return;
        }

        // Create 10 news items
        for (let i = 0; i < 10; i++) {
            // Create news entry
            const newsData = {
                business_id: businesses[Math.floor(Math.random() * businesses.length)].id,
                title: faker.company.catchPhrase(),
                content: faker.lorem.paragraphs(3),
                created_at: faker.date.past(),
                updated_at: faker.date.recent(),
            };

            const { data: news, error: newsError } = await supabase
                .from('news')
                .insert(newsData)
                .select()
                .single();

            if (newsError) {
                console.error('Error creating news:', newsError);
                continue;
            }

            // Add media for the news
            const mediaData = {
                news_id: news.id,
                media_type: 'image',
                media_url: faker.image.url({ width: 640, height: 480 }),
                created_at: faker.date.past(),
                updated_at: faker.date.recent(),
            };

            const { error: mediaError } = await supabase
                .from('media')
                .insert(mediaData);

            if (mediaError) {
                console.error('Error creating media:', mediaError);
            }

            // Add 2-4 tags for each news
            const numberOfTags = faker.number.int({ min: 2, max: 4 });
            const tags = [];
            for (let j = 0; j < numberOfTags; j++) {
                //@ts-ignore
                tags.push({
            
                    news_id: news.id,
            
                    tag_name: faker.word.sample(),
                });
            }

            const { error: tagError } = await supabase
                .from('news_tag')
                .insert(tags);

            if (tagError) {
                console.error('Error creating tags:', tagError);
            }
        }

        console.log('Successfully added news items with media and tags');
    } catch (error) {
        console.error('Error in addNews:', error);
    }
};

// Types de données factices pour les news
const newsCategories = [
    'Business Update',
    'New Service',
    'Special Offer',
    'Event',
    'Achievement',
    'Partnership',
    'Community',
    'Technology',
    'Innovation',
    'Customer Story'
];

const tagOptions = [
    'urgent',
    'promotion',
    'new',
    'featured',
    'limited-time',
    'exclusive',
    'trending',
    'popular',
    'seasonal',
    'special'
];

// Fonction helper pour générer un titre réaliste
const generateNewsTitle = (category: string): string => {
    switch (category) {
        case 'Business Update':
            return `${faker.company.name()} Announces ${faker.company.buzzPhrase()}`;
        case 'New Service':
            return `Introducing Our New ${faker.commerce.productName()} Service`;
        case 'Special Offer':
            return `Special ${faker.number.int({ min: 10, max: 75 })}% Off on ${faker.commerce.productName()}`;
        case 'Event':
            return `Join Us for ${faker.company.buzzPhrase()} Event`;
        default:
            return faker.company.catchPhrase();
    }
};

// Fonction helper pour générer une description réaliste
const generateNewsDescription = (category: string): string => {
    switch (category) {
        case 'Business Update':
            return `${faker.company.catchPhrase()}. ${faker.company.buzzPhrase()}.`;
        case 'New Service':
            return `We're excited to introduce our latest service offering. ${faker.commerce.productDescription()}`;
        case 'Special Offer':
            return `Limited time offer! ${faker.commerce.productDescription()}. Don't miss out on this amazing opportunity.`;
        case 'Event':
            return `Join us for an exciting event. ${faker.lorem.paragraph()}`;
        default:
            return faker.lorem.paragraph();
    }
};