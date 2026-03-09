'use client';

interface PaletteStripProps {
  colors: string[];
}

export function PaletteStrip({ colors }: PaletteStripProps) {
  return (
    <div className="palette-strip">
      <p className="palette-strip__label">추출 컬러</p>
      <div className="palette-strip__colors">
        {colors.map((color, i) => (
          <span key={i} className="palette-strip__swatch" style={{ background: color }} title={color} />
        ))}
      </div>
    </div>
  );
}
