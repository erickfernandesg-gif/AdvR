import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcrdgnwpjtpvhcvxzswp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_rBtJizSXa1MeJlzrbtDqMw_vDUDAq2H';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: page } = await supabase.from('pages').select('id').eq('slug', '/blog').single();
  if (page) {
    const { data: blocks } = await supabase.from('page_blocks').select('*').eq('page_id', page.id).order('order_index');
    console.log(JSON.stringify(blocks, null, 2));
  } else {
    console.log("No /blog page in DB");
  }
}
check();
