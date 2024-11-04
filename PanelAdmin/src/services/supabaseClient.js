// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
// console.log('supabaseUrl', process.env.SUPABASE_URL);
// console.log('supabaseKey', process.env.SUPABASE_API_KEY);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

export const supabase = createClient(
  'https://vjdfhinnbrgaxitnukmw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZGZoaW5uYnJnYXhpdG51a213Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODA4NDc5NSwiZXhwIjoyMDQzNjYwNzk1fQ.CIhGVGLydmt4fin90ozppz3YEyB4QqCqh071p5EBlD4'
);
