export interface Shape {
  type: 'rectangle' | 'circle' | 'triangle' | 'star' | 'hexagon' | 'pentagon';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
}

export interface Path {
  d: string;
  color: string;
  strokeWidth: number;
}