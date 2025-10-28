export function createT(messages: Record<string, any>) {
  return function t(key: string): string {
    const keys = key.split('.');
    let result: any = messages;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key; // Return the key itself if not found
      }
    }
    return result as string;
  };
}
