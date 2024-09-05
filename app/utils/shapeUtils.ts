import { Shape } from "../types";

export const getShapePath = (shape: Shape): string => {
  const { type, x, y, width, height } = shape;
  switch (type) {
    case 'rectangle':
      return `M${x},${y} h${width} v${height} h-${width} Z`;
    case 'circle':
      return `M${x},${y + height / 2} a${width / 2},${height / 2} 0 1,0 ${width},0 a${width / 2},${height / 2} 0 1,0 -${width},0`;
    case 'triangle':
      return `M${x},${y + height} L${x + width / 2},${y} L${x + width},${y + height} Z`;
    case 'star':
      const outerRadius = Math.min(width, height) / 2;
      const innerRadius = outerRadius / 2;
      let path = `M${x + width / 2},${y}`;
      for (let i = 0; i < 5; i++) {
        const outerAngle = i * 4 * Math.PI / 5;
        const innerAngle = outerAngle + Math.PI / 5;
        path += ` L${x + width / 2 + Math.cos(outerAngle) * outerRadius},${y + height / 2 + Math.sin(outerAngle) * outerRadius}`;
        path += ` L${x + width / 2 + Math.cos(innerAngle) * innerRadius},${y + height / 2 + Math.sin(innerAngle) * innerRadius}`;
      }
      return path + ' Z';
    case 'hexagon':
      const side = Math.min(width, height) / 2;
      return `M${x + side},${y} l${side},${height / 2} l-${side},${height / 2} l-${side},-${height / 2} l${side},-${height / 2} Z`;
    case 'pentagon':
      const radius = Math.min(width, height) / 2;
      let pentPath = `M${x + width / 2},${y}`;
      for (let i = 1; i <= 5; i++) {
        const angle = i * 2 * Math.PI / 5 - Math.PI / 2;
        pentPath += ` L${x + width / 2 + radius * Math.cos(angle)},${y + height / 2 + radius * Math.sin(angle)}`;
      }
      return pentPath + ' Z';
    default:
      return '';
  }
};

export const isPointInShape = (shape: Shape, point: { x: number; y: number }): boolean => {
  const { x, y, width, height } = shape;
  switch (shape.type) {
    case 'rectangle':
      return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
    case 'circle':
      const dx = point.x - (x + width / 2);
      const dy = point.y - (y + height / 2);
      return dx * dx + dy * dy <= (width / 2) * (width / 2);
    // Add cases for other shapes as needed
    default:
      return false;
  }
};

export const getResizeHandle = (shape: Shape, point: { x: number; y: number }): string | null => {
  const handleSize = 10;
  const { x, y, width, height } = shape;
  const handles = [
    { name: 'nw', x: x, y: y },
    { name: 'ne', x: x + width, y: y },
    { name: 'se', x: x + width, y: y + height },
    { name: 'sw', x: x, y: y + height },
  ];
  for (const handle of handles) {
    if (Math.abs(handle.x - point.x) <= handleSize && Math.abs(handle.y - point.y) <= handleSize) {
      return handle.name;
    }
  }
  return null;
};

export const isPathInSelection = (pathD: string, selection: { x: number; y: number; width: number; height: number }): boolean => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  const length = path.getTotalLength();
  const step = length / 100; // Check 100 points along the path
  for (let i = 0; i <= length; i += step) {
    const p = path.getPointAtLength(i);
    if (p.x >= selection.x && p.x <= selection.x + selection.width && p.y >= selection.y && p.y <= selection.y + selection.height) {
      return true;
    }
  }
  return false;
};

export const isShapeInSelection = (shape: Shape, selection: { x: number; y: number; width: number; height: number }): boolean => {
  const { x, y, width, height } = shape;
  return x >= selection.x && x + width <= selection.x + selection.width &&
         y >= selection.y && y + height <= selection.y + selection.height;
};