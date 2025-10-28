import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PropsWithChildren } from "react";
import { fallbackLng, languages } from "@/i18n/settings";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { cachedGetResumeData } from "@/lib/resume";
import { loadSearchParams } from "./search-params";

export async function generateMetadata({ params, searchParams }: RootLayoutProps): Promise<Metadata> {
  const { lang, token } = await loadSearchParams(searchParams || {});
  const resume = await cachedGetResumeData(lang, token);
  const { basics } = resume.resumeData;

  let imageUrl = basics?.image || ""; // Fallback image

  // Fetch GitHub avatar
  const githubUsername = basics?.profiles?.find(p => p.network?.toLowerCase() === 'github')?.username;
  if (githubUsername) {
    try {
      const githubResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
      if (githubResponse.ok) {
        const githubData = await githubResponse.json();
        if (githubData.avatar_url) {
          imageUrl = githubData.avatar_url;
        }
      }
    } catch (error) {
      console.error("Failed to fetch GitHub avatar:", error);
      // Silently fail and use the fallback imageUrl
    }
  }

  const title = `${basics?.name} | ${basics?.label}`;
  const description = basics?.summary || "";

  return {
    title: title,
    description: description,
    icons: {
      icon: imageUrl,
      shortcut: imageUrl,
      apple: imageUrl,
    },
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 248,
          height: 248,
          alt: basics?.name,
        },
      ],
      type: 'profile',
      profile: {
        firstName: basics?.name?.split(' ')[0],
        lastName: basics?.name?.split(' ').slice(1).join(' '),
        username: githubUsername,
      }
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

interface RootLayoutProps extends PropsWithChildren {
  params: { locale: string };
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
