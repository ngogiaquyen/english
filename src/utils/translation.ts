export const translateEnglishToVietnamese = async (english: string) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);
  const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(english)}`;

  try {
    try {
      const response = await fetch(googleUrl, { signal: controller.signal });
      if (!response.ok) throw new Error('Google Translate không khả dụng');

      const data = (await response.json()) as unknown[][];
      const segments = Array.isArray(data[0]) ? data[0] : [];
      const translated = segments
        .filter((segment): segment is unknown[] => Array.isArray(segment))
        .map((segment) => (typeof segment[0] === 'string' ? segment[0] : ''))
        .join('')
        .trim();

      if (translated) return translated;
    } catch {
      const fallbackController = new AbortController();
      const fallbackTimeoutId = window.setTimeout(() => fallbackController.abort(), 8000);
      try {
        const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(english)}&langpair=en|vi`;
        const response = await fetch(fallbackUrl, { signal: fallbackController.signal });
        if (!response.ok) throw new Error('Không thể dịch');

        const data = (await response.json()) as {
          responseData?: { translatedText?: string };
        };
        const translated = data.responseData?.translatedText?.trim();
        if (translated) return translated;
      } finally {
        window.clearTimeout(fallbackTimeoutId);
      }
    }

    throw new Error('Không thể dịch');
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export const fetchIPA = async (word: string): Promise<string | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      signal: controller.signal
    });
    window.clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (Array.isArray(data) && data[0]) {
      if (data[0].phonetics && Array.isArray(data[0].phonetics)) {
        const phoneticObj = data[0].phonetics.find((p: any) => p.text);
        if (phoneticObj) return phoneticObj.text;
      }
      return data[0].phonetic || null;
    }
    return null;
  } catch {
    return null;
  }
};
