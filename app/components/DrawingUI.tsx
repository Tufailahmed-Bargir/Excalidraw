import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pen,
  MousePointer,
  Plus,
  Eraser,
  Square,
  Circle,
  Triangle,
  Star,
  Hexagon,
  Pentagon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";
import { Shape } from "../types";

interface ToolButtonProps {
  name: string;
  icon: LucideIcon;
  tooltip: string;
  isActive: boolean;
  onClick: () => void;
}

export const ToolButton: React.FC<ToolButtonProps> = ({
  name,
  icon: Icon,
  tooltip,
  isActive,
  onClick,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={isActive ? "default" : "outline"}
        size="icon"
        onClick={onClick}
        className={`transition-all duration-200 ${isActive ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
      >
        <Icon className="h-5 w-5" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

interface ShapeDropdownProps {
  onSelectShape: (shape: Shape["type"]) => void;
}

export const ShapeDropdown: React.FC<ShapeDropdownProps> = ({
  onSelectShape,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="icon" className="hover:bg-blue-100">
        <Plus className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => onSelectShape("rectangle")}>
        <Square className="mr-2 h-4 w-4" />
        <span>Rectangle</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSelectShape("circle")}>
        <Circle className="mr-2 h-4 w-4" />
        <span>Circle</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSelectShape("triangle")}>
        <Triangle className="mr-2 h-4 w-4" />
        <span>Triangle</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSelectShape("star")}>
        <Star className="mr-2 h-4 w-4" />
        <span>Star</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSelectShape("hexagon")}>
        <Hexagon className="mr-2 h-4 w-4" />
        <span>Hexagon</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSelectShape("pentagon")}>
        <Pentagon className="mr-2 h-4 w-4" />
        <span>Pentagon</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

interface ColorPickerProps {
  color: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="relative">
        <input
          type="color"
          value={color}
          onChange={onChange}
          className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer opacity-0 absolute"
        />
        <div
          className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
          style={{ backgroundColor: color }}
        />
      </div>
    </TooltipTrigger>
    <TooltipContent>
      <p>Color Picker</p>
    </TooltipContent>
  </Tooltip>
);

interface StrokeWidthSliderProps {
  strokeWidth: number;
  onChange: (value: number[]) => void;
}

export const StrokeWidthSlider: React.FC<StrokeWidthSliderProps> = ({
  strokeWidth,
  onChange,
}) => (
  <div className="w-32 flex items-center space-x-2">
    <span className="text-sm font-medium">Width:</span>
    <Slider
      min={1}
      max={10}
      step={1}
      value={[strokeWidth]}
      onValueChange={onChange}
      className="flex-grow"
    />
    <span className="text-sm font-medium">{strokeWidth}</span>
  </div>
);
