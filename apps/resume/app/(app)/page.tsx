import App from "@/components/App";
import ResumeDefault from "@/components/resume/default";
import ResumeModern from "@/components/resume/modern";
import { cachedGetResumeData } from "@/lib/resume";
import { loadSearchParams } from "./search-params";
import ResumeSimple from "@/components/resume/Simple";
import ResumeTerminal from "@/components/resume/Terminal";
import ClientWrapper from "./client-wrapper";
import ResumeAbstract from "@/components/resume/abstract";
import ResumeLine from "@/components/resume/line";


async function getMessages(locale: string) {
  const fs = require('fs/promises');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'public', 'locales', `${locale}.json`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Could not read or parse locale file for ${locale}`, error);
    return {};
  }
}

export default async function Home({searchParams}: {params: { locale: string }, searchParams: {style?: string, lang?: string}  }) {
  const { style: visualStyle, token, lang } = await loadSearchParams(searchParams);
  const resume = await cachedGetResumeData(lang, token)
  const messages = await getMessages(lang);

  const renderResume = () =>{
      switch(visualStyle){
          case "terminal":
              return <ResumeTerminal resume={resume} locale={lang} />
          case "modern":
              return <ResumeModern resume={resume} locale={lang} />
          case "abstract":
              return <ResumeAbstract resume={resume} locale={lang} />
          case "line":
              return <ResumeLine resume={resume} locale={lang}/>
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
