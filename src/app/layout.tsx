import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

import './globals.css';
import Navbar from '@/components/Navbar';
import getConfig from 'next/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'papirsarkany.hu - Papírsárkány, sárkány, anyagok',
  description: 'Papírsárkány árusítás 1984-óta.',
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { publicRuntimeConfig } = getConfig()

  return (
    <html lang="en" className="scroll-pt-[68px] scroll-smooth sm:scroll-pt-[72px]" data-app-version={publicRuntimeConfig.appVersion}>
      <body className={`${inter.className} `}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="grid flex-1 bg-sky-100">
            {children}
            <Analytics />
          </main>
        </div>
      </body>
    </html>
  );
}
