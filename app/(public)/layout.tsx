import { getGlobalSettings } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getGlobalSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <div className="flex-grow">
        {children}
      </div>
      <Footer settings={settings} />
    </div>
  );
}
