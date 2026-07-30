import Link from 'next/link';
import { CaseStudyContent } from '@/types/blocks';

export default function CaseStudy({ content }: { content: CaseStudyContent }) {
  const stages = [
    { label: content.problem_title, text: content.problem, icon: 'error_outline' },
    { label: content.solution_title, text: content.solution, icon: 'hub' },
    { label: content.result_title, text: content.result, icon: 'trending_up' },
  ];

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="section-eyebrow">{content.eyebrow || 'Aplicação prática'}</p>
            <h2 className="section-title mt-4">{content.title}</h2>
            <p className="section-copy mt-6">{content.subtitle}</p>
            {content.button_text && (
              <Link
                href={content.button_link || '/contato'}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-500"
              >
                {content.button_text}
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            )}
          </div>

          <div className="grid gap-4">
            {stages.map((stage, index) => (
              <article key={stage.label} className="grid grid-cols-[auto_1fr] gap-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${index === 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>
                  <span className="material-symbols-outlined text-[22px]">{stage.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">{stage.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{stage.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
