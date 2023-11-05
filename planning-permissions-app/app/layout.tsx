import "./globals.css";
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buildsmart",
  description: "The place for everything related to planning permissions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${workSans.className} max-h-[100dvh] h-[100dvh]`}>
        {children}
        <footer className="relative bottom-2 self-center text-center">
          Built with ❤️ in London, UK 🇬🇧. Powered by{" "}
          <a href="https://www.anthropic.com/product">Anthropic</a>
        </footer>
      </body>
    </html>
  );
}
