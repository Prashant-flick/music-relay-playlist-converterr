import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  title: "Spotify to youtube playlist converter",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
          <body suppressHydrationWarning={true}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </body>
      </html>
  );
}
