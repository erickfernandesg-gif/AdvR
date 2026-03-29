import Link from 'next/link';

export default function Footer({ settings }: { settings: any }) {
  return (
    <footer className="bg-white border-t border-border pt-24 pb-12 relative overflow-hidden">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-neon"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">insights</span>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">AdvR</span>
            </div>
            <p className="text-muted-foreground mb-10 max-w-md font-light leading-relaxed text-lg">
              Líder em engenharia de remuneração variável. Transformamos complexidade em performance com tecnologia de elite e precisão matemática.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h3 className="font-display font-extrabold text-foreground mb-8 uppercase tracking-[0.2em] text-xs">Navegação Estratégica</h3>
            <ul className="space-y-5">
              <li><Link href="/empresa" className="text-muted-foreground hover:text-primary transition-colors font-semibold text-sm uppercase tracking-widest">Sobre a AdvR</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors font-semibold text-sm uppercase tracking-widest">Insights de Elite</Link></li>
              <li><Link href="/solucoes" className="text-muted-foreground hover:text-primary transition-colors font-semibold text-sm uppercase tracking-widest">Nossas Soluções</Link></li>
              <li><Link href="/contato" className="text-muted-foreground hover:text-primary transition-colors font-semibold text-sm uppercase tracking-widest">Fale Conosco</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-display font-extrabold text-foreground mb-8 uppercase tracking-[0.2em] text-xs">Sede Corporativa</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-muted-foreground font-light">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                </div>
                <span className="pt-2">{settings.address}</span>
              </li>
              <li className="flex items-center gap-4 text-muted-foreground font-light">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">call</span>
                </div>
                <span>{settings.phone_number}</span>
              </li>
              <li className="flex items-center gap-4 text-muted-foreground font-light">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">mail</span>
                </div>
                <span>{settings.email_contact}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Advanced Resources. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacidade</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Compliance</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
