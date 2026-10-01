import { Volume2 } from 'lucide-react';
import type { WordData } from '../types/word';

export default function WordCard({ data }: { data: WordData }) {
  const playSound = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden relative flex flex-col md:flex-row md:items-start lg:items-center gap-4 w-full">
      {/* Subtle glow effect on hover */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-teal-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-teal-500/5 transition-colors duration-500 pointer-events-none" />
      
      {/* Word & Phonetic Section */}
      <div className="flex flex-col gap-2.5 md:gap-3 md:w-1/3 lg:w-1/4 relative z-10 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
        <div className="flex items-center justify-between md:justify-start gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-teal-400 transition-all break-words">
            {data.word}
          </h3>
          <button 
            onClick={() => playSound(data.word)}
            className="text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/30 p-2 sm:p-2.5 rounded-xl transition-all active:scale-95 border border-indigo-500/20 shadow-sm shrink-0"
            title="Nghe phát âm"
          >
            <Volume2 size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {data.type && <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 sm:px-2.5 py-1 rounded-md shrink-0">{data.type}</span>}
          {data.phonetic && <span className="text-xs sm:text-sm text-slate-400 font-medium bg-slate-900/50 px-2 sm:px-2.5 py-1 rounded-md border border-white/5">{data.phonetic}</span>}
        </div>
      </div>

      {/* Meanings Section */}
      <div className="flex-1 relative z-10 md:pl-2 pt-1 md:pt-0">
        {data.meaning && data.meaning.length > 0 ? (
          <ul className="space-y-2.5">
            {data.meaning.map((m, idx) => (
              <li key={idx} className="text-slate-300 text-[15px] sm:text-[16px] font-medium flex items-start group/item">
                <span className="mr-3 text-indigo-400/50 group-hover/item:text-indigo-400 transition-colors text-lg leading-none mt-[3px] transform group-hover/item:scale-125 shrink-0">✦</span>
                <span className="flex-1 leading-relaxed group-hover/item:text-slate-100 transition-colors">{m}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-slate-500 italic text-sm sm:text-base">Không có nghĩa cụ thể</span>
        )}
      </div>
    </div>
  );
}
