import { Volume2, CheckCircle2, Circle } from 'lucide-react';
import type { WordData } from '../types/word';

export default function WordCard({ data, isLearned, onToggleLearned }: { data: WordData, isLearned?: boolean, onToggleLearned?: () => void }) {
  const playSound = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`bg-white p-4 sm:p-5 md:p-6 rounded-2xl border ${isLearned ? 'border-green-200 bg-green-50/40 opacity-80' : 'border-gray-200'} shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300 group overflow-hidden relative flex flex-col md:flex-row md:items-start lg:items-center gap-4 w-full`}>
      {/* Word & Phonetic Section */}
      <div className="flex flex-col gap-2.5 md:gap-3 md:w-1/3 lg:w-1/4 relative z-10 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
        <div className="flex items-center justify-between md:justify-start gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-violet-600 transition-all break-words">
            {data.word}
          </h3>
          <div className="flex items-center gap-2">
            {data.englishWord && (
              <button 
                onClick={() => playSound(data.englishWord!)}
                className="text-gray-400 hover:text-violet-600 bg-gray-50 hover:bg-violet-50 p-2 sm:p-2.5 rounded-xl transition-all active:scale-95 border border-gray-100 shadow-sm shrink-0"
                title="Nghe phát âm tiếng Anh"
              >
                <Volume2 size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            )}
            <button
              onClick={onToggleLearned}
              className={`p-2 sm:p-2.5 rounded-xl transition-all active:scale-95 border shadow-sm shrink-0 ${isLearned ? 'text-green-600 bg-green-100 border-green-200 hover:bg-green-200' : 'text-gray-400 bg-gray-50 border-gray-100 hover:bg-gray-100 hover:text-green-500'}`}
              title={isLearned ? "Bỏ đánh dấu đã học" : "Đánh dấu đã học"}
            >
              {isLearned ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {data.type && <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 border border-violet-100 px-2 sm:px-2.5 py-1 rounded-md shrink-0">{data.type}</span>}
          {data.phonetic && <span className="text-xs sm:text-sm text-gray-500 font-medium bg-gray-50 px-2 sm:px-2.5 py-1 rounded-md border border-gray-200">{data.phonetic}</span>}
        </div>
      </div>

      {/* Meanings Section */}
      <div className="flex-1 relative z-10 md:pl-2 pt-1 md:pt-0">
        {data.meaning && data.meaning.length > 0 ? (
          <ul className="space-y-2.5">
            {data.meaning.map((m, idx) => {
              const isExample = m.startsWith('Ví dụ:');
              let engExample = '';
              if (isExample && m.includes(' - ')) {
                const parts = m.split(' - ');
                engExample = parts[parts.length - 1].trim();
              }
              
              return (
                <li key={idx} className="text-gray-700 text-[15px] sm:text-[16px] font-medium flex items-start group/item">
                  <span className="mr-3 text-violet-300 group-hover/item:text-violet-500 transition-colors text-lg leading-none mt-[3px] transform group-hover/item:scale-125 shrink-0">✦</span>
                  <div className="flex-1 flex flex-wrap items-center gap-2 leading-relaxed group-hover/item:text-gray-900 transition-colors">
                    <span>{m}</span>
                    {engExample && (
                      <button 
                        onClick={() => playSound(engExample)}
                        className="text-gray-400 hover:text-violet-600 bg-violet-50 hover:bg-violet-100 p-1.5 rounded-lg transition-all active:scale-95 border border-violet-100 shadow-sm inline-flex items-center justify-center shrink-0"
                        title="Nghe câu ví dụ tiếng Anh"
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <span className="text-gray-400 italic text-sm sm:text-base">Không có nghĩa cụ thể</span>
        )}
      </div>
    </div>
  );
}
