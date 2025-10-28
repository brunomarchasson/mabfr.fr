export function normalizeToken(token?: string): string {
  return typeof token === 'string' ? token : '';
}

export function isValidAccessToken(token: string): boolean {
  return token === process.env.NEXT_PUBLIC_ACCESS_TOKEN;
}