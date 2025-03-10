import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';

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

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
        className={`${geistSans.variable} ${geistMono.variable} ${reckless.variable} ${abcdDiatype.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
