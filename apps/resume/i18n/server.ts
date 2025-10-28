import fs from 'fs/promises';
import path from 'path';
import { createT } from './utils';
import { cache } from 'react';

const getMessages = cache(async (locale: string) => {
  const filePath = path.join(process.cwd(), 'public', 'locales', `${locale}.json`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Could not read or parse locale file for ${locale}`, error);
    return {};
  }
});

export async function useTranslation(locale: string) {
  const messages = await getMessages(locale);
  return {
    t: createT(messages),
  };
}
