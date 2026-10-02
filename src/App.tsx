import { useState, useMemo, useEffect } from 'react';
import { BookOpen, Library, Globe, X } from 'lucide-react';

import vietnameseWordsData from './assets/data/vietnamese-words';
import vietnameseA1Data from './assets/data/vietnamese-a1-data.json';
import WordCard from './components/WordCard';
import type { WordData } from './types/word';


type TabId = 'vi-words' | 'vi-a1';

const TABS = [

  { id: 'vi-words', label: 'Từ vựng Tiếng Việt', icon: Library, desc: 'Theo chủ đề' },
  { id: 'vi-a1', label: 'Tiếng Việt A1', icon: Globe, desc: 'Ngữ pháp & Từ vựng cơ bản' },
] as const;

// Data normalization functions


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

  'vi-words': getVietnameseWordsData(),
  'vi-a1': getA1Data()
};

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('vi-words');
  const [searchTerm, setSearchTerm] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const currentDataset = datasets[activeTab];

  const [learnedWords, setLearnedWords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('learnedWords');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('learnedWords', JSON.stringify(learnedWords));
  }, [learnedWords]);

  const toggleLearned = (word: string) => {
    setLearnedWords(prev => 
      prev.includes(word) 
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  const filteredWords = useMemo(() => {
    let result = currentDataset;
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = currentDataset.filter(item => item.word.toLowerCase().includes(lowerSearch));
    }
    
    return [...result].sort((a, b) => {
      const aLearned = learnedWords.includes(a.word);
      const bLearned = learnedWords.includes(b.word);
      if (aLearned && !bLearned) return 1;
      if (!aLearned && bLearned) return -1;
      return 0;
    });
  }, [searchTerm, currentDataset, learnedWords]);



  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);

    setSearchTerm('');
    setIsSidebarOpen(false);
  };



  return (
    <div className="min-h-screen font-sans relative bg-slate-50 text-slate-900 flex flex-col">
      {/* Sidebar toggle button (Tab) */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-[calc(50%+34px)] left-0 -translate-y-1/2 bg-violet-500 text-white py-6 w-[12px] flex items-center justify-center rounded-r-md shadow-md hover:bg-violet-600 transition-colors z-40 opacity-70 hover:opacity-100"
        title="Mở danh mục"
        aria-label="Mở danh mục"
      >
        <div className="w-[2px] h-4 bg-white/70 rounded-full" />
      </button>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[88vw] max-w-sm border-r border-gray-200 bg-white p-4 md:p-6 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-4 md:mb-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-violet-50 rounded-xl border border-violet-100">
              <BookOpen className="text-violet-600 w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Từ Điển
            </h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            title="Đóng"
            aria-label="Đóng danh mục"
          >
            <X size={18} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-2 md:gap-3 overflow-y-auto pb-4">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl transition-all duration-300 border text-left flex-shrink-0 w-[200px] md:w-auto ${
                  isActive 
                    ? 'bg-violet-50 border-violet-200 shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors shrink-0 ${isActive ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-500'}`}>
                  <Icon size={20} />
                </div>
                <div className="overflow-hidden">
                  <h3 className={`font-bold text-sm md:text-lg truncate ${isActive ? 'text-violet-900' : 'text-gray-700'}`}>
                    {tab.label}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 font-medium truncate">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 relative z-10 w-full min-h-screen overflow-x-hidden">
        <div className="max-w-6xl mx-auto pb-10">

          <div className="flex flex-col gap-3 md:gap-4 mb-10 md:mb-12">
            {filteredWords.map((item, idx) => (
              <WordCard 
                key={`${item.word}-${idx}`} 
                data={item} 
                isLearned={learnedWords.includes(item.word)}
                onToggleLearned={() => toggleLearned(item.word)}
              />
            ))}
          </div>

          {filteredWords.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-sm">
              <div className="text-6xl mb-6 opacity-50">🔍</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">Không tìm thấy kết quả</h3>
              <p className="text-gray-500 text-lg">Vui lòng thử tìm kiếm với một từ khoá khác.</p>
            </div>
          )}


        </div>
      </main>
    </div>
  );
}

export default App;
