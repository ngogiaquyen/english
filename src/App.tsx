import { useState, useMemo } from 'react';
import { BookOpen, Search, Library, Languages, Globe } from 'lucide-react';
import engVietnameseData from './assets/data/eng-vietnamese.json';
import vietnameseWordsData from './assets/data/vietnamese-words';
import vietnameseA1Data from './assets/data/vietnamese-a1-data.json';
import WordCard from './components/WordCard';
import type { WordData } from './types/word';

const ITEMS_PER_PAGE = 30;

type TabId = 'eng-vi' | 'vi-words' | 'vi-a1';

const TABS = [
  { id: 'eng-vi', label: 'Từ điển Anh - Việt', icon: Languages, desc: 'Tra cứu từ vựng tiếng Anh' },
  { id: 'vi-words', label: 'Từ vựng Tiếng Việt', icon: Library, desc: 'Theo chủ đề' },
  { id: 'vi-a1', label: 'Tiếng Việt A1', icon: Globe, desc: 'Ngữ pháp & Từ vựng cơ bản' },
] as const;

// Data normalization functions
const getEngVietData = (): WordData[] => engVietnameseData as WordData[];

const getVietnameseWordsData = (): WordData[] => {
  return (vietnameseWordsData as any[]).map((item) => {
    const meaning = [];
    if (item.en) meaning.push(item.en);
    if (item.example_vn || item.example_en) {
      meaning.push(`Ví dụ: ${item.example_vn || ''} - ${item.example_en || ''}`);
    }
    return {
      word: item.vn,
      type: item.category,
      phonetic: item.north ? `Bắc: ${item.north}` : undefined,
      meaning: meaning
    };
  });
};

const getA1Data = (): WordData[] => {
  const result: WordData[] = [];
  const keysToExtract = [
    'adjectives',
    'verbs',
    'nouns',
    'grammar_core',
    'grammar_directions_and_prepositions',
    'grammar_extra_modal_verbs'
  ];
  
  keysToExtract.forEach(key => {
    const arr = (vietnameseA1Data as any)[key];
    if (Array.isArray(arr)) {
      arr.forEach(item => {
        if (!item.vi) return;
        const meaning = [];
        if (item.en) meaning.push(item.en);
        if (item.sVi || item.sEn) {
          meaning.push(`Ví dụ: ${item.sVi || ''} - ${item.sEn || ''}`);
        }
        if (item.note) {
          meaning.push(`Lưu ý: ${item.note}`);
        }
        result.push({
          word: item.vi,
          type: item.type || item.cat || key,
          phonetic: item.alt ? `Alt: ${item.alt}` : undefined,
          meaning: meaning
        });
      });
    }
  });
  return result;
};

// Use memo to cache parsed datasets
const datasets: Record<TabId, WordData[]> = {
  'eng-vi': getEngVietData(),
  'vi-words': getVietnameseWordsData(),
  'vi-a1': getA1Data()
};

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('eng-vi');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  
  const currentDataset = datasets[activeTab];

  const filteredWords = useMemo(() => {
    if (!searchTerm.trim()) return currentDataset;
    const lowerSearch = searchTerm.toLowerCase();
    return currentDataset.filter(item => item.word.toLowerCase().includes(lowerSearch));
  }, [searchTerm, currentDataset]);

  const totalPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE);
  const currentWords = filteredWords.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setPage(1);
    setSearchTerm('');
  };

  const activeTabConfig = TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen font-sans relative overflow-hidden bg-slate-950 text-slate-200 selection:bg-indigo-500/30 flex flex-col md:flex-row">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] md:w-[50%] md:h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] md:w-[50%] md:h-[50%] rounded-full bg-teal-600/20 blur-[120px] pointer-events-none" />
      
      {/* Sidebar */}
      <aside className="w-full md:w-80 md:h-screen md:sticky md:top-0 border-b md:border-b-0 md:border-r border-white/10 bg-slate-900/80 backdrop-blur-3xl p-4 md:p-6 relative z-20 flex flex-col flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-10">
          <div className="p-2 md:p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <BookOpen className="text-indigo-400 w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-teal-400">
            Từ Điển
          </h2>
        </div>
        
        <nav className="flex flex-row md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-4 md:mx-0 px-4 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl transition-all duration-300 border text-left flex-shrink-0 w-[200px] md:w-auto ${
                  isActive 
                    ? 'bg-white/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                    : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors shrink-0 ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-slate-400'}`}>
                  <Icon size={20} />
                </div>
                <div className="overflow-hidden">
                  <h3 className={`font-bold text-sm md:text-lg truncate ${isActive ? 'text-indigo-100' : 'text-slate-300'}`}>
                    {tab.label}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium truncate">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 relative z-10 md:h-screen md:overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto pb-10">
          <header className="mb-6 md:mb-10 text-center md:text-left mt-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400 drop-shadow-sm">
              {activeTabConfig?.label}
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium px-4 md:px-0">
              Khám phá dữ liệu từ vựng với thiết kế hiện đại và mượt mà.
            </p>
          </header>

          <div className="bg-white/5 backdrop-blur-2xl p-2 pl-4 md:pl-6 rounded-2xl md:rounded-full shadow-2xl border border-white/10 mb-8 md:mb-10 flex flex-col sm:flex-row items-center gap-3 focus-within:border-indigo-500/50 focus-within:bg-white/10 transition-all duration-300 group hover:border-white/20 w-full">
            <div className="flex w-full sm:flex-1 items-center gap-3 bg-white/5 sm:bg-transparent rounded-xl sm:rounded-none px-3 sm:px-0">
              <Search className="text-slate-400 group-focus-within:text-indigo-400 transition-colors shrink-0" size={22} />
              <input 
                type="text" 
                placeholder="Tìm kiếm từ vựng..." 
                className="flex-1 outline-none text-base md:text-lg bg-transparent py-3 md:py-4 text-slate-100 placeholder:text-slate-500 font-medium w-full"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="w-full sm:w-auto bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 px-5 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-full text-sm font-bold sm:mr-1 backdrop-blur-md shadow-inner whitespace-nowrap text-center">
              {filteredWords.length.toLocaleString()} từ
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 mb-10 md:mb-12">
            {currentWords.map((item, idx) => (
              <WordCard key={`${item.word}-${idx}`} data={item} />
            ))}
          </div>

          {filteredWords.length === 0 && (
            <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-[2.5rem] border border-dashed border-white/10 shadow-2xl">
              <div className="text-6xl mb-6 drop-shadow-lg">🔍</div>
              <h3 className="text-2xl font-bold text-slate-200 mb-3">Không tìm thấy kết quả</h3>
              <p className="text-slate-400 text-lg">Vui lòng thử tìm kiếm với một từ khoá khác.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 mb-16 pb-10">
              <button 
                disabled={page === 1}
                onClick={() => {
                  setPage(p => p - 1);
                  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-white/20 transition-all font-bold text-slate-300 shadow-lg active:scale-95"
              >
                Trang trước
              </button>
              <span className="text-indigo-300 font-bold bg-indigo-500/10 border border-indigo-500/20 px-6 py-3 rounded-2xl backdrop-blur-md shadow-inner">
                {page} / {totalPages}
              </span>
              <button 
                disabled={page === totalPages}
                onClick={() => {
                  setPage(p => p + 1);
                  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-white/20 transition-all font-bold text-slate-300 shadow-lg active:scale-95"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
