
import React, { useState, useEffect, useCallback } from 'react';
import { GridSettings, CardData } from './types';
import { CARD_POOL } from './constants';
import MemoryCard from './components/MemoryCard';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GridSettings>({ rows: 3, cols: 8 });
  const [gridData, setGridData] = useState<(CardData | null)[]>([]);
  const [selectingIdx, setSelectingIdx] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Khởi tạo bảng
  const resetGrid = useCallback((empty = true) => {
    const totalCells = settings.rows * settings.cols;
    const newGrid: (CardData | null)[] = [];
    for (let i = 0; i < totalCells; i++) {
      newGrid.push(null);
    }
    setGridData(newGrid);
    setSelectingIdx(null);
  }, [settings.rows, settings.cols]);

  useEffect(() => {
    if (gridData.length !== settings.rows * settings.cols) {
      resetGrid(true);
    }
  }, [settings.rows, settings.cols, resetGrid, gridData.length]);

  const handleCellClick = (index: number) => {
    if (gridData[index] !== null) {
      const newData = [...gridData];
      newData[index] = null;
      setGridData(newData);
      setSelectingIdx(null);
    } else {
      setSelectingIdx(index);
    }
  };

  const setCardAtPosition = (card: CardData) => {
    if (selectingIdx === null) return;
    const newData = [...gridData];
    newData[selectingIdx] = { ...card, id: `${card.id}-${selectingIdx}-${Math.random()}` };
    setGridData(newData);
    setSelectingIdx(null);
  };

  const saveToLocal = () => {
    localStorage.setItem('memgrid_save_v2', JSON.stringify({ settings, gridData }));
    setSaveStatus('Tiến trình đã được lưu!');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const loadFromLocal = () => {
    const saved = localStorage.getItem('memgrid_save_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed.settings);
        setGridData(parsed.gridData);
        setSaveStatus('Đã khôi phục sơ đồ!');
        setTimeout(() => setSaveStatus(null), 2500);
      } catch (e) { console.error(e); }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f1f5f9] text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors lg:hidden"
          >
            <i className={`fa-solid ${isSidebarOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-brain text-white"></i>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-800 leading-none">MemGrid Studio</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Professional Trainer</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button onClick={saveToLocal} className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">Lưu</button>
            <button onClick={loadFromLocal} className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">Tải lại</button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Settings */}
        <aside className={`
          fixed inset-y-16 left-0 w-72 bg-white border-r border-slate-200 p-8 z-40 transition-transform duration-300 transform
          lg:relative lg:inset-y-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:p-0 lg:opacity-0 lg:invisible'}
        `}>
          <div className="space-y-10">
            <section>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <i className="fa-solid fa-sliders text-indigo-500"></i>
                Cấu hình bảng
              </h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-bold text-slate-600">Hàng (Dọc)</label>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{settings.rows} / 5</span>
                  </div>
                  <input type="range" min="1" max="5" value={settings.rows} onChange={(e) => setSettings(s => ({...s, rows: +e.target.value}))} className="w-full accent-indigo-600" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-bold text-slate-600">Cột (Ngang)</label>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{settings.cols} / 9</span>
                  </div>
                  <input type="range" min="1" max="9" value={settings.cols} onChange={(e) => setSettings(s => ({...s, cols: +e.target.value}))} className="w-full accent-indigo-600" />
                </div>
              </div>
            </section>

            <section className="pt-8 border-t border-slate-100">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Hướng dẫn</h3>
               <div className="space-y-4">
                 <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                   <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                     Nhấp vào các ô trống để chọn biểu tượng và sắp xếp sơ đồ ghi nhớ của bạn.
                   </p>
                 </div>
                 <button onClick={() => resetGrid(true)} className="w-full py-3 rounded-xl border-2 border-slate-100 text-slate-400 text-xs font-bold hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center gap-2">
                   <i className="fa-solid fa-rotate-right"></i> Làm mới bảng
                 </button>
               </div>
            </section>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 overflow-auto bg-[#f8fafc] p-6 lg:p-12 flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div 
            className="grid gap-4 md:gap-6 w-full max-w-7xl mx-auto pb-12" 
            style={{ 
              gridTemplateColumns: `repeat(${settings.cols}, minmax(0, 1fr))`,
              maxWidth: `${settings.cols * 100}px`
            }}
          >
            {gridData.map((card, idx) => (
              <MemoryCard 
                key={idx}
                card={card} 
                onClick={() => handleCellClick(idx)} 
                isSelecting={selectingIdx === idx} 
              />
            ))}
          </div>
        </main>
      </div>

      {saveStatus && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom-4 flex items-center gap-3 text-sm font-bold border border-white/10">
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px]">
            <i className="fa-solid fa-check"></i>
          </div>
          {saveStatus}
        </div>
      )}

      {selectingIdx !== null && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in"
          onClick={() => setSelectingIdx(null)}
        >
          <div 
            className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-lg w-full transform animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-800">Chọn biểu tượng</h3>
                <p className="text-xs text-slate-400 mt-1">Vị trí ô số {selectingIdx + 1}</p>
              </div>
              <button onClick={() => setSelectingIdx(null)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {CARD_POOL.map((card) => (
                <div key={card.id} className="relative group">
                  <MemoryCard 
                    card={card} 
                    onClick={() => setCardAtPosition(card)} 
                  />
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 rounded-2xl pointer-events-none transition-colors"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
