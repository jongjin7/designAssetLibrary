export interface Asset {
  id: string;
  fileName: string;
  extension: string;
  fileSize: string;
  mimeType: string;
  thumbnailGradient: string;
  thumbnail?: string;
  palette: string[];
  tags: string[];
  createdAt: string;
  isFavorite: boolean;
}
