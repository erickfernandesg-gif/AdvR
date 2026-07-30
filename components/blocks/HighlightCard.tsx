import { HighlightCardContent } from '@/types/blocks';

export default function HighlightCard({ content }: { content: HighlightCardContent }) {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 lg:grid-cols-[1fr_auto]">
        <div className="p-8 sm:p-12 lg:p-16">
          <p className="section-eyebrow !text-cyan-300">
            {content.eyebrow || 'Eficiência operacional'}
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {content.description}
          </p>
        </div>

        {content.stat && (
          <div className="flex min-w-64 flex-col justify-center border-t border-white/10 bg-blue-600 p-8 text-white lg:border-l lg:border-t-0 lg:p-12">
            <strong className="text-5xl font-black tracking-tight">{content.stat}</strong>
            {content.stat_label && (
              <span className="mt-3 max-w-44 text-sm font-semibold leading-5 text-blue-100">
                {content.stat_label}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
