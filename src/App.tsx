import { useState, useMemo } from 'react';
import { BookOpen, Search } from 'lucide-react';
import wordsData from './assets/data/oxford-5000.json';
import WordCard from './components/WordCard';
import type { WordData } from './types/word';

const ITEMS_PER_PAGE = 30;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  
  const typedWordsData = wordsData as WordData[];

  const filteredWords = useMemo(() => {
    if (!searchTerm.trim()) return typedWordsData;
    const lowerSearch = searchTerm.toLowerCase();
    return typedWordsData.filter(item => item.word.toLowerCase().includes(lowerSearch));
  }, [searchTerm, typedWordsData]);

  const totalPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE);
  const currentWords = filteredWords.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-2xl mb-4 shadow-sm border border-indigo-100">
            <BookOpen className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">Oxford 5000 Words</h1>
          <p className="text-lg text-gray-600">
            Luyện phát âm chuẩn theo từ điển Oxford
          </p>
        </header>

        <div className="bg-white p-2 pl-4 rounded-full shadow-sm border border-gray-200 mb-8 flex items-center gap-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <Search className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm từ vựng..." 
            className="flex-1 outline-none text-lg bg-transparent py-2"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
          <div className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-sm font-medium mr-1">
            {filteredWords.length} từ
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {currentWords.map((item, idx) => (
            <WordCard key={`${item.word}-${idx}`} data={item} />
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center py-16 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy kết quả</h3>
            <p>Vui lòng thử tìm kiếm với một từ khoá khác.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-8 mb-12">
            <button 
              disabled={page === 1}
              onClick={() => {
                setPage(p => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700 shadow-sm active:scale-95"
            >
              Trang trước
            </button>
            <span className="text-gray-600 font-semibold bg-gray-100 px-4 py-1.5 rounded-lg">
              {page} / {totalPages}
            </span>
            <button 
              disabled={page === totalPages}
              onClick={() => {
                setPage(p => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700 shadow-sm active:scale-95"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
