import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import LayoutWrapper from '@/components/LayoutWrapper';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'NestCraft Interiors',
  description: 'Design-led interiors and furniture storefront built with Next.js.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
