
export interface CardData {
  id: string;
  icon: string;
  subIcon?: string; // Icon phụ nằm phía dưới
  color: string;
  name: string;
  gradient?: string; // Class tailwind cho background
  bgColor?: string;  // Cho màu đơn sắc
}

export interface GridSettings {
  rows: number;
  cols: number;
}
