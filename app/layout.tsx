import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { getGlobalSettings } from '@/lib/db';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-headline' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  title: 'AdvR - Remuneração Variável Estratégica',
  description: 'A AdvR transforma modelos complexos em vantagem competitiva com tecnologia de ponta para Premiação de Vendas.',
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
