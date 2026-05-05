import type { Metadata } from "next";
import { Cinzel, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Ierushalaim",
  description: "Trivia vivencial sobre Jerusalén",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${frank.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
