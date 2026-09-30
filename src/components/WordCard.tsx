import { useState } from 'react';
import { Volume2, Languages } from 'lucide-react';
import type { WordData } from '../types/word';
import { translateEnglishToVietnamese, fetchIPA } from '../utils/translation';

const BASE_URL = 'https://www.oxfordlearnersdictionaries.com';

export default function WordCard({ data }: { data: WordData }) {
  const [translation, setTranslation] = useState<string | null>(data.meaning || null);
  const [ipa, setIpa] = useState<string | null>(data.ipa || null);
  const [isLoading, setIsLoading] = useState(false);

  const playSound = (urls: string[]) => {
    const mp3Url = urls.find(url => url.endsWith('.mp3'));
    if (mp3Url) {
      const audio = new Audio(`${BASE_URL}${mp3Url}`);
      audio.play();
    }
  };

  const handleTranslate = async () => {
    if (translation) return;
    setIsLoading(true);
    try {
      const [transResult, ipaResult] = await Promise.all([
        translateEnglishToVietnamese(data.word).catch(() => 'Không thể dịch'),
        fetchIPA(data.word)
      ]);
      setTranslation(transResult);
      if (ipaResult) setIpa(ipaResult);
    } catch {
      setTranslation('Không thể dịch');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
            {data.word} {ipa && <span className="text-sm text-gray-500 font-normal ml-2">{ipa}</span>}
          </h3>
          {translation && (
            <p className="text-emerald-600 text-sm mt-1 font-medium">{translation}</p>
          )}
          {isLoading && (
            <p className="text-gray-400 text-sm mt-1 animate-pulse">Đang tải...</p>
          )}
        </div>
        
        <button 
          onClick={handleTranslate}
          className="text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 p-2 rounded-xl transition-colors"
          title="Dịch sang tiếng Việt"
        >
          <Languages size={20} />
        </button>
      </div>

      <div className="flex gap-2">
        {data.sound?.uk && data.sound.uk.length > 0 && (
          <button 
            onClick={() => playSound(data.sound!.uk!)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-colors text-sm font-semibold active:scale-95"
            title="Nghe giọng Anh (UK)"
          >
            <Volume2 size={18} /> UK
          </button>
        )}
        {data.sound?.us && data.sound.us.length > 0 && (
          <button 
            onClick={() => playSound(data.sound!.us!)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-100 transition-colors text-sm font-semibold active:scale-95"
            title="Nghe giọng Mỹ (US)"
          >
            <Volume2 size={18} /> US
          </button>
        )}
      </div>
    </div>
  );
}
