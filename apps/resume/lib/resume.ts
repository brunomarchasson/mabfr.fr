import "server-only";

import { JSONResume } from "@/types/resume";
import { cache } from "react";
import { isValidAccessToken, normalizeToken } from "./token";

export type Resume = {
  resumeData: JSONResume;
  hasAccess: boolean;
};
export async function getResumeData(locale: string, token?: string): Promise<Resume> {
  try {
    const normalized = normalizeToken(token);
    const hasAccess = isValidAccessToken(normalized);

    // Replace with your GitHub gist ID and GitHub token
    const gistId = locale === 'fr' 
      ? process.env.GITHUB_GIST_ID_FR 
      : process.env.GITHUB_GIST_ID;
    
      const githubToken = process.env.GITHUB_TOKEN;
    const fileName = locale === 'fr' ? 'resume.json' : 'resume-en.json';

    if (!gistId || !githubToken) {
      throw new Error("Missing GitHub configuration");
    }


    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Resume-App/1.0",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const gist = await response.json();
    console.log( gist.files)
    // Look for the specific file based on locale
    let resumeFile = gist.files[fileName];

    if (!resumeFile) {
      throw new Error(`Resume file ${fileName} not found in gist`);
    }

    let resumeData: JSONResume;
    try {
      resumeData = JSON.parse(resumeFile.content);
    } catch (parseError) {
      throw new Error("Invalid JSON in resume file");
    }

    return { resumeData: obfuscateResume(resumeData, hasAccess), hasAccess };
  } catch (error) {
    throw error;
  }
}
export const cachedGetResumeData = cache(getResumeData);

export function obfuscateResume(
  resume: JSONResume,
  hasAccess: boolean
): JSONResume {
  if (hasAccess) return resume;

  return {
    ...resume,
    basics: {
      ...resume.basics,
      email: "••••••••@••••.com",
      phone: "•••• ••• •••",
    },
  };
}