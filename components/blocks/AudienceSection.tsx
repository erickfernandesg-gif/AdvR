import { AudienceContent } from '@/types/blocks';

export default function AudienceSection({ content }: { content: AudienceContent }) {
  return (
    <section className="bg-slate-950 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow !text-cyan-300">{content.eyebrow || 'Para quem é'}</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {content.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.items?.map((item) => (
            <article key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
