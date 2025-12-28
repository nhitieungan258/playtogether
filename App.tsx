
import React, { useState, useEffect, useCallback } from 'react';
import { GridSettings, CardData } from './types';
import { CARD_POOL } from './constants';
import MemoryCard from './components/MemoryCard';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GridSettings>({ rows: 3, cols: 8 });
  const [gridData, setGridData] = useState<(CardData | null)[]>([]);
  const [selectingIdx, setSelectingIdx] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mặc định đóng trên mobile

  const initializeGrid = useCallback(() => {
    const totalCells = settings.rows * settings.cols;
    const newGrid = Array(totalCells).fill(null);
    setGridData(newGrid);
    setSelectingIdx(null);
  }, [settings.rows, settings.cols]);

  useEffect(() => {
    if (gridData.length !== settings.rows * settings.cols) {
      initializeGrid();
    }
  }, [settings.rows, settings.cols, gridData.length, initializeGrid]);

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

  const selectCard = (card: CardData) => {
    if (selectingIdx === null) return;
    const newData = [...gridData];
    newData[selectingIdx] = { ...card, id: `${card.id}-${Date.now()}` };
    setGridData(newData);
    setSelectingIdx(null);
  };

  const saveProject = () => {
    localStorage.setItem('memgrid_pro_v1', JSON.stringify({ settings, gridData }));
    setSaveStatus('Đã lưu!');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const loadProject = () => {
    const saved = localStorage.getItem('memgrid_pro_v1');
    if (saved) {
      try {
        const { settings: s, gridData: g } = JSON.parse(saved);
        setSettings(s);
        setGridData(g);
        setSaveStatus('Đã tải!');
        setTimeout(() => setSaveStatus(null), 2000);
      } catch (e) {
        alert('Lỗi tải dữ liệu!');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f1f5f9] text-slate-900 font-sans overflow-hidden">
      {/* Header tối ưu cho mọi thiết bị */}
      <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-all active:scale-90"
          >
            <i className={`fa-solid ${isSidebarOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
              <i className="fa-solid fa-layer-group text-white text-sm sm:text-lg"></i>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-800 hidden xs:block">MemGrid</h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={saveProject} 
              className="p-2 sm:px-4 sm:py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-all flex items-center"
              title="Lưu"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span className="hidden sm:inline ml-2">Lưu</span>
            </button>
            <button 
              onClick={loadProject} 
              className="p-2 sm:px-4 sm:py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-all flex items-center"
              title="Tải lại"
            >
              <i className="fa-solid fa-folder-open"></i>
              <span className="hidden sm:inline ml-2">Mở</span>
            </button>
          </div>
          
          <button 
            onClick={initializeGrid} 
            className="p-2 sm:px-4 sm:py-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center border border-rose-100"
            title="Làm mới"
          >
            <i className="fa-solid fa-trash-can"></i>
            <span className="hidden md:inline ml-2">Xóa hết</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Overlay trên mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed inset-y-16 left-0 w-64 sm:w-72 bg-white border-r border-slate-200 p-6 sm:p-8 z-50 transition-all duration-300 ease-in-out
          lg:relative lg:inset-y-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:absolute lg:invisible'}
        `}>
          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Cài đặt lưới</h3>
              <div className="space-y-8">
                <div className="group">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-slate-600">Hàng (Dọc)</label>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{settings.rows}</span>
                  </div>
                  <input type="range" min="1" max="5" value={settings.rows} onChange={(e) => setSettings(s => ({...s, rows: +e.target.value}))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
                <div className="group">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-slate-600">Cột (Ngang)</label>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{settings.cols}</span>
                  </div>
                  <input type="range" min="1" max="9" value={settings.cols} onChange={(e) => setSettings(s => ({...s, cols: +e.target.value}))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
              </div>
            </section>
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-[#f8fafc] p-4 sm:p-8 flex items-start sm:items-center justify-center relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div 
            className="grid gap-2 sm:gap-4 md:gap-5 w-fit mx-auto py-4 animate-in fade-in zoom-in duration-500" 
            style={{ 
              gridTemplateColumns: `repeat(${settings.cols}, minmax(0, 1fr))` 
            }}
          >
            {gridData.map((card, idx) => (
              <div key={idx} className="w-[35px] xs:w-[45px] sm:w-[65px] md:w-[80px] transition-all duration-300">
                <MemoryCard card={card} onClick={() => handleCellClick(idx)} isSelecting={selectingIdx === idx} />
              </div>
            ))}
          </div>
        </main>
      </div>

      {saveStatus && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel px-5 py-2.5 rounded-full shadow-xl z-[100] animate-in slide-in-from-bottom-4 flex items-center gap-3 text-xs font-bold border border-white/50 ring-1 ring-slate-200">
          <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px]"><i className="fa-solid fa-check"></i></div>
          <span className="text-slate-700">{saveStatus}</span>
        </div>
      )}

      {selectingIdx !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectingIdx(null)}>
          <div className="bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 w-full max-w-[320px] sm:max-w-sm transform animate-in zoom-in duration-300 border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <h3 className="text-lg font-black text-slate-800">Chọn thẻ</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Ô số {selectingIdx + 1}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {CARD_POOL.map((card) => (
                <div key={card.id} className="relative group">
                  <MemoryCard card={card} onClick={() => selectCard(card)} />
                </div>
              ))}
            </div>

            <button onClick={() => setSelectingIdx(null)} className="mt-6 w-full py-3 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl hover:bg-slate-100 transition-colors">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
