'use client'

import React, { useState } from "react";
import { Toolbar } from "./components/Toolbar";
import { Canvas } from "./components/Canvas";
import { useDrawingLogic } from "./components/DrawingLogic";
import { getShapePath } from "./utils/shapeUtils";
import { Shape } from "./types";

export default function Home() {
  const [tool, setTool] = useState<'pen' | 'select' | 'eraser' | 'pan'>('pen');
  const [color, setColor] = useState<string>("#000000");
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [selectedShape, setSelectedShape] = useState<Shape['type'] | null>(null);

  const {
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
  } = useDrawingLogic(tool, color, strokeWidth);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (selectedShape) {
      const svg = svgRef.current;
      if (!svg) return;

      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const cursor = point.matrixTransform(svg.getScreenCTM()!.inverse());

      setShapes(prev => [...prev, { type: selectedShape, x: cursor.x, y: cursor.y, color, strokeWidth, width: 50, height: 50 }]);
      setSelectedShape(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <Toolbar
        tool={tool}
        setTool={(newTool) => setTool(newTool as 'pen' | 'select' | 'eraser' | 'pan')}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        setSelectedShape={(shape) => setSelectedShape(shape as Shape['type'] | null)}
        selection={selection}
        deleteSelection={deleteSelection}
      />
      <main className="flex-grow bg-white m-4 rounded-lg shadow-lg overflow-hidden">
        <Canvas
          svgRef={svgRef}
          paths={paths}
          currentPath={currentPath}
          shapes={shapes}
          color={color}
          strokeWidth={strokeWidth}
          selectedShapeId={selectedShapeId}
          resizingShape={resizingShape}
          handleSvgClick={handleSvgClick}
          getShapePath={getShapePath}
          tool={tool}
          selection={selection}
          pan={pan}
        />
      </main>
    </div>
  );
}
