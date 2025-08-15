// import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import ReduxProvider from '@/lib/redux-provider';
import BottomNavbar from '@/components/BottomNavbar';
import AuthProvider from '@/Providers/AuthProvider';
import type { Metadata } from 'next';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Infinimed',
  description: 'Home Medic Services',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-scrollbar ">
      <body
        style={{ overflow: 'overlay' }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black overflow-scroll`}
      >
        <ReduxProvider>
          <AuthProvider>
            <Theme accentColor="ruby" panelBackground="solid">
              <main className="min-h-screen pb-24">{children}</main>
              <BottomNavbar />
            </Theme>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
