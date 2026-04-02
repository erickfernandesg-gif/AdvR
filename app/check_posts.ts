import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcrdgnwpjtpvhcvxzswp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_rBtJizSXa1MeJlzrbtDqMw_vDUDAq2H';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPosts() {
  const { data, error } = await supabase.from('posts').select('*').limit(1);
  if (error) {
    console.error('Error fetching posts:', error.message);
  } else {
    console.log('Posts exist:', data);
  }
}

checkPosts();
