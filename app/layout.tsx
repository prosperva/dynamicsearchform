import type { Metadata } from "next";
import ThemeRegistry from './ThemeRegistry';

export const metadata: Metadata = {
  title: "Dynamic Search Component Demo",
  description: "A flexible, reusable search component with unlimited fields and multiple input types",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
