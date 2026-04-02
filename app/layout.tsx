import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { getGlobalSettings } from '@/lib/db';

import { Metadata } from 'next';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-headline' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: {
    default: 'AdvR - Engenharia de Remuneração Variável',
    template: '%s | AdvR'
  },
  description: 'A AdvR transforma modelos complexos em vantagem competitiva com tecnologia de ponta para Premiação de Vendas. Otimize sua remuneração variável com o Motor Colossus.',
  keywords: ['Remuneração Variável', 'Premiação de Vendas', 'Motor de Cálculo', 'Incentivos Corporativos', 'Colossus', 'AdvR', 'Engenharia de Dados'],
  authors: [{ name: 'AdvR' }],
  creator: 'AdvR',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://advr.com.br',
    title: 'AdvR - Engenharia de Remuneração Variável',
    description: 'Transformamos dados complexos em performance extraordinária com o Motor Colossus.',
    siteName: 'AdvR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdvR - Engenharia de Remuneração Variável',
    description: 'Transformamos dados complexos em performance extraordinária com o Motor Colossus.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getGlobalSettings();

  return (
    <html lang="pt-BR" className={`${manrope.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,0,0,24&display=swap" rel="stylesheet" />
        {settings.google_analytics_id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.google_analytics_id}');
                `,
              }}
            />
          </>
        )}
        {settings.custom_script_head && (
          <script dangerouslySetInnerHTML={{ __html: settings.custom_script_head }} />
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
