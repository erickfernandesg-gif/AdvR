import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcrdgnwpjtpvhcvxzswp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_rBtJizSXa1MeJlzrbtDqMw_vDUDAq2H';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data: page } = await supabase.from('pages').select('id').eq('slug', '/blog').single();
  if (page) {
    // Update hero_section
    await supabase.from('page_blocks').update({
      content: {
        title: "Insights & Estratégia. O Futuro da Remuneração.",
        subtitle: "Artigos, tendências e análises profundas sobre como otimizar a performance da sua equipe de vendas.",
        image_url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80",
        image_link: "",
        primary_button: "Assinar Newsletter",
        secondary_button: "Ver Artigos",
        primary_button_link: "#newsletter",
        secondary_button_link: "#artigos"
      }
    }).eq('page_id', page.id).eq('block_name', 'hero_section');

    // Delete the old blog_highlight
    await supabase.from('page_blocks').delete().eq('page_id', page.id).eq('block_name', 'blog_highlight');

    // Insert the correct blog_highlight
    await supabase.from('page_blocks').insert({
      page_id: page.id,
      block_name: 'blog_highlight',
      order_index: 20,
      content: {
        title: 'Destaque do Mês',
        subtitle: 'O artigo mais lido pela nossa comunidade de diretores.',
        post: {
          title: 'A Gestão Proativa na Remuneração Variável',
          excerpt: 'Como antecipar desafios e otimizar resultados através da análise preditiva e feedback contínuo.',
          category: 'Suporte Proativo',
          slug: 'suporte-proativo',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80'
        }
      }
    });

    // Insert blog_list
    await supabase.from('page_blocks').insert({
      page_id: page.id,
      block_name: 'blog_list',
      order_index: 30,
      content: {
        title: 'Todos os Insights',
        subtitle: 'Acesse nossa biblioteca completa de conhecimento.'
      }
    });

    console.log("Fixed DB blocks for /blog");
  }
}
fix();
