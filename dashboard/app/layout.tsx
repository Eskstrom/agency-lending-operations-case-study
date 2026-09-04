import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const title = 'Agency Lending Exception Control Center';
const description = 'Operational risk, made actionable. An interactive agency-lending portfolio prototype.';
export const metadata: Metadata = {
  metadataBase: new URL('https://agency-lending-exception-center.true-kid-4321.chatgpt.site'),
  title,
  description,
  openGraph: { title, description, images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${sans.variable} ${mono.variable} antialiased`}>{children}</body></html>; }
