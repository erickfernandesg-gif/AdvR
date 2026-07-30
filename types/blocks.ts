export interface HeroContent {
  title: string;
  subtitle: string;
  eyebrow?: string;
  compact?: boolean;
  primary_button: string;
  secondary_button: string;
  primary_button_link?: string;
  secondary_button_link?: string;
  image_url: string;
  image_link?: string;
  image_alt?: string;
}

export interface ValuePropositionItem {
  icon: string;
  title: string;
  description: string;
}

export interface ValuePropositionContent {
  eyebrow?: string;
  title: string;
  subtitle: string;
  items: ValuePropositionItem[];
}

export interface HighlightCardContent {
  eyebrow?: string;
  title: string;
  description: string;
  stat?: string;
  stat_label?: string;
}

export interface CTAContent {
  eyebrow?: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link?: string;
  secondary_text?: string;
  secondary_link?: string;
}

export interface AudienceItem {
  icon: string;
  title: string;
  description: string;
}

export interface AudienceContent {
  eyebrow?: string;
  title: string;
  subtitle: string;
  items: AudienceItem[];
}

export interface CaseStudyContent {
  eyebrow?: string;
  title: string;
  subtitle: string;
  problem_title: string;
  problem: string;
  solution_title: string;
  solution: string;
  result_title: string;
  result: string;
  button_text?: string;
  button_link?: string;
}

export interface BentoCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface BentoContent {
  eyebrow?: string;
  title: string;
  subtitle: string;
  cards: BentoCard[];
}

export interface DataBeltStep {
  icon: string;
  label: string;
}

export interface DataBeltContent {
  title: string;
  steps: DataBeltStep[];
}

export interface VideoContent {
  title: string;
  description: string;
  video_id: string;
}

export interface StatItem {
  value: string;
  suffix: string;
  label: string;
}

export interface DataStorytellingContent {
  stats: StatItem[];
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export interface TimelineContent {
  title: string;
  milestones: Milestone[];
}

export interface CultureContent {
  title: string;
  description: string;
  tags: string[];
}

export interface PipelineStep {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface PipelineContent {
  title: string;
  steps: PipelineStep[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface TechnicalFocusContent {
  title: string;
  features: FeatureItem[];
  cta_title: string;
  cta_description: string;
  cta_button: string;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  email: string;
  location: string;
  phone?: string;
  whatsapp?: string;
  form_title: string;
  form_button: string;
}

export interface BlogPostHighlight {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image_url?: string;
}

export interface BlogHighlightContent {
  title: string;
  subtitle: string;
  post: BlogPostHighlight;
}

export interface SocialProofContent {
  title: string;
  companies: string[];
}

export interface ROICalculatorContent {
  title: string;
  subtitle: string;
  cta_text: string;
}

export interface PortalFeature {
  title: string;
  description: string;
  image_url?: string;
}

export interface PortalFeaturesContent {
  title: string;
  features: PortalFeature[];
}

export type BlockContent = 
  | HeroContent 
  | BentoContent 
  | DataBeltContent 
  | VideoContent 
  | DataStorytellingContent 
  | TimelineContent 
  | CultureContent 
  | PipelineContent 
  | TechnicalFocusContent 
  | ContactContent 
  | BlogHighlightContent 
  | SocialProofContent
  | ROICalculatorContent
  | PortalFeaturesContent
  | ValuePropositionContent
  | HighlightCardContent
  | CTAContent
  | AudienceContent
  | CaseStudyContent;

export interface PageBlock {
  id?: string;
  block_name: string;
  content: any; // Using any here for the union dispatch, but components will be strictly typed
}
