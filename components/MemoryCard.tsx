
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
          aspect-[3/4] rounded-2xl bg-white border-2 border-dashed border-slate-200 
          flex flex-col items-center justify-center cursor-pointer 
          hover:bg-indigo-50 hover:border-indigo-300 hover:scale-105 transition-all duration-300 group shadow-sm
          ${isSelecting ? 'ring-4 ring-indigo-500/20 bg-indigo-50 border-indigo-400 shadow-md' : ''}
        `}
      >
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
          <i className="fa-solid fa-plus text-slate-300 group-hover:text-indigo-500 transition-colors"></i>
        </div>
      </div>
    );
  }

  // Trạng thái thẻ đã chọn
  const bgStyle = card.gradient ? card.gradient : card.bgColor;

  return (
    <div 
      className="relative w-full aspect-[3/4] cursor-pointer group transition-all duration-300 hover:-translate-y-1 active:scale-95"
      onClick={onClick}
    >
      <div className={`
        w-full h-full rounded-2xl border-[3.5px] border-white overflow-hidden 
        flex flex-col items-center justify-center relative shadow-xl shadow-slate-200
        ${bgStyle}
      `}>
         {/* Lớp phủ sáng bóng hiệu ứng 3D nhẹ */}
         <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10 pointer-events-none"></div>
         
         <div className="flex flex-col items-center justify-center w-full h-full p-2 relative z-10">
           <div className={`flex items-center justify-center ${card.subIcon ? 'h-[50%] mb-1' : 'h-[80%]'} w-full`}>
             <i className={`${card.icon} text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]`} 
                style={{ fontSize: card.subIcon ? 'clamp(1rem, 5vw, 1.8rem)' : 'clamp(1.4rem, 8vw, 2.8rem)' }}></i>
           </div>
           
           {card.subIcon && (
             <div className="h-[20%] flex items-center justify-center w-full bg-white/20 backdrop-blur-sm rounded-lg px-2 border border-white/20">
               <i className={`${card.subIcon} text-white text-[clamp(0.6rem, 2vw, 0.9rem)]`}></i>
             </div>
           )}
         </div>
         
         {/* Chỉ báo tương tác xóa */}
         <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-8 h-8 rounded-full bg-white text-rose-500 shadow-lg flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border border-rose-100">
              <i className="fa-solid fa-trash-can text-[10px]"></i>
            </div>
         </div>
      </div>

      {isSelecting && (
        <div className="absolute inset-0 -m-2 border-[3px] border-indigo-500 rounded-[1.4rem] animate-pulse pointer-events-none z-30"></div>
      )}
    </div>
  );
};

export default MemoryCard;
