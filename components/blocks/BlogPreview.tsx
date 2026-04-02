'use client';

import Link from 'next/link';
import * as motion from 'motion/react-client';

export default function BlogPreview({ content }: { content: any }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-6 tracking-tight">
              {content.title}
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              {content.subtitle}
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/blog" className="btn-electric !py-5 !px-10 text-lg">
              {content.button_text}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
