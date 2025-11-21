import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../style/globals.css";
import SiteLayouts from "./layouts/SiteLayouts";
import ToastProvider from "@/components/ui/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "crud firebase",
  description: "crud firebase users and products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteLayouts>
          {" "}
          <ToastProvider /> {children}
        </SiteLayouts>
      </body>
    </html>
  );
}
