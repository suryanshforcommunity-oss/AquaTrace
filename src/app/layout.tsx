import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "AquaTrace | Community Water Intelligence & Conservation Platform",
  description: "Community-driven water resource monitoring, groundwater tracking, tanker logistics and rainwater harvesting conservation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#071B49",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('unhandledrejection', function(event) {
                  if (event.reason && (
                    (event.reason.message && (event.reason.message.includes('MetaMask') || event.reason.message.includes('metamask'))) ||
                    (typeof event.reason === 'string' && event.reason.includes('MetaMask')) ||
                    (event.reason.stack && event.reason.stack.includes('chrome-extension://'))
                  )) {
                    event.preventDefault();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-canvas text-content-primary antialiased font-sans">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
