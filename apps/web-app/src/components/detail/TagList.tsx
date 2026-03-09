'use client';

interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className="tag-list">
      <p className="tag-list__label">태그</p>
      <div className="tag-list__chips">
        {tags.map(tag => (
          <span key={tag} className="tag-chip">#{tag}</span>
        ))}
      </div>
    </div>
  );
}
