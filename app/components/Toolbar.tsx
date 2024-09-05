import React from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToolButton, ShapeDropdown, ColorPicker, StrokeWidthSlider } from "./DrawingUI";
import { Pen, MousePointer, Eraser, Trash2, Move } from "lucide-react";

interface ToolbarProps {
  tool: string;
  setTool: (tool: string) => void;
  color: string;
  setColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  selection: { x: number; y: number; width: number; height: number } | null;
  deleteSelection: () => void;
  setSelectedShape: (shape: string | null) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
  selection,
  deleteSelection,
  setSelectedShape,
}) => {
  const toolButtons = [
    { name: 'pen', icon: Pen, tooltip: 'Pen' },
    { name: 'select', icon: MousePointer, tooltip: 'Select' },
    { name: 'eraser', icon: Eraser, tooltip: 'Eraser' },
    { name: 'pan', icon: Move, tooltip: 'Pan' },
  ];

  return (
    <header className="bg-white p-4 shadow-md">
      <div className="flex justify-center items-center space-x-4">
        <TooltipProvider>
          <div className="flex space-x-2">
            {toolButtons.map((btn) => (
              <ToolButton
                key={btn.name}
                name={btn.name}
                icon={btn.icon}
                tooltip={btn.tooltip}
                isActive={tool === btn.name}
                onClick={() => setTool(btn.name)}
              />
            ))}
          </div>
          <ShapeDropdown onSelectShape={setSelectedShape} />
          <ColorPicker color={color} onChange={(e) => setColor(e.target.value)} />
          <StrokeWidthSlider strokeWidth={strokeWidth} onChange={(value: number[]) => setStrokeWidth(value[0])} />
          {selection && (
            <ToolButton
              name="delete"
              icon={Trash2}
              tooltip="Delete Selection"
              isActive={false}
              onClick={deleteSelection}
            />
          )}
        </TooltipProvider>
      </div>
    </header>
  );
};