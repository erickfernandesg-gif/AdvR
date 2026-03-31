import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: posts, error } = await supabase.from('posts').select('*').eq('slug', 'suporte-proativo');
  console.log('Posts:', posts);
  console.log('Error:', error);
}

checkData();
