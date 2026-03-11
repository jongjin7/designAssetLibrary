'use client';

interface PaletteStripProps {
  colors: string[];
  isAiRefined?: boolean;
}

export function PaletteStrip({ colors, isAiRefined }: PaletteStripProps) {
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    alert(`${color} 색상이 복사되었습니다!`);
  };

  return (
    <div className="palette-strip">
      <div className="palette-strip__header">
        <p className="palette-strip__label">추출된 핵심 컬러</p>
        {isAiRefined && <span className="ai-badge-text">AI Refined</span>}
      </div>
      <div className="palette-strip__colors">
        {colors.map((color, i) => (
          <button 
            key={i} 
            className="palette-strip__swatch" 
            style={{ background: color }} 
            onClick={() => copyToClipboard(color)}
            title={`클릭하여 복사: ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
