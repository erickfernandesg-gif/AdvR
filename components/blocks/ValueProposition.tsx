import { ValuePropositionContent } from '@/types/blocks';

export default function ValueProposition({ content }: { content: ValuePropositionContent }) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-xl">
            {content.eyebrow && (
              <p className="section-eyebrow">{content.eyebrow}</p>
            )}
            <h2 className="section-title mt-4">{content.title}</h2>
            <p className="section-copy mt-6">{content.subtitle}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {content.items?.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-colors hover:border-blue-200 hover:bg-blue-50/40"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
