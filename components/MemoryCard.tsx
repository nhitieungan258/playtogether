
import React from 'react';
import { CardData } from '../types';

interface MemoryCardProps {
  card: CardData | null;
  onClick: () => void;
  isSelecting?: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ card, onClick, isSelecting }) => {
  if (!card) {
    return (
      <div 
        onClick={onClick}
        className={`aspect-[3/4] rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all group shadow-sm ${isSelecting ? 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-400 shadow-md scale-95' : ''}`}
      >
        <i className="fa-solid fa-plus text-slate-300 group-hover:text-indigo-400 transition-colors text-xl"></i>
      </div>
    );
  }

  const bgClass = card.gradient ? card.gradient : card.bgColor;

  return (
    <div 
      className="relative w-full aspect-[3/4] cursor-pointer group transition-transform duration-200 active:scale-95"
      onClick={onClick}
    >
      <div className={`w-full h-full rounded-2xl border-[3px] border-white overflow-hidden flex flex-col items-center justify-center relative shadow-lg ${bgClass}`}>
         <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 pointer-events-none"></div>
         <div className="flex flex-col items-center justify-center w-full h-full p-2 relative z-10">
           <div className={`flex items-center justify-center ${card.subIcon ? 'h-[50%] mb-1' : 'h-[75%]'} w-full`}>
             <i className={`${card.icon} text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]`} 
                style={{ fontSize: card.subIcon ? 'clamp(1.2rem, 4vw, 1.8rem)' : 'clamp(1.5rem, 6vw, 2.5rem)' }}></i>
           </div>
           {card.subIcon && (
             <div className="h-[20%] flex items-center justify-center w-full">
               <i className={`${card.subIcon} text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`} 
                  style={{ fontSize: 'clamp(0.7rem, 2.5vw, 1rem)' }}></i>
             </div>
           )}
         </div>
         
         {/* Nút xóa nhanh */}
         <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            <div className="bg-white/30 backdrop-blur-md w-6 h-6 rounded-full flex items-center justify-center text-white border border-white/40 shadow-sm hover:bg-rose-500 transition-colors">
              <i className="fa-solid fa-xmark text-[10px]"></i>
            </div>
         </div>
      </div>

      {isSelecting && (
        <div className="absolute inset-0 -m-1.5 border-2 border-indigo-500 rounded-[1.2rem] animate-pulse pointer-events-none z-30"></div>
      )}
    </div>
  );
};

export default MemoryCard;
