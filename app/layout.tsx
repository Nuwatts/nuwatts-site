import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@/components/analytics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const title = 'Nuwatts — Thermal Infrastructure for Space Compute';
const description = 'Nuwatts helps unlock more compute per kilogram by reducing radiator burden through better thermal transport and energy recovery.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
