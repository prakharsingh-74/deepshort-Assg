import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: '🎬 Bollywood Script Generator — MASALAWOOD',
  description: 'Turn any ordinary situation into an epic Bollywood blockbuster. Powered by AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#18181d',
              color: 'rgba(240,240,245,0.92)',
              border: '1px solid rgba(255,255,255,0.07)',
              fontSize: '13px',
              borderRadius: '10px',
            },
            success: { iconTheme: { primary: '#f59e0b', secondary: '#18181d' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#18181d' } },
          }}
        />
      </body>
    </html>
  );
}
