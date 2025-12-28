
import React from 'react';
import { CardData } from '../types';

interface MemoryCardProps {
  card: CardData | null;
  onClick: () => void;
  isSelecting?: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ card, onClick, isSelecting }) => {
  // Trạng thái ô trống
  if (!card) {
    return (
      <div 
        onClick={onClick}
        className={`
          aspect-[3/4] rounded-lg sm:rounded-2xl bg-white border border-dashed border-slate-200 
          flex flex-col items-center justify-center cursor-pointer 
          hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 group shadow-sm
          ${isSelecting ? 'ring-2 ring-indigo-500/50 bg-indigo-50 border-indigo-400 shadow-md' : ''}
        `}
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-all">
          <i className="fa-solid fa-plus text-slate-300 group-hover:text-indigo-500 text-[10px] sm:text-xs transition-colors"></i>
        </div>
      </div>
    );
  }

  // Trạng thái thẻ đã chọn
  const bgStyle = card.gradient ? card.gradient : card.bgColor;

  return (
    <div 
      className="relative w-full aspect-[3/4] cursor-pointer group transition-all duration-200 active:scale-90"
      onClick={onClick}
    >
      <div className={`
        w-full h-full rounded-lg sm:rounded-2xl border-[2px] sm:border-[3.5px] border-white overflow-hidden 
        flex flex-col items-center justify-center relative shadow-md sm:shadow-xl shadow-slate-200
        ${bgStyle}
      `}>
         <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10 pointer-events-none"></div>
         
         <div className="flex flex-col items-center justify-center w-full h-full p-1 sm:p-2 relative z-10">
           <div className={`flex items-center justify-center ${card.subIcon ? 'h-[50%] mb-0.5' : 'h-[80%]'} w-full`}>
             <i className={`${card.icon} text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]`} 
                style={{ fontSize: card.subIcon ? 'clamp(0.8rem, 4vw, 1.4rem)' : 'clamp(1rem, 6vw, 2.2rem)' }}></i>
           </div>
           
           {card.subIcon && (
             <div className="h-[20%] flex items-center justify-center w-full bg-white/20 backdrop-blur-sm rounded-md px-1 border border-white/10">
               <i className={`${card.subIcon} text-white text-[clamp(0.5rem, 1.5vw, 0.7rem)]`}></i>
             </div>
           )}
         </div>
         
         {/* Nút xóa nhanh hiển thị khi hover (PC) hoặc nhấn giữ (Mobile - mô phỏng bằng active) */}
         <div className="absolute inset-0 bg-rose-500/0 sm:group-hover:bg-rose-500/10 flex items-center justify-center opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-rose-500 shadow-lg flex items-center justify-center border border-rose-100">
              <i className="fa-solid fa-trash-can text-[8px] sm:text-[10px]"></i>
            </div>
         </div>
      </div>

      {isSelecting && (
        <div className="absolute inset-0 -m-1 sm:-m-2 border-[2px] sm:border-[3px] border-indigo-500 rounded-lg sm:rounded-[1.4rem] animate-pulse pointer-events-none z-30"></div>
      )}
    </div>
  );
};

export default MemoryCard;
