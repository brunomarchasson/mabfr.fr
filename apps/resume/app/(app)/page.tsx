import type { Metadata } from "next";
import type { SearchParams } from 'nuqs/server'
import App from "@/components/App";
import ResumeDefault from "@/components/resume/default";
import ResumeModern from "@/components/resume/modern";
import { cachedGetResumeData } from "@/lib/resume";
import { loadSearchParams } from "./search-params";
import ResumeSimple from "@/components/resume/Simple";
import ResumeTerminal from "@/components/resume/Terminal";
import ClientWrapper from "./client-wrapper";
import fs from 'node:fs/promises';
import path from "node:path";

async function getMessages(locale: string) {
  const filePath = path.join(process.cwd(), 'public', 'locales', `${locale}.json`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Could not read or parse locale file for ${locale}`, error);
    return {};
  }
}

interface GenerateMetadataProps {
   searchParams: Promise<SearchParams>
}

export async function generateMetadata({searchParams }: GenerateMetadataProps): Promise<Metadata> { 
  const { lang, token } = await loadSearchParams(searchParams);
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
      // profile: {
      //   firstName: basics?.name?.split(' ')[0],
      //   lastName: basics?.name?.split(' ').slice(1).join(' '),
      //   username: githubUsername,
      // }
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function Home({searchParams}: {
searchParams: Promise<SearchParams>
}) {
  const { style: visualStyle, token, lang } = await loadSearchParams(searchParams);
  const resume = await cachedGetResumeData(lang, token)
  const messages = await getMessages(lang);

  const renderResume = () =>{
      switch(visualStyle){
          case "terminal":
              return <ResumeTerminal resume={resume} locale={lang} />
          case "modern":
              return <ResumeModern resume={resume} locale={lang} />
         
          case "simple":
              return <ResumeSimple resume={resume} locale={lang} />
          default:
              return <ResumeDefault resume={resume} locale={lang} />
      }
  }
  return (
  <ClientWrapper lang={lang} messages={messages}>
  <App resume={resume} lang={lang} token={token} >
    {renderResume()}
  </App>
  </ClientWrapper>);
}
