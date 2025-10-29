import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PropsWithChildren } from "react";
import { fallbackLng, languages } from "@/i18n/settings";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { loadSearchParams } from "./search-params";



interface RootLayoutProps extends PropsWithChildren {
  searchParams: { [key: string]: string | string[] | undefined };
}

// export async function generateStaticParams() {
//   return languages.map((locale) => ({ locale }));
// }

export default async function RootLayout({
  children,
  searchParams,
}: RootLayoutProps) {
    const { lang } = await loadSearchParams(searchParams || {});
  const l = lang && languages.includes(lang) ? lang :fallbackLng;
    
  return (
    <html lang={l} suppressHydrationWarning>
      <body className={GeistSans.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>
                {children}
            </NuqsAdapter>
          </ThemeProvider>
      </body>
    </html>
  );
}
