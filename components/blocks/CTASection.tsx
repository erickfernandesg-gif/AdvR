import Link from 'next/link';
import { CTAContent } from '@/types/blocks';

export default function CTASection({ content }: { content: CTAContent }) {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-blue-600 px-6 py-14 text-center shadow-[0_24px_80px_rgba(37,99,235,0.22)] sm:px-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.35),transparent_42%)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">
            {content.eyebrow || 'Próximo passo'}
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
            {content.subtitle}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={content.button_link || '/contato'} className="btn-light">
              {content.button_text}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            {content.secondary_text && (
              <Link href={content.secondary_link || '/solucoes'} className="btn-outline-light">
                {content.secondary_text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
