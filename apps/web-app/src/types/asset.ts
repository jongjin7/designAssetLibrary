export interface Asset {
  id: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  thumbnailGradient: string;
  thumbnail?: string; // Optional field for real image URLs
  palette: string[];
  tags: string[];
  createdAt: string;
  isFavorite: boolean;
}
