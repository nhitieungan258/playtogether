
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
    setSaveStatus('Dữ liệu đã được lưu an toàn!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const loadProject = () => {
    const saved = localStorage.getItem('memgrid_pro_v1');
    if (saved) {
      try {
        const { settings: s, gridData: g } = JSON.parse(saved);
        setSettings(s);
        setGridData(g);
        setSaveStatus('Đã khôi phục sơ đồ cũ!');
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (e) {
        alert('Không thể tải dữ liệu!');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f1f5f9] text-slate-900 font-sans overflow-hidden">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-all active:scale-90"
          >
            <i className={`fa-solid ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'} text-lg`}></i>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 ring-2 ring-indigo-50">
              <i className="fa-solid fa-layer-group text-white text-lg"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-extrabold tracking-tight text-slate-800 leading-none">MemGrid Studio</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-1">Hệ thống tạo sơ đồ</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={saveProject} className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">Lưu máy</button>
            <button onClick={loadProject} className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">Mở lại</button>
          </div>
          <button onClick={initializeGrid} className="bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-rose-100">
            <i className="fa-solid fa-trash-can"></i>
            <span className="hidden sm:inline">Làm trống bảng</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`fixed inset-y-16 left-0 w-72 bg-white border-r border-slate-200 p-8 z-40 transition-all duration-300 ease-in-out lg:relative lg:inset-y-0 ${isSidebarOpen ? 'translate-x-0 opacity-100 shadow-xl lg:shadow-none' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:p-0 lg:opacity-0 lg:invisible'}`}>
          <div className="space-y-10">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cấu hình lưới</h3>
              </div>
              <div className="space-y-10">
                <div className="group">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-bold text-slate-600">Hàng (Dọc)</label>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{settings.rows} / 5</span>
                  </div>
                  <input type="range" min="1" max="5" step="1" value={settings.rows} onChange={(e) => setSettings(s => ({...s, rows: +e.target.value}))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
                <div className="group">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-bold text-slate-600">Cột (Ngang)</label>
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{settings.cols} / 9</span>
                  </div>
                  <input type="range" min="1" max="9" step="1" value={settings.cols} onChange={(e) => setSettings(s => ({...s, cols: +e.target.value}))} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                </div>
              </div>
            </section>
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-[#f8fafc] p-8 flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <div className="grid gap-4 md:gap-5 w-fit mx-auto animate-in fade-in zoom-in duration-500" style={{ gridTemplateColumns: `repeat(${settings.cols}, minmax(0, 1fr))` }}>
            {gridData.map((card, idx) => (
              <div key={idx} className="w-[55px] sm:w-[70px] md:w-[85px] transition-all duration-300">
                <MemoryCard card={card} onClick={() => handleCellClick(idx)} isSelecting={selectingIdx === idx} />
              </div>
            ))}
          </div>
        </main>
      </div>

      {saveStatus && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom-4 flex items-center gap-4 text-sm font-bold border border-white/50 ring-1 ring-slate-200">
          <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm"><i className="fa-solid fa-check"></i></div>
          <span className="text-slate-700">{saveStatus}</span>
        </div>
      )}

      {selectingIdx !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in" onClick={() => setSelectingIdx(null)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full transform animate-in zoom-in duration-300 border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8 text-center">
              <div className="w-full">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Thư viện 9 thẻ</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Chọn thẻ cho vị trí {selectingIdx + 1}</p>
              </div>
            </div>
            
            {/* Lưới 3x3 cho 9 thẻ */}
            <div className="grid grid-cols-3 gap-6">
              {CARD_POOL.map((card) => (
                <div key={card.id} className="relative group">
                  <MemoryCard card={card} onClick={() => selectCard(card)} />
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 rounded-2xl pointer-events-none transition-all"></div>
                </div>
              ))}
            </div>

            <button onClick={() => setSelectingIdx(null)} className="mt-10 w-full py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-colors">
              Hủy bỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
