import { useState, useRef, useEffect } from "react";
import { Shape, Path } from "../types";
import { isPointInShape, getResizeHandle, isPathInSelection, isShapeInSelection } from "../utils/shapeUtils";

export const useDrawingLogic = (tool: string, color: string, strokeWidth: number) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);
  const [resizingShape, setResizingShape] = useState<{ id: number, handle: string, startX: number, startY: number, startWidth: number, startHeight: number } | null>(null);
  const [selection, setSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);

  const erase = (cursor: { x: number; y: number }) => {
    const eraserSize = strokeWidth * 2;
    setPaths(prev => prev.filter(path => !isPathNearPoint(path.d, cursor, eraserSize)));
    setShapes(prev => prev.filter(shape => !isPointInShape(shape, cursor)));
  };

  const isPathNearPoint = (pathD: string, point: { x: number; y: number }, distance: number): boolean => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    const length = path.getTotalLength();
    const step = length / 100;
    for (let i = 0; i <= length; i += step) {
      const p = path.getPointAtLength(i);
      const dx = p.x - point.x;
      const dy = p.y - point.y;
      if (Math.sqrt(dx * dx + dy * dy) <= distance) {
        return true;
      }
    }
    return false;
  };

  const resizeShape = (endX: number, endY: number) => {
    if (!resizingShape) return;

    setShapes(prev => prev.map((shape, index) => {
      if (index !== resizingShape.id) return shape;

      let { x, y, width, height } = shape;
      const dx = endX - resizingShape.startX;
      const dy = endY - resizingShape.startY;

      switch (resizingShape.handle) {
        case 'nw':
          width = resizingShape.startWidth - dx;
          height = resizingShape.startHeight - dy;
          x = resizingShape.startX + dx;
          y = resizingShape.startY + dy;
          break;
        case 'ne':
          width = resizingShape.startWidth + dx;
          height = resizingShape.startHeight - dy;
          y = resizingShape.startY + dy;
          break;
        case 'se':
          width = resizingShape.startWidth + dx;
          height = resizingShape.startHeight + dy;
          break;
        case 'sw':
          width = resizingShape.startWidth - dx;
          height = resizingShape.startHeight + dy;
          x = resizingShape.startX + dx;
          break;
      }

      return { ...shape, x, y, width: Math.max(10, width), height: Math.max(10, height) };
    }));
  };

  const deleteSelection = () => {
    if (selection) {
      setPaths(prev => prev.filter(path => !isPathInSelection(path.d, selection)));
      setShapes(prev => prev.filter(shape => !isShapeInSelection(shape, selection)));
      setSelection(null);
    }
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const getMousePosition = (e: MouseEvent) => {
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      return point.matrixTransform(svg.getScreenCTM()!.inverse());
    };

    const handleMouseDown = (e: MouseEvent) => {
      const cursor = getMousePosition(e);
      setIsDrawing(true);

      if (tool === 'pan') {
        setIsPanning(true);
        setPanStart({ x: cursor.x - pan.x, y: cursor.y - pan.y });
      } else if (tool === 'select') {
        const clickedShapeId = shapes.findIndex(shape => isPointInShape(shape, cursor));
        if (clickedShapeId !== -1) {
          setSelectedShapeId(clickedShapeId);
          const handle = getResizeHandle(shapes[clickedShapeId], cursor);
          if (handle) {
            const shape = shapes[clickedShapeId];
            setResizingShape({
              id: clickedShapeId,
              handle,
              startX: cursor.x,
              startY: cursor.y,
              startWidth: shape.width,
              startHeight: shape.height
            });
          }
        } else {
          setSelectionStart(cursor);
          setSelection(null);
          setSelectedShapeId(null);
        }
      } else if (tool === 'pen') {
        setCurrentPath(`M${cursor.x - pan.x},${cursor.y - pan.y}`);
      } else if (tool === 'eraser') {
        erase({ x: cursor.x - pan.x, y: cursor.y - pan.y });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing && !isPanning) return;
      const cursor = getMousePosition(e);

      if (tool === 'pan' && isPanning) {
        setPan({
          x: cursor.x - panStart.x,
          y: cursor.y - panStart.y
        });
      } else if (tool === 'select') {
        if (resizingShape) {
          resizeShape(cursor.x, cursor.y);
        } else if (selectionStart) {
          setSelection({
            x: Math.min(selectionStart.x, cursor.x),
            y: Math.min(selectionStart.y, cursor.y),
            width: Math.abs(cursor.x - selectionStart.x),
            height: Math.abs(cursor.y - selectionStart.y)
          });
        }
      } else if (tool === 'pen') {
        setCurrentPath(prev => `${prev} L${cursor.x - pan.x},${cursor.y - pan.y}`);
      } else if (tool === 'eraser') {
        erase({ x: cursor.x - pan.x, y: cursor.y - pan.y });
      }
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      setIsPanning(false);
      setResizingShape(null);
      if (tool === 'pen' && currentPath) {
        setPaths(prev => [...prev, { d: currentPath, color, strokeWidth }]);
        setCurrentPath("");
      }
      setSelectionStart(null);
    };

    svg.addEventListener('mousedown', handleMouseDown);
    svg.addEventListener('mousemove', handleMouseMove);
    svg.addEventListener('mouseup', handleMouseUp);
    svg.addEventListener('mouseleave', handleMouseUp);

    return () => {
      svg.removeEventListener('mousedown', handleMouseDown);
      svg.removeEventListener('mousemove', handleMouseMove);
      svg.removeEventListener('mouseup', handleMouseUp);
      svg.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDrawing, isPanning, currentPath, tool, color, strokeWidth, shapes, resizingShape, pan, panStart]);

  return {
    svgRef,
    paths,
    setPaths,
    currentPath,
    shapes,
    setShapes,
    selectedShapeId,
    resizingShape,
    selection,
    setSelection,
    deleteSelection,
    pan,
  };
};