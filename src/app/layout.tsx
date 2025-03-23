import type { Metadata } from 'next';
import { PageProvider } from '../contexts/PageContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coterate Lite',
  description: 'A lightweight UI design feedback application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PageProvider>
          {children}
        </PageProvider>
      </body>
    </html>
  );
}