'use client';

import { PageBlock } from '@/types/blocks';
import HeroSection from './blocks/HeroSection';
import DataBelt from './blocks/DataBelt';
import SolucoesBento from './blocks/SolucoesBento';
import VideoSection from './blocks/VideoSection';
import DataStorytelling from './blocks/DataStorytelling';
import TimelineModern from './blocks/TimelineModern';
import CultureSection from './blocks/CultureSection';
import PipelineVisual from './blocks/PipelineVisual';
import TechnicalFocus from './blocks/TechnicalFocus';
import ContactSection from './blocks/ContactSection';
import BlogHighlight from './blocks/BlogHighlight';
import SocialProof from './blocks/SocialProof';

const BLOCK_COMPONENTS: Record<string, React.ComponentType<{ content: any }>> = {
  hero_section: HeroSection,
  data_belt: DataBelt,
  solucoes_bento: SolucoesBento,
  video_section: VideoSection,
  data_storytelling: DataStorytelling,
  timeline_modern: TimelineModern,
  culture_section: CultureSection,
  pipeline_visual: PipelineVisual,
  technical_focus: TechnicalFocus,
  contact_section: ContactSection,
  blog_highlight: BlogHighlight,
  social_proof: SocialProof,
};

export default function PageBlocksRenderer({ blocks }: { blocks: PageBlock[] }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <>
      {blocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.block_name];
        
        if (!Component) {
          console.warn(`Block component not found for: ${block.block_name}`);
          return null;
        }

        return <Component key={`${block.block_name}-${index}`} content={block.content} />;
      })}
    </>
  );
}
