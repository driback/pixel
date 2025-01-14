import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { PixelateStoreProvider } from "~/components/providers/pixelate-provider";
import { ThemeProvider } from "~/components/providers/theme-provider";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 2,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "hsl(0, 0%, 100%)" },
    { media: "(prefers-color-scheme: dark)", color: "hsl(0, 0%, 0%)" },
  ],
};

export const metadata: Metadata = {
  title: "Pixelate Image",
  description: "Convert your images into pixel art with customizable settings",
  keywords: ["pixel art", "image converter", "pixelate", "image editor"],
  authors: [{ name: "driback" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakartaSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <PixelateStoreProvider>{children}</PixelateStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
