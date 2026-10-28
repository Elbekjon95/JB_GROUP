import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JB GROUP - Bojxona va Omborxona Logistika Majmuasi',
  description: 'JB GROUP Bojxona Ombori - Yuklarni saqlash, ortish-tushirish, bojxona rasmiylashtiruvi va logistika boshqaruvi platformasi',
  icons: {
    icon: '/jb-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <link rel="icon" href="/jb-logo.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
