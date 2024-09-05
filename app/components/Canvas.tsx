import React from 'react';
import { Shape, Path } from '../types';

interface CanvasProps {
  svgRef: React.RefObject<SVGSVGElement>;
  paths: Path[];
  currentPath: string;
  shapes: Shape[];
  color: string;
  strokeWidth: number;
  selectedShapeId: number | null;
  resizingShape: { id: number, handle: string, startX: number, startY: number, startWidth: number, startHeight: number } | null;
  handleSvgClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  getShapePath: (shape: Shape) => string;
  tool: string;
  selection: { x: number; y: number; width: number; height: number } | null;
  pan: { x: number; y: number };
}

export const Canvas: React.FC<CanvasProps> = ({
  svgRef,
  paths,
  currentPath,
  shapes,
  color,
  strokeWidth,
  selectedShapeId,
  resizingShape,
  handleSvgClick,
  getShapePath,
  tool,
  selection,
  pan,
}) => {
  const renderResizeHandles = (shape: Shape) => {
    const { x, y, width, height } = shape;
    const handles = [
      { cx: x, cy: y, cursor: 'nwse-resize', handle: 'nw' },
      { cx: x + width, cy: y, cursor: 'nesw-resize', handle: 'ne' },
      { cx: x + width, cy: y + height, cursor: 'nwse-resize', handle: 'se' },
      { cx: x, cy: y + height, cursor: 'nesw-resize', handle: 'sw' },
    ];

    return handles.map((handle, i) => (
      <circle
        key={`handle-${i}`}
        cx={handle.cx}
        cy={handle.cy}
        r="5"
        fill="blue"
        style={{ cursor: handle.cursor }}
      />
    ));
  };

  return (
    <svg 
      className="w-full h-full" 
      id="drawing-area" 
      ref={svgRef}
      onClick={handleSvgClick}
      style={{ cursor: tool === 'select' ? 'default' : tool === 'pan' ? 'move' : 'crosshair' }}
    >
      <g transform={`translate(${pan.x}, ${pan.y})`}>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" transform={`translate(${-pan.x}, ${-pan.y})`} />
        {paths.map((path, index) => (
          <path key={`path-${index}`} d={path.d} stroke={path.color} strokeWidth={path.strokeWidth} fill="none" />
        ))}
        {tool !== 'select' && currentPath && <path d={currentPath} stroke={color} strokeWidth={strokeWidth} fill="none" />}
        {shapes.map((shape, index) => {
          const isSelected = index === selectedShapeId;
          return (
            <g key={`shape-${index}`}>
              <path
                d={getShapePath(shape)}
                stroke={shape.color}
                strokeWidth={shape.strokeWidth}
                fill="none"
                style={{ cursor: tool === 'select' ? 'move' : 'crosshair' }}
              />
              {isSelected && tool === 'select' && renderResizeHandles(shape)}
            </g>
          );
        })}
        {selection && (
          <rect
            x={selection.x}
            y={selection.y}
            width={selection.width}
            height={selection.height}
            fill="none"
            stroke="blue"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        )}
      </g>
    </svg>
  );
};