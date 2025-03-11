import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { BackgroundLines } from '@/components/ui/bg-lines';

import './globals.css';

const abcdDiatype = localFont({
  src: [
    { path: './fonts/ABCDiatype-Regular.otf', weight: '400' },
    { path: './fonts/ABCDiatype-Bold.otf', weight: '700' },
  ],
  variable: '--font-abcd-diatype',
});

const reckless = localFont({
  src: [
    { path: './fonts/RecklessTRIAL-Regular.woff2', weight: '400' },
    { path: './fonts/RecklessTRIAL-Medium.woff2', weight: '500' },
  ],
  variable: '--font-reckless',
});

export const metadata: Metadata = {
  title: 'Cerebro mail',
  description: 'landing page for cerebro mail',
  openGraph: {
    title: 'Cerebro mail',
    description: 'landing page for cerebro mail',
  },
  twitter: {
    card: 'summary',
    title: 'Cerebro mail',
    description: 'Landing page for cerebro mail',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${reckless.variable} ${abcdDiatype.variable} h-screen overflow-hidden antialiased`}
      >
        <BackgroundLines className="fixed inset-0 -z-10">
          <div></div>
        </BackgroundLines>
        <main className="relative z-10 h-screen w-screen">{children}</main>
      </body>
    </html>
  );
}
