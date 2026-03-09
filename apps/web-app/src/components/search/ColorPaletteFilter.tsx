'use client';

const paletteColors = [
  { hex: '#F43F5E', label: 'Red' },
  { hex: '#3B82F6', label: 'Blue' },
  { hex: '#FBBF24', label: 'Yellow' },
  { hex: '#10B981', label: 'Green' },
  { hex: '#1E293B', label: 'Black' },
  { hex: '#F8FAFC', label: 'White' },
  { hex: '#8B5CF6', label: 'Purple' },
  { hex: '#FB923C', label: 'Orange' },
];

interface ColorPaletteFilterProps {
  onColorTap: (color: string) => void;
}

export function ColorPaletteFilter({ onColorTap }: ColorPaletteFilterProps) {
  return (
    <div className="color-palette-filter">
      <p className="color-palette-filter__label">추천 컬러 검색</p>
      <div className="color-palette-filter__grid">
        {paletteColors.map(c => (
          <button
            key={c.hex}
            className="color-palette-filter__swatch"
            style={{ background: c.hex }}
            onClick={() => onColorTap(c.label.toLowerCase())}
            aria-label={c.label}
          />
        ))}
      </div>
    </div>
  );
}
