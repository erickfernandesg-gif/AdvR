'use client';

import { VideoContent } from '@/types/blocks';

export default function VideoSection({ content }: { content: VideoContent }) {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-display font-extrabold text-foreground mb-6 tracking-tight uppercase">
            {content.title}
          </h2>
          <p className="text-muted-foreground font-light text-lg">
            {content.description}
          </p>
        </div>
        
        <div className="glow-card relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-border bg-secondary">
          <iframe 
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${content.video_id}`}
            title={content.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}
