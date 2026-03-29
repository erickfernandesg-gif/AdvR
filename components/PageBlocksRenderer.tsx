'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as motion from "motion/react-client";
import LeadForm from './LeadForm';

interface Block {
  block_name: string;
  content: any;
}

export default function PageBlocksRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.block_name) {
          case 'hero_section':
            return (
              <section key={index} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(45%_45%_at_50%_50%,rgba(37,99,235,0.05)_0%,transparent_100%)] -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="lg:col-span-7"
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-700">SLA de 24 Horas Garantido</span>
                      </div>
                      <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-8">
                        {(block.content.title || '').split('.').map((part: string, i: number) => (
                          <span key={i}>
                            {i === 1 ? <span className="text-blue-600">{part}</span> : part}
                            {i < (block.content.title || '').split('.').length - 1 && '.'}
                          </span>
                        ))}
                      </h1>
                      <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl font-light">
                        {block.content.subtitle}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/#contato" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group">
                          {block.content.primary_button}
                          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                        <Link href="/solucoes" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
                          {block.content.secondary_button}
                        </Link>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="lg:col-span-5 relative"
                    >
                      <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                        <Image 
                          src={block.content.image_url} 
                          alt="Dashboard de Performance" 
                          fill
                          className="object-cover"
                          priority
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                      </div>
                      <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                        <div className="text-3xl font-display font-black text-blue-600">99.9%</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Precisão de Cálculo</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>
            );
          case 'solucoes_bento':
            return (
              <section key={index} id="solucoes" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">{block.content.title}</h2>
                    <p className="text-slate-500 font-light text-lg">{block.content.subtitle}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {block.content.cards.map((card: any, i: number) => (
                      <motion.div 
                        key={card.id}
                        whileHover={{ y: -5 }}
                        className={`${i === 0 || i === 3 ? 'md:col-span-2' : ''} ${i === 1 ? 'bg-blue-600 text-white' : i === 2 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 shadow-sm'} p-8 rounded-[2.5rem] flex flex-col justify-between group`}
                      >
                        <div>
                          <div className={`w-12 h-12 ${i === 1 ? 'bg-white/20' : i === 2 ? 'bg-white/10' : 'bg-blue-600 text-white'} rounded-2xl flex items-center justify-center mb-6`}>
                            <span className="material-symbols-outlined">{card.icon}</span>
                          </div>
                          <h3 className={`text-2xl font-display font-bold mb-4 ${i === 0 || i === 3 ? 'text-3xl' : ''}`}>{card.title}</h3>
                          <p className={`${i === 1 ? 'text-blue-100' : i === 2 ? 'text-slate-400' : 'text-slate-500'} leading-relaxed font-light mb-8 max-w-md`}>
                            {card.description}
                          </p>
                        </div>
                        <Link href="/solucoes" className={`${i === 1 || i === 2 ? 'text-white' : 'text-blue-600'} font-bold flex items-center gap-2 group-hover:gap-3 transition-all`}>
                          Explorar Tecnologia <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            );
          case 'data_belt':
            return (
              <section key={index} className="py-24 bg-slate-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl lg:text-5xl font-display font-extrabold mb-16 text-center tracking-tight">{block.content.title}</h2>
                  
                  <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 hidden lg:block"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
                      {block.content.steps.map((step: any, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="flex flex-col items-center text-center group"
                        >
                          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                          </div>
                          <div className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-2">Passo 0{i + 1}</div>
                          <p className="text-lg font-medium text-slate-200">{step.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          case 'video_section':
            return (
              <section key={index} className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-slate-900 mb-6 tracking-tight uppercase">
                      {block.content.title}
                    </h2>
                    <p className="text-slate-500 font-light text-lg">
                      {block.content.description}
                    </p>
                  </div>
                  
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-slate-900">
                    <iframe 
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${block.content.video_id}`}
                      title={block.content.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </section>
            );
          case 'data_storytelling':
            return (
              <section key={index} className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {block.content.stats.map((stat: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="text-center p-12 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm"
                  >
                    <div className="text-6xl lg:text-8xl font-display font-black text-blue-600 mb-4 tracking-tighter">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </section>
            );
          case 'timeline_modern':
            return (
              <section key={index} className="mb-32 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-16 text-center uppercase tracking-widest">{block.content.title}</h2>
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-1/2 hidden md:block"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {block.content.milestones.map((item: any, i: number) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="relative z-10"
                      >
                        <div className="w-4 h-4 bg-blue-600 rounded-full mx-auto mb-6 border-4 border-white shadow-lg hidden md:block"></div>
                        <div className="text-center">
                          <div className="text-2xl font-display font-black text-slate-900 mb-2">{item.year}</div>
                          <h3 className="text-lg font-bold text-blue-600 mb-3">{item.title}</h3>
                          <p className="text-slate-500 text-sm font-light leading-relaxed">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            );
          case 'culture_section':
            return (
              <section key={index} className="bg-slate-900 p-16 rounded-[4rem] text-white text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <h2 className="text-4xl font-display font-bold mb-8 tracking-tight">{block.content.title}</h2>
                <p className="text-slate-400 font-light text-lg max-w-2xl mx-auto leading-relaxed mb-12">
                  {block.content.description}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {block.content.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-6 py-3 bg-white/10 rounded-full text-sm font-bold uppercase tracking-widest">{tag}</span>
                  ))}
                </div>
              </section>
            );
          case 'pipeline_visual':
            return (
              <section key={index} className="mb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-16 text-center uppercase tracking-widest">{block.content.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                  <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -translate-y-1/2 hidden md:block -z-10"></div>
                  {block.content.steps.map((step: any, i: number) => (
                    <motion.div 
                      key={step.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative"
                    >
                      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-100">
                        <span className="material-symbols-outlined">{step.icon}</span>
                      </div>
                      <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest">Etapa {step.id}</div>
                      <h3 className="text-xl font-display font-bold text-slate-900 mb-4">{step.title}</h3>
                      <p className="text-slate-500 text-sm font-light leading-relaxed">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          case 'technical_focus':
            return (
              <section key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="bg-slate-900 p-12 rounded-[3rem] text-white">
                  <h3 className="text-3xl font-display font-bold mb-8">{block.content.title}</h3>
                  <ul className="space-y-6">
                    {block.content.features.map((feature: any, i: number) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-blue-400">{feature.icon}</span>
                        <div>
                          <h4 className="font-bold mb-1">{feature.title}</h4>
                          <p className="text-slate-400 text-sm font-light">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-12">
                  <h3 className="text-3xl font-display font-bold text-slate-900 mb-6">{block.content.cta_title}</h3>
                  <p className="text-slate-500 font-light leading-relaxed mb-8">
                    {block.content.cta_description}
                  </p>
                  <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    {block.content.cta_button}
                  </button>
                </div>
              </section>
            );
          case 'contact_section':
            return (
              <section key={index} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="lg:col-span-5"
                  >
                    <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-slate-900 mb-8 tracking-tight">
                      {(block.content.title || '').split('.').map((part: string, i: number) => (
                        <span key={i} className={i === 1 ? 'text-blue-600' : ''}>{part}{i === 0 ? '.' : ''}</span>
                      ))}
                    </h1>
                    <p className="text-xl text-slate-500 font-light leading-relaxed mb-12">
                      {block.content.subtitle}
                    </p>
                    
                    <div className="space-y-8">
                      <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                          <span className="material-symbols-outlined">mail</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">E-mail Corporativo</div>
                          <div className="text-lg font-bold text-slate-900">{block.content.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                          <span className="material-symbols-outlined">location_on</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Sede Corporativa</div>
                          <div className="text-lg font-bold text-slate-900">{block.content.location}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="lg:col-span-7"
                  >
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
                      <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">{block.content.form_title}</h2>
                      <LeadForm buttonText={block.content.form_button} />
                    </div>
                  </motion.div>
                </div>
              </section>
            );
          case 'blog_highlight':
            return (
              <section key={index} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                  <div>
                    <h2 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-4">{block.content.title}</h2>
                    <p className="text-slate-500 font-light text-lg">{block.content.subtitle}</p>
                  </div>
                  <Link href="/blog" className="text-blue-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-4 transition-all">
                    Ver Todos os Insights <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
                <Link href={`/blog-detalhes/${block.content.post?.slug || ''}`} className="group block">
                  <div className="bg-slate-900 p-12 rounded-[3rem] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
                    <div className="relative z-10">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block mb-8">
                        {block.content.post?.category || 'Insight'}
                      </div>
                      <h3 className="text-4xl lg:text-6xl font-display font-bold mb-8 group-hover:text-blue-400 transition-colors leading-tight max-w-4xl">
                        {block.content.post?.title || ''}
                      </h3>
                      <p className="text-slate-400 text-xl font-light leading-relaxed max-w-2xl mb-12">
                        {block.content.post?.excerpt || ''}
                      </p>
                      <div className="flex items-center gap-4 text-blue-400 font-bold uppercase tracking-widest text-sm group-hover:gap-6 transition-all">
                        Explorar Insight <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            );
          case 'social_proof':
            return (
              <section key={index} className="py-16 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-10">{block.content.title}</p>
                  <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
                    {block.content.companies.map((company: string, i: number) => (
                      <span key={i} className="text-2xl font-display font-black tracking-tighter text-slate-900">{company}</span>
                    ))}
                  </div>
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
